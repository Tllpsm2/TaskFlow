# TaskFlow

Projeto-desafio do Bootcamp Protagonize Tech Avanade em parceria com a Impacta.

> [!IMPORTANT]
> Uma versão prévia do projeto está disponível em: https://task-flow-lime-omega.vercel.app/tarefas

Aplicação full stack para gerenciamento de tarefas com Angular 17 no frontend e ASP.NET Core Web API (.NET 8) no backend.

---

## Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Frontend (Angular)](#frontend-angular)
  - [Stack do frontend](#stack-do-frontend)
  - [Modo mock (simulando backend)](#modo-mock-simulando-backend)
  - [Executar frontend](#executar-frontend)
- [Backend (ASP.NET Core)](#backend-aspnet-core)
  - [Stack do backend](#stack-do-backend)
  - [Subir SQL Server no Docker](#subir-sql-server-no-docker)
  - [Configurar connection string (User Secrets)](#configurar-connection-string-user-secrets)
  - [Aplicar migrations](#aplicar-migrations)
  - [Executar backend](#executar-backend)
- [Execução local com API](#execução-local-com-api)
- [Endpoints da API](#endpoints-da-api)
- [Troubleshooting](#troubleshooting)
- [Melhorias Futuras (Roadmap)](#melhorias-futuras-roadmap)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Expansão e Ecossistema](#expansão-e-ecossistema)
- [Notas sobre o uso de IA](#notas-sobre-o-uso-de-ia)

---

## Visão Geral

O TaskFlow organiza o ciclo de tarefas em um fluxo simples:

- Criar tarefas com título, descrição e status.
- Listar tarefas e filtrar por status.
- Editar tarefas existentes.
- Excluir tarefas.
- Atualizar datas automaticamente conforme mudança de status.

> [!NOTE]
> **Inspiração de Interface:** O design visual e a experiência de gestão do quadro de tarefas (*drag and drop*) foram fortemente inspirados na fluidez e organização do plugin [Kanban do Obsidian](https://github.com/obsidian-community/obsidian-kanban).

---

## Pré-requisitos

| Ferramenta | Versão mínima | Link |
|---|---|---|
| .NET SDK | 8.0 | https://dotnet.microsoft.com/download |
| Node.js | 18.x | https://nodejs.org |
| Angular CLI | 17.x | npm install -g @angular/cli |
| Docker Desktop | Qualquer | https://www.docker.com/products/docker-desktop |

---

## Frontend (Angular)

### Stack do frontend

- Angular 17 (Standalone Components)
- Reactive Forms
- HttpClient
- Angular Router

### Modo mock (simulando backend)

O frontend possui um mock completo em memória para desenvolvimento e demonstração.

- Serviço mock: taskflow-app/src/app/core/mock-tarefa.service.service.ts
- Chave de controle: useMockApi
- Produção atual do frontend: useMockApi: true

> [!NOTE]
> Para executar com mock localmente, deixe useMockApi: true em taskflow-app/src/environments/environment.development.ts.

### Executar frontend

```bash
cd taskflow-app
npm install
npm start
```

Aplicação local: http://localhost:4200/tarefas

---

## Backend (ASP.NET Core)

### Stack do backend

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server
- Swagger

### Subir SQL Server no Docker

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenhaAqui@123" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Verifique se o container está ativo:

```bash
docker ps
```

### Configurar connection string (User Secrets)
A aplicação lê a string de conexão de `ConnectionStrings:DefaultConnection`. Para configurá-la localmente com segurança, utilize **User Secrets**.

```bash
cd TaskFlow.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=TaskFlowDb;User Id=sa;Password=SuaSenhaAqui@123;TrustServerCertificate=true"
```

> [!NOTE]
> TrustServerCertificate=true é necessário em ambiente local com SQL Server no Docker.

### Aplicar migrations

```bash
cd TaskFlow.Api
dotnet tool install --global dotnet-ef
dotnet ef migrations add Migration
dotnet ef database update
```

### Executar backend

```bash
cd TaskFlow.Api
dotnet restore
dotnet run
```

Swagger:

- https://localhost:7088/swagger
- http://localhost:5055/swagger

---

## Execução local com API

No arquivo taskflow-app/src/environments/environment.development.ts:

- useMockApi: false
- apiUrl: http://localhost:5055/api/Tarefas

Depois execute:

```bash
cd taskflow-app
npm install
npm start
```

---

## Endpoints da API

Base URL: http://localhost:5055/api/Tarefas

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/Tarefas | Lista tarefas (opcional ?status=) |
| GET | /api/Tarefas/{id} | Busca tarefa por ID |
| POST | /api/Tarefas | Cria uma tarefa |
| PUT | /api/Tarefas/{id} | Atualiza uma tarefa |
| DELETE | /api/Tarefas/{id} | Remove uma tarefa |

Exemplo de payload (POST/PUT):

```json
{
  "titulo": "Finalizar README",
  "descricao": "Documentar setup e execução",
  "status": "EmAndamento"
}
```

---

## Troubleshooting

> [!TIP]
> Se a lista de tarefas não carregar, confirme se o modo correto está ativo (mock ou api) e se a URL da API está acessível.

- Erro de conexão com SQL Server: valide container, senha do usuário sa e connection string.
- Erro de CORS: confirme origem http://localhost:4200 no backend.
- Erro de certificado local: use o endpoint HTTP em desenvolvimento (http://localhost:5055).

---

## Melhorias Futuras (Roadmap)

Embora o projeto atenda a todos os requisitos do desafio, algumas evoluções arquiteturais e de usabilidade estão mapeadas para implementações futuras:

### Frontend
- **Otimização de Estado no Drag and Drop (`onDrop`):** Refatorar a lógica do componente `tarefa-lista` para atualizar o estado das tarefas localmente (atualização otimista) após o drop, evitando recarregamentos completos (*full reloads*) desnecessários e melhorando a fluidez.
- **Aprimoramento de UI/UX nas Ações Destrutivas:** Substituir os alertas nativos do navegador por modais customizados ou *toast notifications* para confirmação de exclusão de tarefas, oferecendo uma experiência mais amigável e segura ao usuário.

### Backend
- **Implementação de Soft Delete:** Substituir a exclusão física (DELETE no banco) por exclusão lógica (adicionando campos como `IsDeleted` ou `DataExclusao`). Isso preserva o histórico de dados e previne perdas acidentais.
- **Tratamento Global de Exceções:** Extrair os blocos de `try-catch` das *Controllers* e implementar um *Global Exception Handler* via Middleware. Isso centraliza o tratamento de erros, padroniza as respostas de falha da API (utilizando o padrão `ProblemDetails`) e deixa os *Controllers* muito mais limpos e focados apenas no roteamento.

### Expansão e Ecossistema
- **Desenvolvimento de Plugin Nativo para o Obsidian:** Evoluir a solução front-end para atuar como um plugin do Obsidian. O objetivo é preencher uma lacuna atual na comunidade, oferecendo um quadro Kanban capaz de persistir, centralizar e sincronizar estados diretamente em uma API externa (cloud), permitindo a integração do fluxo de trabalho com sistemas de terceiros.

---

## Notas sobre o uso de IA

O desafio proposto teve como objetivo avaliar conhecimentos básicos em desenvolvimento full-stack. Os módulos de aprendizado fornecidos, bem como a proposta geral do projeto, propuseram o uso de IA ao longo do ciclo de desenvolvimento como uma ferramenta auxiliar. Diante disso, o presente projeto empregou as seguintes práticas e recursos favorecidos por IA:
- No back-end: identificação das melhores soluções para bugs (serialização de ENUMs e atualização de datas).
- No front-end: padronização de CSS e centralização de estilos compartilhados; aprendizado de práticas modernas do Angular (controle de fluxo, signals, injeção de dependência moderna, Standalone Components e Reactive Forms); orientações para a criação do Mock; e, ajuste nos pacotes.

---

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
