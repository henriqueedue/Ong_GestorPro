# ONG Management Backend

Este é o backend de um sistema de gestão para ONGs, desenvolvido em Go utilizando o framework Gin, MySQL e Docker.

## Tecnologias Utilizadas

- **Linguagem:** Go (Golang)
- **Framework Web:** Gin Gonic
- **ORM:** GORM
- **Banco de Dados:** MySQL 8.0
- **Autenticação:** JWT (JSON Web Tokens)
- **Containerização:** Docker & Docker Compose

## Estrutura do Projeto (MVC)

- `cmd/api/`: Ponto de entrada da aplicação.
- `internal/models/`: Definições das entidades do banco de dados.
- `internal/controllers/`: Lógica de tratamento de requisições HTTP.
- `internal/services/`: Lógica de negócio da aplicação.
- `internal/repositories/`: Camada de acesso ao banco de dados.
- `internal/database/`: Configuração e conexão com o banco de dados.
- `internal/middleware/`: Middlewares (ex: Autenticação).
- `internal/routes/`: Definição das rotas da API.

## Endpoints da API

### Autenticação
- `POST /api/auth/register`: Cadastro de novos usuários.
- `POST /api/auth/login`: Login e obtenção do token JWT.

### Gestão de Crianças (Protegido)
- `GET /api/children/`: Lista todas as crianças.
- `POST /api/children/`: Cadastra uma nova criança.
- `GET /api/children/:id`: Detalhes de uma criança específica.

### Ocorridos (Protegido)
- `GET /api/incidents/`: Lista todos os ocorridos.
- `POST /api/incidents/`: Cadastra um novo ocorrido.

### Remédios (Protegido)
- `GET /api/medicines/`: Lista todos os remédios.
- `POST /api/medicines/`: Cadastra um novo remédio.

### Plantão (Protegido)
- `GET /api/shifts/`: Lista todos os plantões.
- `POST /api/shifts/`: Cadastra um novo plantão.

## Como Executar

1. Certifique-se de ter o Docker e Docker Compose instalados.
2. Clone o repositório.
3. Execute o comando:
   ```bash
   docker-compose up --build
   ```
4. A API estará disponível em `http://localhost:8080`.

## Configuração
As variáveis de ambiente podem ser configuradas no arquivo `.env` (baseado no `.env.example`) ou diretamente no `docker-compose.yml`.
