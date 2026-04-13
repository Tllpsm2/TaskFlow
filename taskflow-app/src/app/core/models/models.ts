export type StatusTarefa = 'Pendente' | 'EmAndamento' | 'Concluida';

export interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    dataCriacao: Date;
    dataInicio?: Date;
    dataConclusao?: Date;
    status: StatusTarefa;
}

export interface TarefaRequest{
    titulo: string;
    descricao: string;
    status: StatusTarefa;
}