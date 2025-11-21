using System.ComponentModel.DataAnnotations;

namespace Parking.Api.Models {
    // Rastreia a vigência de um veículo em cada cliente para faturar de forma proporcional
    public class VeiculoClienteHistorico {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required] public Guid VeiculoId { get; set; }
        [Required] public Guid ClienteId { get; set; }

        // Datas em UTC e com precisão diária para facilitar o cálculo por mês
        public DateTime Inicio { get; set; } = DateTime.UtcNow.Date;
        public DateTime? Fim { get; set; }

        public Veiculo? Veiculo { get; set; }
        public Cliente? Cliente { get; set; }
    }
}
