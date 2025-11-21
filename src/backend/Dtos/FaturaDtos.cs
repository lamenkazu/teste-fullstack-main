
namespace Parking.Api.Dtos {
    public record GerarFaturaRequest(string Competencia);

    public record FaturaVeiculoResumoDto(string Placa, int Dias, int DiasMes, decimal Valor);

    public record FaturaListItemDto (
        Guid Id,
        string Competencia,
        Guid ClienteId,
        string ClienteNome,
        decimal Valor,
        DateTime CriadaEm,
        int QtdVeiculos,
        List<FaturaVeiculoResumoDto> Veiculos
    );
}
