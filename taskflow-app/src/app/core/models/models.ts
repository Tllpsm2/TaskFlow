export type StatusTarefa = 'Pendente' | 'EmAndamento' | 'Concluida';

export interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    dataCriacao: string;
    dataInicio?: string;
    dataConclusao?: string;
    status: StatusTarefa;
}

export interface TarefaRequest{
    titulo: string;
    descricao: string;
    status: StatusTarefa;
}