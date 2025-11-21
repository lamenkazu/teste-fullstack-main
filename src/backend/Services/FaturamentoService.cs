using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Models;

namespace Parking.Api.Services
{
    public class FaturamentoService
    {
        private readonly AppDbContext _db;
        public FaturamentoService(AppDbContext db) => _db = db;

        public async Task<List<Fatura>> GerarAsync(string competencia, CancellationToken ct = default)
        {
            // competencia formato yyyy-MM
            var part = competencia.Split('-');
            var ano = int.Parse(part[0]);
            var mes = int.Parse(part[1]);
            var ultimoDia = DateTime.DaysInMonth(ano, mes);
            var inicioCompetencia = new DateTime(ano, mes, 1, 0, 0, 0, DateTimeKind.Utc);
            var fimCompetencia = new DateTime(ano, mes, ultimoDia, 23, 59, 59, DateTimeKind.Utc);

            var mensalistas = await _db.Clientes
                .Where(c => c.Mensalista)
                .AsNoTracking()
                .ToListAsync(ct);

            var mensalistaIds = mensalistas.Select(c => c.Id).ToList();

            // Apenas vigencias que cruzam a competencia atual para poder calcular quantos dias cada cliente usou
            var historicos = await _db.VeiculosHistorico
                .Include(h => h.Veiculo)
                .Where(h =>
                    mensalistaIds.Contains(h.ClienteId) &&
                    h.Inicio <= fimCompetencia &&
                    (h.Fim == null || h.Fim.Value >= inicioCompetencia))
                .AsNoTracking()
                .ToListAsync(ct);

            var criadas = new List<Fatura>();

            foreach (var cli in mensalistas) {
                var existente = await _db.Faturas
                    .FirstOrDefaultAsync(f => f.ClienteId == cli.Id && f.Competencia == competencia, ct);
                if (existente != null) continue;

                var historicoDoCliente = historicos.Where(h => h.ClienteId == cli.Id).ToList();
                if (!historicoDoCliente.Any()) continue;

                // Acumula quantos dias cada veiculo ficou com o cliente dentro da janela do mes
                var diasPorVeiculo = new Dictionary<Guid, (int dias, string nome)>();
                foreach (var hist in historicoDoCliente) {
                    var inicio = hist.Inicio.Date < inicioCompetencia.Date ? inicioCompetencia.Date : hist.Inicio.Date;
                    var fim = (hist.Fim ?? fimCompetencia).Date > fimCompetencia.Date
                        ? fimCompetencia.Date
                        : (hist.Fim ?? fimCompetencia).Date;

                    var dias = (int)(fim - inicio).TotalDays + 1;
                    if (dias <= 0) continue;

                    if (diasPorVeiculo.TryGetValue(hist.VeiculoId, out var atual))
                        diasPorVeiculo[hist.VeiculoId] = (atual.dias + dias, atual.nome);
                    else
                        diasPorVeiculo[hist.VeiculoId] = (dias, hist.Veiculo?.Placa ?? hist.VeiculoId.ToString());
                }

                if (!diasPorVeiculo.Any()) continue;

                decimal valorTotal = 0m;

                var fat = new Fatura {
                    Competencia = competencia,
                    ClienteId = cli.Id,
                };

                // Converte os dias em valor proporcional utilizando a mensalidade vigente do cliente
                foreach (var entry in diasPorVeiculo) {
                    var dias = entry.Value.dias;
                    var valorVeiculo = ((cli.ValorMensalidade ?? 0m) * dias) / ultimoDia;
                    valorTotal += valorVeiculo;
                    fat.Veiculos.Add(new FaturaVeiculo { FaturaId = fat.Id, VeiculoId = entry.Key });
                }

                fat.Valor = Math.Round(valorTotal, 2);
                fat.Observacao = null;

                _db.Faturas.Add(fat);
                criadas.Add(fat);
            }

            await _db.SaveChangesAsync(ct);
            return criadas;
        }
    }
}
