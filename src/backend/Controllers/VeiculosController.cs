using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Dtos;
using Parking.Api.Models;
using Parking.Api.Services;

namespace Parking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VeiculosController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly PlacaService _placa;
        public VeiculosController(AppDbContext db, PlacaService placa) { _db = db; _placa = placa; }

        [HttpGet]
        public async Task<IActionResult> List([FromQuery] Guid? clienteId = null)
        {
            var q = _db.Veiculos.AsQueryable();
            if (clienteId.HasValue) q = q.Where(v => v.ClienteId == clienteId.Value);
            var list = await q.OrderBy(v => v.Placa).ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VeiculoCreateDto dto)
        {
            var placa = _placa.Sanitizar(dto.Placa);
            if (!_placa.EhValida(placa)) return BadRequest("Placa invalida.");
            if (await _db.Veiculos.AnyAsync(v => v.Placa == placa)) return Conflict("Placa ja existe.");

            var hoje = DateTime.UtcNow.Date;
            var v = new Veiculo { Placa = placa, Modelo = dto.Modelo, Ano = dto.Ano, ClienteId = dto.ClienteId, DataInclusao = hoje };
            _db.Veiculos.Add(v);
            // Cada criacao abre um registro de historico para permitir faturamento retroativo
            _db.VeiculosHistorico.Add(new VeiculoClienteHistorico
            {
                VeiculoId = v.Id,
                ClienteId = v.ClienteId,
                Inicio = hoje
            });

            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = v.Id }, v);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var v = await _db.Veiculos.FindAsync(id);
            return v == null ? NotFound() : Ok(v);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] VeiculoUpdateDto dto)
        {
            var v = await _db.Veiculos.FindAsync(id);
            if (v == null) return NotFound();
            var placa = _placa.Sanitizar(dto.Placa);
            if (!_placa.EhValida(placa)) return BadRequest("Placa invalida.");
            if (await _db.Veiculos.AnyAsync(x => x.Placa == placa && x.Id != id)) return Conflict("Placa ja existe.");

            v.Placa = placa;
            v.Modelo = dto.Modelo;
            v.Ano = dto.Ano;

            if (v.ClienteId != dto.ClienteId)
            {
                var hoje = DateTime.UtcNow.Date;
                // Fechamos o historico aberto antes de iniciar o novo cliente
                var historicoAberto = await _db.VeiculosHistorico
                    .Where(h => h.VeiculoId == v.Id && h.Fim == null)
                    .OrderByDescending(h => h.Inicio)
                    .FirstOrDefaultAsync();

                if (historicoAberto != null)
                {
                    var fim = hoje.AddDays(-1);
                    historicoAberto.Fim = fim < historicoAberto.Inicio ? historicoAberto.Inicio : fim;
                }

                v.ClienteId = dto.ClienteId;
                v.DataInclusao = hoje;
                // Abre o novo periodo de posse do veiculo
                _db.VeiculosHistorico.Add(new VeiculoClienteHistorico
                {
                    VeiculoId = v.Id,
                    ClienteId = dto.ClienteId,
                    Inicio = hoje
                });
            }

            await _db.SaveChangesAsync();
            return Ok(v);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var v = await _db.Veiculos.FindAsync(id);
            if (v == null) return NotFound();

            var historicoAberto = await _db.VeiculosHistorico
                .Where(h => h.VeiculoId == v.Id && h.Fim == null)
                .ToListAsync();

            var fim = DateTime.UtcNow.Date;
            foreach (var h in historicoAberto)
            {
                // Garantimos que nenhum registro fique com vigencia em aberto apos remover o veiculo
                h.Fim = fim < h.Inicio ? h.Inicio : fim;
            }

            _db.Veiculos.Remove(v);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
