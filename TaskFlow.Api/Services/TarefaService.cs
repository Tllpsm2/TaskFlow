using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Services;

public class TarefaService(AppDbContext db)
{
    public async Task<List<TarefaResponse>> GetAsync(StatusTarefa? status = null)
    {
        var query = db.Tarefas.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        var tarefas = await query
            .OrderByDescending(t => t.DataCriacao)
            .ToListAsync();

        return tarefas.Select(t => t.ToResponse()).ToList();
    }
    public async Task<TarefaResponse?> GetByIdAsync(int id)
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        return tarefa?.ToResponse();
    }

    public async Task<TarefaResponse> PostAsync(TarefaRequest request)
    {
        var tarefa = request.ToEntity();

        db.Tarefas.Add(tarefa);
        await db.SaveChangesAsync();

        return tarefa.ToResponse();
    }

    public async Task<TarefaResponse> PutAsync(int id, TarefaRequest request)
    {
        var tarefa = await db.Tarefas.FindAsync(id);

        if (tarefa == null)
            throw new KeyNotFoundException($"Tarefa {id} não encontrada");

        tarefa.Titulo = request.Titulo.Trim();
        tarefa.Descricao = request.Descricao.Trim();

        if (tarefa.Status != request.Status)
        {
            tarefa.Status = request.Status;

            if (tarefa.Status == StatusTarefa.Pendente)
                tarefa.DataInicio = null;
            else if (tarefa.DataInicio == null)
                tarefa.DataInicio = DateTime.UtcNow;

            if (tarefa.Status == StatusTarefa.Concluida)
                tarefa.DataConclusao = DateTime.UtcNow;
            else
                tarefa.DataConclusao = null;
        }
        await db.SaveChangesAsync();
        return tarefa.ToResponse();
    }

    public async Task DeleteAsync(int id)
    {
        var tarefa = await db.Tarefas.FindAsync(id);
        if (tarefa == null)
            throw new KeyNotFoundException($"Tarefa {id} não encontrada");

        db.Tarefas.Remove(tarefa);
        await db.SaveChangesAsync();
        return;
    }
}