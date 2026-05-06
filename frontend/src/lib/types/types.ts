export type AtividadeFormData = {
  nome: string;
  tipoDeAtividade: string;
  descricao: string;
  dificuldade: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type Atividade = {
  id: number;
  nome: string;
  tipoDeAtividade: string;
  descricao: string;
  dificuldade: string;
  concluida: boolean; 
};