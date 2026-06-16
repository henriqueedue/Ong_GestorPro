# Ong Gestor Pro

Sistema de gestão para Organizações Não Governamentais (ONGs) focado no gerenciamento de crianças e adolescentes em situação de risco.

## 📋 Índice

- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Docker](#docker)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 📖 Descrição

O **Ong Gestor Pro** é um sistema completo para gestão de ONGs, permitindo o gerenciamento de:

- **Cadastro de Crianças/Adolescentes**: Controle completo de dados pessoais e familiares
- **Incidentes**: Registro e acompanhamento de incidentes
- **Medicamentos**: Controle de medicações e doses
- **Turnos**: Gestão de escalas e plantões
- **Autenticação**: Sistema seguro com JWT

---

## 🛠 Tecnologias

### Backend
- **Linguagem**: Go 1.25
- **Framework**: Gin
- **ORM**: GORM
- **Banco de Dados**: MySQL 8.0
- **Autenticação**: JWT

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS 4
- **Estado**: React Query + tRPC
- **UI Components**: Radix UI

---

## 🏗 Arquitetura

```
ong-gestor-pro/
├── docker-compose.yml          # Orquestração de serviços
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo git
├── README.md                   # Documentação principal
│
├── ong-management-backend/     # Backend (Go)
│   ├── cmd/api/               # Ponto de entrada
│   ├── internal/
│   │   ├── controllers/       # Controllers HTTP
│   │   ├── database/         # Conexão e migrations
│   │   ├── middleware/       # Middleware JWT
│   │   ├── models/           # Modelos de dados
│   │   ├── repositories/     # Acesso a dados
│   │   ├── routes/           # Definição de rotas
│   │   └── services/         # Lógica de negócio
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── go.mod
│
└── Ong-managment-front/        # Frontend (React)
    ├── client/                # Código do cliente React
    ├── server/               # Servidor Express/Vite
    ├── shared/               # Tipos compartilhados
    ├── Dockerfile
    ├── package.json
    └── vite.config.ts
```

---

## 📦 Pré-requisitos

- **Docker** >= 20.10
- **Docker Compose** >= 1.29
- **Node.js** >= 22 (para desenvolvimento local)
- **Go** >= 1.25 (para desenvolvimento local)
- **pnpm** >= 10 (para desenvolvimento local)
- **MySQL** >= 8.0 (opcional, se não usar Docker)

---

## 🚀 Instalação

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/ong-gestor-pro.git
cd ong-gestor-pro
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os serviços:
```bash
docker-compose up -d
```

### Desenvolvimento Local

#### Backend

```bash
cd ong-management-backend

# Instale as dependências
go mod download

# Execute o servidor
go run cmd/api/main.go
```

#### Frontend

```bash
cd Ong-managment-front

# Instale as dependências
pnpm install

# Execute em desenvolvimento
pnpm dev
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_USER` | Usuário do banco de dados | root |
| `DB_PASSWORD` | Senha do banco de dados | rootpassword |
| `DB_HOST` | Host do banco de dados | localhost |
| `DB_PORT` | Porta do banco de dados | 3307 |
| `DB_NAME` | Nome do banco de dados | ong_db |
| `JWT_SECRET` | Chave secreta para JWT | (obrigatório alterar) |
| `PORT` | Porta do servidor backend | 8080 |

### Banco de Dados

O sistema utiliza **MySQL 8.0**. Ao iniciar com Docker Compose, o banco de dados será criado automaticamente com o nome especificado em `DB_NAME`.

---

## ▶️ Execução

### Docker Compose (Produção)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status dos serviços
docker-compose ps

# Visualizar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Desenvolvimento

**Backend** (porta 8080):
```bash
cd ong-management-backend
go run cmd/api/main.go
```

**Frontend** (porta 3000):
```bash
cd Ong-managment-front
pnpm dev
```

---

## 🐳 Docker

### Build Manual

```bash
# Backend
cd ong-management-backend
docker build -t ong-gestor-pro-backend .

# Frontend
cd Ong-managment-front
docker build -t ong-gestor-pro-frontend .
```

### Executar sem Docker Compose

```bash
# Banco de dados
docker run -d --name ong-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=ong_db \
  -p 3307:3306 \
  mysql:8.0

# Backend
docker run -d --name ong-backend \
  --link ong-db \
  -p 8080:8080 \
  -e DB_HOST=ong-db \
  ong-gestor-pro-backend

# Frontend
docker run -d --name ong-frontend \
  --link ong-backend \
  -p 3000:3000 \
  ong-gestor-pro-frontend
```

---

## 📂 Estrutura do Projeto

### Backend (Go)

| Diretório | Descrição |
|-----------|-----------|
| `cmd/api/` | Ponto de entrada da aplicação |
| `internal/controllers/` | Handlers HTTP |
| `internal/database/` | Conexão e migrations |
| `internal/middleware/` | Middleware (JWT, CORS, etc.) |
| `internal/models/` | Modelos de dados (GORM) |
| `internal/repositories/` | Padrão Repository |
| `internal/routes/` | Definição de rotas |
| `internal/services/` | Lógica de negócio |

### Frontend (React)

| Diretório | Descrição |
|-----------|-----------|
| `client/src/` | Componentes React |
| `client/src/components/` | Componentes UI |
| `client/src/pages/` | Páginas da aplicação |
| `server/` | Servidor Express + tRPC |
| `shared/` | Tipos TypeScript compartilhados |

---

## 🔗 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login de usuário |
| POST | `/api/auth/register` | Registro de novo usuário |
| GET | `/api/auth/me` | Dados do usuário atual |

### Crianças

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/children` | Listar todas as crianças |
| POST | `/api/children` | Criar novo registro |
| GET | `/api/children/:id` | Obter detalhes |
| PUT | `/api/children/:id` | Atualizar registro |
| DELETE | `/api/children/:id` | Remover registro |

### Incidentes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/incidents` | Listar incidentes |
| POST | `/api/incidents` | Registrar incidente |
| PUT | `/api/incidents/:id` | Atualizar incidente |
| DELETE | `/api/incidents/:id` | Remover incidente |

### Medicamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/medicines` | Listar medicamentos |
| POST | `/api/medicines` | Adicionar medicamento |
| PUT | `/api/medicines/:id` | Atualizar medicamento |
| DELETE | `/api/medicines/:id` | Remover medicamento |

### Turnos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/shifts` | Listar turnos |
| POST | `/api/shifts` | Criar turno |
| PUT | `/api/shifts/:id` | Atualizar turno |
| DELETE | `/api/shifts/:id` | Remover turno |

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Suporte

Para dúvidas e suporte, abra uma issue no repositório GitHub.

---

**Desenvolvido com ❤️ para ONGs e organizações sem fins lucrativos**