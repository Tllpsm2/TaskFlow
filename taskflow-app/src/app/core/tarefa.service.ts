import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StatusTarefa, Tarefa, TarefaRequest } from './models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly api = environment.apiUrl;
  private http = inject(HttpClient);

  listar(status?: StatusTarefa) {
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
