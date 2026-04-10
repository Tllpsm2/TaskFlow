using System;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.DTOs;

public static class TarefaMapper
{
    // TarefaRequest -> Tarefa
    public static Tarefa ToEntity(this TarefaRequest request)
    {
        return new Tarefa
        {
            Titulo = request.Titulo,
            Descricao = request.Descricao,
            Status = StatusTarefa.Pendente // bugfix: define o status inicial como Pendente, não permite definir o status na criação
        };
    }
    // Tarefa -> TarefaResponse
    public static TarefaResponse ToResponse(this Tarefa tarefa)
    {
        return new TarefaResponse
        {
            Id = tarefa.Id,
            Titulo = tarefa.Titulo,
            Descricao = tarefa.Descricao,
            DataInicio = tarefa.DataInicio,
            DataCriacao = tarefa.DataCriacao,
            DataConclusao = tarefa.DataConclusao,
            Status = tarefa.Status
        };
    }
}
