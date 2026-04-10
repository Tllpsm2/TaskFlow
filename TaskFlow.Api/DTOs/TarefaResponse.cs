using TaskFlow.Api.Models;

namespace TaskFlow.Api.DTOs;

public class TarefaResponse
{
    public int Id { get; set; }
    public required string Titulo { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime? DataInicio { get; set; }
    public DateTime? DataConclusao { get; set; }
    public StatusTarefa Status { get; set; }
}
