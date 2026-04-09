# TaskFlow

Projeto-desafio do Bootcamp Protagonize Tech Avanade em parceria com a Impacta.

> Desenvolver uma aplicação web para cadastro e gerenciamento de tarefas utilizando Angular (front-end), ASP.NET Core Web API (back-end) e SQL Server (banco de dados).

---

## Pré-requisitos

| Ferramenta | Versão mínima | Link |
|---|---|---|
| .NET SDK | 8.0 | [dot.net/download](https://dotnet.microsoft.com/download) |
| Node.js | 18.x | [nodejs.org](https://nodejs.org) |
| Angular CLI | Qualquer | `npm install -g @angular/cli` |
| Docker Desktop | Qualquer | [docker.com](https://www.docker.com/products/docker-desktop) |

---

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/TaskFlow.git
cd TaskFlow
```

### 2. Compilar o back-end

```bash
cd TaskFlow.Api
dotnet restore
dotnet build
```

### 3. Docker setup — SQL Server

> O SQL Server é executado em um contêiner Docker. Certifique-se de que o Docker Desktop esteja ativo antes de prosseguir.

#### Windows

No terminal:
```powershell
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenhaAqui@123" `
  -p 1433:1433 --name sqlserver `
  -d mcr.microsoft.com/mssql/server:2022-latest
```

#### macOS

No terminal:
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenhaAqui@123" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

#### Linux

No terminal:
```bash
sudo docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=SuaSenhaAqui@123" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

> **Requisito de senha:** o SQL Server exige mínimo 8 caracteres contendo maiúscula, número e símbolo (ex: `MinhaS3nha@`).

Verifique se o contêiner está ativo:

```bash
docker ps
```

---

### 4. Configurar a string de conexão (User Secrets)

A aplicação lê a string de conexão de `ConnectionStrings:DefaultConnection`. Para configurá-la localmente com segurança, utilize **User Secrets**.

```bash
cd TaskFlow.Api

dotnet user-secrets init

dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Server=localhost,1433;Database=TaskFlowDb;User Id=sa;Password=SuaSenhaAqui@123;TrustServerCertificate=true"
```

> **`TrustServerCertificate=true`** é necessário em ambientes locais com Docker, pois o contêiner usa um certificado auto-assinado.

> O User Secrets é suportado em Windows, macOS e Linux. Os dados ficam armazenados fora do repositório, em um diretório do sistema operacional específico para o seu usuário.

---

### 5. Criar e aplicar a Migration

Cada desenvolvedor deve gerar e aplicar a migration no seu próprio banco:

```bash
# Dentro de TaskFlow.Api/
dotnet tool install --global dotnet-ef  # somente na primeira vez

dotnet ef migrations add CriacaoInicial
dotnet ef database update
```

---

### 6. Executar a API

```bash
dotnet run
```

Acesse a documentação Swagger em: `https://localhost:<porta>/swagger`
