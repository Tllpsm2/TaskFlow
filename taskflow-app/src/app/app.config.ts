import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TarefaService } from './core/tarefa.service';
import { MockTarefaService } from './core/mock-tarefa.service.service';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withFetch()),
    {
      provide: TarefaService,
      useClass: environment.useMockApi ? MockTarefaService : TarefaService
    }
  ]
};