# Sistema de Gestão de Crianças - TODO

## Banco de Dados
- [x] Criar tabela `children` (crianças)
- [x] Criar tabela `medicines` (remédios)
- [x] Criar tabela `incidents` (ocorridos)
- [x] Criar tabela `shifts` (plantões)
- [x] Executar migrações com `pnpm db:push`

## Backend (tRPC Procedures)
- [x] Implementar procedures para CRUD de crianças
- [x] Implementar procedures para CRUD de remédios
- [x] Implementar procedures para CRUD de ocorridos
- [x] Implementar procedures para CRUD de plantões
- [x] Implementar testes vitest para procedures críticos

## Frontend - Autenticação
- [x] Tela de login com OAuth Ong
- [x] Redirecionamento para dashboard após login
- [x] Logout funcional

## Frontend - Layout
- [x] Configurar DashboardLayout com navegação lateral
- [x] Adicionar abas: Crianças, Remédios, Ocorridos, Plantão
- [x] Implementar navegação entre abas

## Frontend - Aba Crianças
- [x] Formulário de cadastro com campos: nome, data de nascimento, responsável, contato, informações médicas, observações
- [x] Listagem de crianças
- [x] Edição de dados de criança
- [x] Exclusão de criança

## Frontend - Aba Remédios
- [x] Formulário de cadastro: nome do remédio, dose, horário, responsável
- [x] Listagem de remédios por criança
- [x] Edição de remédio
- [x] Exclusão de remédio

## Frontend - Aba Ocorridos
- [x] Formulário de registro de ocorrido
- [x] Listagem com destaque visual mostrando nome da criança e descrição
- [x] Edição de ocorrido
- [x] Exclusão de ocorrido

## Frontend - Aba Plantão
- [x] Formulário de passagem de plantão: turno, plantonista, horário início/fim, observações
- [x] Listagem de plantões
- [x] Edição de plantão
- [x] Exclusão de plantão

## Design e Estilo
- [x] Aplicar design elegante e refinado
- [x] Configurar tipografia sofisticada
- [x] Implementar paleta de cores refinada
- [x] Adicionar espaçamento e hierarquia visual
- [x] Garantir responsividade em mobile

## Testes
- [x] Escrever testes vitest para procedures críticos
- [x] Testar fluxos de autenticação
- [x] Testar operações CRUD

## Finalização
- [x] Revisar toda a aplicação
- [x] Salvar checkpoint
- [x] Entregar ao usuário
