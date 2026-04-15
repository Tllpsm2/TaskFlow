import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tarefas',
        pathMatch: 'full'
    },
    {
        path: 'tarefas',
        loadComponent: () =>
            import('./pages/tarefa-lista/tarefa-lista.component')
                .then(m => m.TarefaListaComponent)
    },
    {
        path: 'tarefas/nova',
        loadComponent: () =>
            import('./pages/tarefa-form/tarefa-form.component')
                .then(m => m.TarefaFormComponent)
    },
    {
        path: 'tarefas/:id/editar',
        loadComponent: () =>
            import('./pages/tarefa-form/tarefa-form.component')
                .then(m => m.TarefaFormComponent)
    }
];
