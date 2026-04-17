import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { StatusTarefa, Tarefa, TarefaRequest } from './models/models';

@Injectable({
  providedIn: 'root'
})
export class MockTarefaService {
  private readonly tempoRespostaMs = 150;

  private tarefasMockDb: Tarefa[] = [
    {
      id: 1,
      titulo: 'Ajustar modelo da tarefa',
      descricao: 'Revisar campos da entidade e deixar tudo alinhado com o backend.',
      status: 'Concluida',
      dataCriacao: '2026-04-01T09:10:00.000Z',
      dataInicio: '2026-04-01T09:30:00.000Z',
      dataConclusao: '2026-04-01T11:45:00.000Z'
    },
    {
      id: 2,
      titulo: 'Criar DTOs da tarefa',
      descricao: 'Separar entrada e saída da API para facilitar a manutenção.',
      status: 'Concluida',
      dataCriacao: '2026-04-02T10:00:00.000Z',
      dataInicio: '2026-04-02T10:20:00.000Z',
      dataConclusao: '2026-04-02T13:00:00.000Z'
    },
    {
      id: 3,
      titulo: 'Revisar service de tarefas',
      descricao: 'Ajustar validações e fluxo de atualização de status.',
      status: 'EmAndamento',
      dataCriacao: '2026-04-03T08:30:00.000Z',
      dataInicio: '2026-04-03T09:00:00.000Z'
    },
    {
      id: 4,
      titulo: 'Fechar controller de tarefas',
      descricao: 'Conferir os endpoints de listar, criar, editar e excluir.',
      status: 'EmAndamento',
      dataCriacao: '2026-04-04T08:00:00.000Z',
      dataInicio: '2026-04-04T08:40:00.000Z'
    },
    {
      id: 5,
      titulo: 'Organizar lista no Angular',
      descricao: 'Separar as tarefas por status na tela principal.',
      status: 'EmAndamento',
      dataCriacao: '2026-04-05T14:00:00.000Z',
      dataInicio: '2026-04-05T14:25:00.000Z'
    },
    {
      id: 6,
      titulo: 'Ajustar tratamento de erro',
      descricao: 'Padronizar as respostas quando algo falhar na API.',
      status: 'Pendente',
      dataCriacao: '2026-04-06T09:00:00.000Z'
    },
    {
      id: 7,
      titulo: 'Criar testes da API',
      descricao: 'Cobrir os cenários principais de tarefas.',
      status: 'Pendente',
      dataCriacao: '2026-04-06T11:20:00.000Z'
    },
    {
      id: 8,
      titulo: 'Atualizar README',
      descricao: 'Colocar o passo a passo de execução local.',
      status: 'Pendente',
      dataCriacao: '2026-04-07T08:10:00.000Z'
    },
    {
      id: 9,
      titulo: 'Revisar environment do Angular',
      descricao: 'Deixar a URL da API pronta para subir o app.',
      status: 'Pendente',
      dataCriacao: '2026-04-07T16:45:00.000Z'
    }
  ];

  listar(status?: StatusTarefa): Observable<Tarefa[]> {
    const tarefas = status ? this.tarefasMockDb.filter(tarefa => tarefa.status === status) : this.tarefasMockDb;
    return of(tarefas.map(tarefa => ({ ...tarefa }))).pipe(delay(this.tempoRespostaMs));
  }

  buscarPorId(id: number): Observable<Tarefa> {
    const tarefa = this.tarefasMockDb.find(item => item.id === id);

    if (!tarefa) {
      return throwError(() => new Error(`Tarefa com id ${id} não encontrada.`));
    }

    return of({ ...tarefa }).pipe(delay(this.tempoRespostaMs));
  }

  criar(request: TarefaRequest): Observable<Tarefa> {
    const novoId = this.tarefasMockDb.length
      ? Math.max(...this.tarefasMockDb.map(tarefa => tarefa.id)) + 1
      : 1;

    const agora = new Date().toISOString();

    const novaTarefa: Tarefa = {
      id: novoId,
      titulo: request.titulo,
      descricao: request.descricao,
      status: request.status,
      dataCriacao: agora,
      dataInicio: request.status === 'Pendente' ? undefined : agora,
      dataConclusao: request.status === 'Concluida' ? agora : undefined
    };

    this.tarefasMockDb = [...this.tarefasMockDb, novaTarefa];
    return of({ ...novaTarefa }).pipe(delay(this.tempoRespostaMs));
  }

  atualizar(id: number, request: TarefaRequest): Observable<Tarefa> {
    const indice = this.tarefasMockDb.findIndex(item => item.id === id);

    if (indice === -1) {
      return throwError(() => new Error(`Tarefa com id ${id} não encontrada.`));
    }

    const tarefaAtual = this.tarefasMockDb[indice];
    const agora = new Date().toISOString();

    const tarefaAtualizada: Tarefa = {
      ...tarefaAtual,
      titulo: request.titulo,
      descricao: request.descricao,
      status: request.status,
      dataInicio: request.status !== 'Pendente' ? tarefaAtual.dataInicio ?? agora : undefined,
      dataConclusao: request.status === 'Concluida' ? tarefaAtual.dataConclusao ?? agora : undefined
    };

    if (request.status !== 'Concluida') {
      tarefaAtualizada.dataConclusao = undefined;
    }

    this.tarefasMockDb[indice] = tarefaAtualizada;
    return of({ ...tarefaAtualizada }).pipe(delay(this.tempoRespostaMs));
  }

  excluir(id: number): Observable<void> {
    const existe = this.tarefasMockDb.some(item => item.id === id);

    if (!existe) {
      return throwError(() => new Error(`Tarefa com id ${id} não encontrada.`));
    }

    this.tarefasMockDb = this.tarefasMockDb.filter(item => item.id !== id);
    return of(void 0).pipe(delay(this.tempoRespostaMs));
  }
}