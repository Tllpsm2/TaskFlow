using System.ComponentModel.DataAnnotations;

namespace TaskFlow.Api.DTOs;

public class TarefaRequest
{
    [Display(Name = "Título da Tarefa")]
    [Required(ErrorMessage = "O título é obrigatório.")]
    public required string Titulo { get; set; } = string.Empty;

    [Display(Name = "Descrição da Tarefa")]
    public string Descricao { get; set; } = string.Empty;
}