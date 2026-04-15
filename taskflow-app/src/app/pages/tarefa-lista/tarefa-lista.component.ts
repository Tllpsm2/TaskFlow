import { Component, inject, OnInit, signal } from '@angular/core';
import { Tarefa } from '../../core/models/models';
import { TarefaService } from '../../core/tarefa.service';

@Component({
  selector: 'app-tarefa-lista',
  standalone: true,
  imports: [],
  templateUrl: './tarefa-lista.component.html',
  styleUrl: './tarefa-lista.component.css'
})

export class TarefaListaComponent implements OnInit {

  private tarefaService = inject(TarefaService);

  tarefas = signal<Tarefa[]>([]);
  carregando = signal(false);

  ngOnInit() {
    this.carregarTarefas();
  }

  carregarTarefas(){
    this.carregando.set(true);
    this.tarefaService.listar()
      .subscribe({
        next: tarefas => {
          this.tarefas.set(tarefas);
          this.carregando.set(false);
        },
      error: error => {
        console.error('Erro ao carregar tarefas:', error);
        this.carregando.set(false);
      }
    });
  }
}
