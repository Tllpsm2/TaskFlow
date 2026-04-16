import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Tarefa } from '../../core/models/models';
import { TarefaService } from '../../core/tarefa.service';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';


@Component({
  selector: 'app-tarefa-lista',
  standalone: true,
  imports: [RouterLink, DatePipe, LucideAngularModule],
  templateUrl: './tarefa-lista.component.html',
  styleUrl: './tarefa-lista.component.css'
})

export class TarefaListaComponent implements OnInit {

  private tarefaService = inject(TarefaService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(false);
  mensagemErro = signal('');
  
  // símbolos para botões
  readonly pencil = Pencil;
  readonly trash2 = Trash2;

  // IDs para controle de colapsos
  private descricaoExpandida = new Set<number>();

  // divisão por status
  pendentes = computed(() => this.tarefas().filter(t => t.status === 'Pendente'));
  emAndamento = computed(() => this.tarefas().filter(t => t.status === 'EmAndamento'));
  concluidas = computed(() => this.tarefas().filter(t => t.status === 'Concluida'));

  ngOnInit() {
    this.carregarTarefas();
  }

  estaExpandida(id: number): boolean {
    return this.descricaoExpandida.has(id);
  }

  toggleDescricao(id: number) {
    if (this.descricaoExpandida.has(id)) {
      this.descricaoExpandida.delete(id);
    } else {
      this.descricaoExpandida.add(id);
    }
  }

  carregarTarefas() {
    this.carregando.set(true);
    this.mensagemErro.set('');

    this.tarefaService.listar()
      .subscribe({
        next: tarefas => {
          this.tarefas.set(tarefas);
          this.carregando.set(false);
        },
        error: error => {
          console.error('Erro ao carregar tarefas:', error);
          this.mensagemErro.set(`Houve algum erro ao carregar as tarefas. Por favor, tente novamente mais tarde. "${error.message}"`);
          this.carregando.set(false);
        }
      });
  }

  excluirTarefa(tarefa: Tarefa) {
    if (!confirm(`Excluir a tarefa #${tarefa.id} - "${tarefa.titulo}"?`)) {
      return;
    }

    this.tarefaService.excluir(tarefa.id).subscribe({
      next: () => {
        this.tarefas.update(tarefas => tarefas.filter(t => t.id !== tarefa.id));
      },
      error: error => {
        console.error('Erro ao excluir tarefa:', error);
      }
    });
  }
}
