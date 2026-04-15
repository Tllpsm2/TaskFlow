import { Component, inject, OnInit, signal } from '@angular/core';
import { TarefaService } from '../../core/tarefa.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tarefa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './tarefa-form.component.html',
  styleUrl: './tarefa-form.component.css'
})

export class TarefaFormComponent implements OnInit {

  private tarefaService = inject(TarefaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  tarefaId: any;
  modoEdicao = signal(false);
  salvando = signal(false);

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    descricao: [''],
    status: ['Pendente']
  });

  get tituloCampo() {
    return this.form.get('titulo');
  }

  ngOnInit(){
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.tarefaId = Number(idParam);
      this.modoEdicao.set(true);
      this.carregarTarefa();
    }
  }

  carregarTarefa(){
    if (!this.tarefaId) {
      return;
    }
    
  this.tarefaService.buscarPorId(this.tarefaId)
    .subscribe({
      next: tarefa => {
        this.form.patchValue({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          status: tarefa.status
        });
      },
      error: error => {
        console.error('Erro ao carregar tarefa:', error);
        this.router.navigate(['/tarefas']);
      }
    });
  }

  onSubmit(){
    if(this.form.invalid) {
      return;
    }

    this.salvando.set(true);
    
    const request: any = {
      titulo: this.form.value.titulo,
      descricao: this.form.value.descricao,
      status: this.form.value.status ? this.form.value.status : 'Pendente'
    };

    if (this.modoEdicao()) {
      this.tarefaService.atualizar(this.tarefaId, request).subscribe({
        next: () => {
          this.router.navigate(['/tarefas']);
        },
        error: error => {
          console.error('Erro ao atualizar tarefa:', error);
          this.salvando.set(false);
        }
      });
    } 
    else {
      this.tarefaService.criar(request).subscribe({
        next: () => {
          this.router.navigate(['/tarefas']);
        },
        error: error => {
          console.error('Erro ao criar tarefa:', error);
          this.salvando.set(false);
        }
      });
    }
  }
}