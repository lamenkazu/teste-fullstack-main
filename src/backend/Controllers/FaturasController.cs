using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Dtos;
using Parking.Api.Services;

namespace Parking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaturasController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly FaturamentoService _fat;
        public FaturasController(AppDbContext db, FaturamentoService fat) { _db = db; _fat = fat; }

        [HttpPost("gerar")]
        public async Task<IActionResult> Gerar([FromBody] GerarFaturaRequest req, CancellationToken ct)
        {
            var criadas = await _fat.GerarAsync(req.Competencia, ct);
            return Ok(new { criadas = criadas.Count });
        }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] string? competencia = null) {
            // Incluido Cliente e FaturaVeiculo para montar o resumo da tela
            var q = _db.Faturas
                .AsNoTracking()
                .Include(f => f.Cliente)
                .Include(f => f.Veiculos)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(competencia))
                q = q.Where(f => f.Competencia == competencia);

            var faturas = await q.OrderByDescending(f => f.CriadaEm).ToListAsync();

            // Consulta de placas e historico uma vez para reaproveitar durante o loop
            var veiculoIds = faturas.SelectMany(f => f.Veiculos.Select(v => v.VeiculoId)).Distinct().ToList();
            var veiculosDict = await _db.Veiculos
                .Where(v => veiculoIds.Contains(v.Id))
                .ToDictionaryAsync(v => v.Id, v => v.Placa);

            var historicos = await _db.VeiculosHistorico
                .Where(h => veiculoIds.Contains(h.VeiculoId))
                .ToListAsync();

            var list = new List<FaturaListItemDto>();

            foreach (var f in faturas) {
                var part = f.Competencia.Split('-');
                var ano = int.Parse(part[0]);
                var mes = int.Parse(part[1]);
                var diasMes = DateTime.DaysInMonth(ano, mes);
                var inicio = new DateTime(ano, mes, 1);
                var fim = new DateTime(ano, mes, diasMes, 23, 59, 59, DateTimeKind.Utc);

                var veiculosResumo = new List<FaturaVeiculoResumoDto>();
                decimal valorTotal = 0m;
                var valorMensal = f.Cliente?.ValorMensalidade ?? 0m;

                foreach (var fv in f.Veiculos) {
                    var placa = veiculosDict.TryGetValue(fv.VeiculoId, out var p) ? p : string.Empty;

                    // Seleciona apenas os periodos em que o veiculo estava com este cliente
                    var historicoDoVeiculo = historicos
                        .Where(h => h.VeiculoId == fv.VeiculoId && h.ClienteId == f.ClienteId)
                        .ToList();

                    var diasCobertos = 0;
                    foreach (var h in historicoDoVeiculo) {
                        var ini = h.Inicio.Date < inicio.Date ? inicio.Date : h.Inicio.Date;
                        var fimHist = (h.Fim ?? fim).Date > fim.Date ? fim.Date : (h.Fim ?? fim).Date;
                        var dias = (int)(fimHist - ini).TotalDays + 1;
                        if (dias > 0) diasCobertos += dias;
                    }

                    // Valor proporcional do veiculo considerando os dias efetivamente cobrados
                    var valorParcial = Math.Round((valorMensal * diasCobertos) / diasMes, 2);
                    valorTotal += valorParcial;

                    veiculosResumo.Add(new FaturaVeiculoResumoDto(placa, diasCobertos, diasMes, valorParcial));
                }

                list.Add(new FaturaListItemDto(
                    f.Id,
                    f.Competencia,
                    f.ClienteId,
                    f.Cliente?.Nome ?? string.Empty,
                    Math.Round(valorTotal, 2),
                    f.CriadaEm,
                    f.Veiculos.Count,
                    veiculosResumo
                ));
            }

            return Ok(list);
        }

        [HttpGet("{id:guid}/placas")]
        public async Task<IActionResult> Placas(Guid id)
        {
            var placas = await _db.FaturasVeiculos
                .Where(x => x.FaturaId == id)
                .Join(_db.Veiculos, fv => fv.VeiculoId, v => v.Id, (fv, v) => v.Placa)
                .ToListAsync();
            return Ok(placas);
        }
    }
}
