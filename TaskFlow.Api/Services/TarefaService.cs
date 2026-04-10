using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public class TarefaService(AppDbContext db)
{
    public async Task<List<TarefaResponse>> ListarAsync(StatusTarefa? status = null)
    {
        var query = db.Tarefas.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        var tarefas = await query
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return tarefas.Select(t => t.ToResponse()).ToList();
    }
    public async Task<TarefaResponse?> BuscarIdAsync(int id)
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        return tarefa?.ToResponse();
    }

    public async Task<TarefaResponse> CriarAsync(TarefaRequest request)
    {
        var tarefa = request.ToEntity();

        db.Tarefas.Add(tarefa);
        await db.SaveChangesAsync();

        return tarefa.ToResponse();
    }

    public async Task<TarefaResponse> AtualizarAsync(int id, TarefaRequest request)
    {
        var tarefa = await db.Tarefas.FindAsync(id);

        if (tarefa == null)
            throw new KeyNotFoundException($"Tarefa {id} não encontrada");

        tarefa.Titulo = request.Titulo.Trim(); // Remove espaços acidentais
        tarefa.Descricao = request.Descricao.Trim();

        // Bugfix: Atualiza as datas com base no novo status, somente se o status tiver sido modificado
        if (tarefa.Status != request.Status)
        {
            tarefa.Status = request.Status;

            // data de início
            if (tarefa.Status == StatusTarefa.Pendente)
                tarefa.DataInicio = null;
            else if (tarefa.DataInicio == null) // Somente definir a data de início se ainda não tiver sido definida
                tarefa.DataInicio = DateTime.UtcNow;

            // data de conclusão
            if (tarefa.Status == StatusTarefa.Concluida)
                tarefa.DataConclusao = DateTime.UtcNow;
            else
                tarefa.DataConclusao = null;
        }
        await db.SaveChangesAsync();
        return tarefa.ToResponse();
    }

    public async Task DeletarAsync(int id)
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        if (tarefa == null)
            throw new KeyNotFoundException($"Tarefa {id} não encontrada");

        db.Tarefas.Remove(tarefa);
        await db.SaveChangesAsync();
        return;
    }
}