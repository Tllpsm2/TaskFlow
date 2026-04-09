using System;
using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.Models;

public enum StatusTarefa
{
    [Display(Name = "Pendente")]
    Pendente,

    [Display(Name = "Em Andamento")]
    EmAndamento,

    [Display(Name = "Concluída")]
    Concluida
}

public class Tarefa
{
    public int Id { get; set; } 
    public required string Titulo { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime? DataInicio { get; set; }
    public DateTime? DataConclusao { get; set; }
    public StatusTarefa Status { get; set; } = StatusTarefa.Pendente;
}
