import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Tarefa, TarefaRequest } from './core/models/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  private readonly api = `http://localhost:5055/api/Tarefas`;
  private http = inject(HttpClient);

  listar(status?: string) {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Tarefa[]>(this.api, { params });
  }

  buscarPorId(id: number) {
    return this.http.get<Tarefa>(`${this.api}/${id}`);
  }

  criar(request: TarefaRequest) {
    return this.http.post<Tarefa>(this.api, request);
  }
  
  atualizar(id: number, request: TarefaRequest) {
    return this.http.put<Tarefa>(`${this.api}/${id}`, request);
  }

  excluir(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
