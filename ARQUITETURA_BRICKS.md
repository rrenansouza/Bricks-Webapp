# Documentação Técnica Completa — Projeto Bricks
> Gerada em: agosto de 2026 | Estado do código: análise estática completa
> Destinada a: Tech Lead / Desenvolvedor entrante

---

## 1. Visão Geral do Produto

### Objetivo
O **Bricks** é uma plataforma SaaS de personal training que conecta personal trainers profissionais a seus alunos. O sistema centraliza a gestão do trabalho do personal trainer — cadastro de alunos, criação e atribuição de treinos, agendamento de aulas e controle financeiro — enquanto oferece ao aluno uma experiência de acompanhamento personalizado.

### Público-alvo
- **Personal Trainers** brasileiros (com CREF) que atendem individualmente ou em grupo
- **Alunos** de personal trainers cadastrados na plataforma

### Tipos de Usuário
| Tipo | Descrição |
|---|---|
| `personal` | Profissional de educação física. Cria treinos, gerencia alunos, administra agenda e finanças |
| `student` | Aluno vinculado a um personal. Recebe treinos, agenda aulas, acompanha progresso |

### Problemas que o sistema resolve
1. Comunicação descentralizada entre personal e aluno (WhatsApp, e-mail avulso)
2. Gestão manual de agenda e horários disponíveis
3. Falta de controle sobre treinos atribuídos e execução pelo aluno
4. Dificuldade do aluno em encontrar e contratar personal trainers
5. Ausência de histórico financeiro e de sessões

### Principais módulos existentes
| Módulo | Status |
|---|---|
| Autenticação (JWT) | ✅ Completo |
| Gestão de Alunos | ✅ Completo |
| Criação e Atribuição de Treinos | ✅ Completo |
| Agenda / Agendamentos | ✅ Completo |
| Marketplace de Personals | ✅ Completo |
| Feed Social | ✅ Completo |
| Controle Financeiro | 🟡 Parcial |
| Sistema de Notificações | 🔴 Mock (não funcional) |
| Eventos Esportivos | 🔴 Mock (não funcional) |
| Loja Bricks | 🔴 Mock (não funcional) |
| IA de Treinos | 🔴 Mock (não funcional) |
| Upload de Mídia | 🔴 Não implementado |
| E-mail Transacional | 🔴 Não implementado |

---

## 2. Stack Tecnológica

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.3.1 | Framework de UI |
| TypeScript | 5.6.3 | Tipagem estática |
| Vite | 5.4.20 | Dev server + bundler |
| Wouter | 3.3.5 | Roteamento client-side (alternativa leve ao React Router) |
| TanStack Query (React Query) | 5.60.5 | Cache e fetching de dados do servidor |
| React Hook Form | 7.55.0 | Gerenciamento de formulários |
| Zod | 3.24.2 | Validação de schemas (compartilhado com backend) |
| Tailwind CSS | 3.4.17 | Estilização utility-first |
| Radix UI | vários | Componentes headless acessíveis (base do sistema de design) |
| shadcn/ui | — | Padrão de componente sobre Radix UI (estilo "new-york") |
| Recharts | 2.15.2 | Gráficos e visualizações |
| Framer Motion | 11.13.1 | Animações de UI |
| date-fns | 3.6.0 | Manipulação de datas (locale pt-BR) |
| Lucide React | 0.453.0 | Ícones |

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | 20.x | Runtime |
| Express | 4.21.2 | Framework HTTP |
| TypeScript | 5.6.3 | Tipagem estática |
| tsx | 4.20.5 | Execução de TypeScript sem transpilação prévia |
| jsonwebtoken | 9.0.3 | Criação e verificação de JWT |
| bcryptjs | 3.0.3 | Hash de senhas |

### Banco de Dados
| Tecnologia | Versão | Função |
|---|---|---|
| PostgreSQL | — | Banco de dados relacional principal |
| Drizzle ORM | 0.39.3 | ORM type-safe para queries e schema |
| drizzle-kit | 0.31.4 | CLI de migrações (`db:push`) |
| drizzle-zod | 0.7.0 | Geração automática de schemas Zod a partir do schema Drizzle |
| pg | 8.16.3 | Driver PostgreSQL para Node.js |

### Autenticação
| Tecnologia | Função |
|---|---|
| JWT (jsonwebtoken) | Tokens stateless — emitido no login, validado por middleware |
| bcryptjs | Hashing de senhas com salt automático |
| `SESSION_SECRET` (env var) | Chave de assinatura dos JWTs |

> ⚠️ Passport e express-session estão nas dependências mas **não são utilizados** no código atual. O projeto usa JWT puro.

### Upload de Arquivos
> ⚠️ **Não implementado.** Não há serviço de storage configurado. O feed aceita URLs externas de imagens como workaround.

### Notificações
> ⚠️ **Parcialmente implementado.** Notificações in-app têm tabela no banco e endpoints de leitura funcionais. O envio pelo personal trainer usa `mockServices` (dados em memória, sem persistência).

### Envio de E-mails
> ⚠️ **Não implementado.** Nenhum serviço de e-mail transacional (SendGrid, Resend, etc.) está configurado. A recuperação de senha retorna o token diretamente na API.

### Storage / CDN
> ⚠️ **Não implementado.** Sem S3, Cloudflare R2, Replit Object Storage ou similar.

### Serviços Externos / Integrações Reais
| Serviço | Uso |
|---|---|
| Google Fonts | Inter (fonte principal) + Fira Code (monospace) via CDN |
| WhatsApp | Link direto (`https://wa.me/5511945296363`) no suporte da landing page |

### Ferramentas de Build
| Ferramenta | Função |
|---|---|
| Vite | Build do frontend (output: `dist/public/`) |
| esbuild | Bundle do servidor (output: `dist/index.cjs`) — via `script/build.ts` |
| TypeScript Compiler | Checagem de tipos (`tsc --noEmit`) |

### Deploy
> O projeto está hospedado no **Replit**. O workflow de desenvolvimento roda `npm install && npm run dev`. Não há pipeline de CI/CD configurado além do ambiente Replit.

---

## 3. Estrutura do Projeto

```
bricks/
├── client/                    # Frontend React (Vite)
│   ├── index.html             # Ponto de entrada HTML
│   └── src/
│       ├── main.tsx           # Bootstrap do React + QueryClient + AuthProvider
│       ├── App.tsx            # Definição de todas as rotas (público + protegido)
│       ├── components/
│       │   ├── layout/        # Shell da aplicação (AppLayout, Sidebar, MobileNav)
│       │   ├── dashboard/     # Componentes específicos do dashboard
│       │   │   ├── BarChart.tsx
│       │   │   ├── BirthdayList.tsx
│       │   │   ├── DonutChart.tsx
│       │   │   ├── FinancialSummary.tsx
│       │   │   ├── FirstAccessModal.tsx
│       │   │   ├── MiniCalendar.tsx
│       │   │   ├── NewStudentModal.tsx
│       │   │   ├── StatsCard.tsx
│       │   │   └── WeeklySchedule.tsx
│       │   └── ui/            # Sistema de componentes shadcn/ui (Radix primitives)
│       ├── pages/             # Componentes de página (uma por rota)
│       │   ├── landing.tsx
│       │   ├── auth.tsx              # Login, Register, ForgotPassword, ResetPassword
│       │   ├── dashboard-personal.tsx
│       │   ├── dashboard-student.tsx
│       │   ├── workouts.tsx          # Lista + detalhe + IA + trending
│       │   ├── my-workouts.tsx       # Treinos atribuídos ao aluno
│       │   ├── schedule.tsx          # Agenda completa (1442 linhas)
│       │   ├── students.tsx          # Gestão de alunos pelo personal
│       │   ├── student-detail.tsx    # Perfil público do aluno
│       │   ├── student-self-register.tsx # Auto-cadastro via link de convite
│       │   ├── marketplace.tsx       # Busca e filtro de personals
│       │   ├── personal-detail.tsx   # Perfil público + agendamento pelo marketplace
│       │   ├── feed.tsx              # Feed social
│       │   ├── notifications.tsx     # Central de notificações (1019 linhas — mock)
│       │   ├── profile.tsx           # Edição de perfil próprio
│       │   ├── settings.tsx          # Configurações de conta
│       │   ├── events.tsx            # Eventos esportivos (mock)
│       │   ├── store.tsx             # Loja Bricks (mock)
│       │   └── not-found.tsx         # Página 404
│       ├── hooks/
│       │   └── use-mobile.tsx        # Breakpoint hook (mobile vs desktop)
│       └── lib/
│           ├── auth.tsx              # AuthContext + useAuth hook + funções login/register/logout
│           ├── queryClient.ts        # Configuração do TanStack Query + função apiRequest
│           └── mockServices.ts       # Serviços mock (IA, notificações, eventos, loja, trending)
│
├── server/                    # Backend Express
│   ├── index.ts               # Bootstrap do servidor + middleware de log + listen na porta
│   ├── routes.ts              # TODOS os endpoints da API (~1900 linhas)
│   ├── storage.ts             # Camada de repositório (interface IStorage + implementação Drizzle)
│   ├── db.ts                  # Conexão com PostgreSQL via Drizzle
│   ├── static.ts              # Serve arquivos estáticos em produção
│   ├── vite.ts                # Integração Vite em desenvolvimento (proxy + HMR)
│   └── seed.ts                # Script de seed com 40 personal trainers (8 especialidades)
│
├── shared/                    # Código compartilhado entre frontend e backend
│   └── schema.ts              # Schema Drizzle + Schemas Zod + TypeScript types
│
├── script/
│   └── build.ts               # Script de build combinado (Vite frontend + esbuild backend)
│
├── drizzle.config.ts          # Configuração do drizzle-kit (migrações)
├── vite.config.ts             # Configuração do Vite
├── tailwind.config.ts         # Configuração do Tailwind + tokens de design
├── tsconfig.json              # Configuração TypeScript (paths, target, etc.)
├── components.json            # Configuração shadcn/ui
├── postcss.config.js          # PostCSS (autoprefixer)
├── package.json               # Dependências e scripts npm
└── design_guidelines.md       # Diretrizes de design da marca Bricks
```

---

## 4. Arquitetura Geral

### Padrão Arquitetural
**Monorepo Full-Stack** com separação lógica em três camadas:
- `client/` — SPA React (Single Page Application)
- `server/` — API REST Express
- `shared/` — Contratos de tipos e validação compartilhados

O servidor Express serve tanto a API (`/api/*`) quanto os arquivos estáticos do frontend em produção. Em desenvolvimento, o Vite roda como middleware integrado ao Express.

### Fluxo de Dados

```
[Usuário no Browser]
        ↓ HTTP Request
[Vite Dev Server / Express Static (produção)]
        ↓
[Express — server/index.ts]
        ↓
[Middleware: logging, JSON body parser]
        ↓
[Routes — server/routes.ts]
        ↓
[authMiddleware (valida JWT Bearer token)]
        ↓
[Handler da rota]
        ↓
[storage.ts — IStorage (Drizzle ORM)]
        ↓
[PostgreSQL via pg driver]
```

### Comunicação Frontend ↔ Backend
- O frontend usa `apiRequest()` (em `client/src/lib/queryClient.ts`) para todas as chamadas à API
- `apiRequest(method, url, body)` injeta automaticamente o header `Authorization: Bearer <token>` lido do `localStorage`
- TanStack Query gerencia cache, loading states, refetch automático e invalidação

### Gerenciamento de Estado
| Tipo de Estado | Solução |
|---|---|
| Estado do servidor (dados da API) | TanStack Query (React Query) |
| Estado de autenticação global | React Context API (`AuthContext` em `lib/auth.tsx`) |
| Estado de formulários | React Hook Form + Zod |
| Estado de UI local (modais, tabs) | `useState` local nos componentes |

### Organização de Componentes
- **Páginas** (`pages/`) — componentes de rota, responsáveis por buscar dados e compor UI
- **Componentes de Layout** (`components/layout/`) — shell reutilizável: sidebar + nav mobile + AppLayout
- **Componentes de UI** (`components/ui/`) — primitivos do sistema de design (shadcn/ui sobre Radix)
- **Componentes de Dashboard** (`components/dashboard/`) — widgets específicos do dashboard

### Limitações Arquiteturais
1. **`server/routes.ts` tem ~1900 linhas** — toda a lógica de rota em um único arquivo, sem separação por módulo (ex: `routes/auth.ts`, `routes/workouts.ts`)
2. **`storage.ts` tem ~1089 linhas** — repositório único sem modularização
3. **Sem WebSockets para tempo real** — agenda e notificações requerem refresh manual
4. **Sem camada de serviços** — lógica de negócio misturada diretamente nos handlers de rota
5. **Ausência de testes** — sem testes unitários, de integração ou E2E

---

## 5. Banco de Dados

### Tecnologia
PostgreSQL com Drizzle ORM. Conexão via variável de ambiente `DATABASE_URL`. Schema-first: o arquivo `shared/schema.ts` é a fonte da verdade.

### Tabelas

#### `users` — Autenticação base
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | varchar(36) | PK, default UUID | Identificador único |
| `name` | text | NOT NULL | Nome completo |
| `email` | text | NOT NULL, UNIQUE | E-mail de login |
| `password` | text | NOT NULL | Hash bcrypt |
| `user_type` | enum | NOT NULL | `personal` ou `student` |
| `photo_url` | text | nullable | URL da foto de perfil |
| `must_change_password_on_first_login` | boolean | default false | Flag de primeiro acesso |
| `password_reset_token` | text | nullable | Token de recuperação de senha |
| `password_reset_expiry` | timestamp | nullable | Expiração do token |
| `created_at` | timestamp | NOT NULL, defaultNow | Data de criação |

**Relacionamentos:**
- 1:1 com `personal_profiles` (via `personal_profiles.user_id`)
- 1:1 com `students` (via `students.user_id`)

---

#### `personal_profiles` — Perfil do Personal Trainer
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | varchar(36) | PK, default UUID | — |
| `user_id` | varchar(36) | FK → users.id (cascade delete) | Usuário dono do perfil |
| `bio` | text | nullable | Biografia profissional |
| `specialties` | text[] | nullable | Array de especialidades |
| `city` | text | nullable | Cidade de atuação |
| `neighborhood` | text | nullable | Bairro |
| `cref` | text | nullable | Número de registro CREF |
| `regions` | text[] | nullable | Regiões de atendimento |
| `average_price` | decimal(10,2) | nullable | Preço médio por sessão |
| `average_rating` | decimal(3,2) | default 0 | Média de avaliações |
| `total_ratings` | integer | default 0 | Total de avaliações recebidas |

**Relacionamentos:**
- many:many com `students` (via `students.personal_id`)
- 1:many com `workouts`, `availability_slots`, `appointments`, `student_plans`, `reviews`, `quote_requests`, `personal_gallery`, `personal_services`, `personal_experience`, `personal_events`, `financial_records`

---

#### `students` — Perfil do Aluno
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | varchar(36) | PK, default UUID | — |
| `user_id` | varchar(36) | FK → users.id (cascade delete) | Usuário dono do perfil |
| `personal_id` | varchar(36) | FK → personal_profiles.id (set null) | Personal vinculado (nullable) |
| `goals` | text | nullable | Objetivos do aluno |
| `notes` | text | nullable | Anotações do personal |
| `phone` | text | nullable | Telefone |
| `age` | integer | nullable | Idade |
| `cpf` | text | nullable | CPF (sem validação de dígito) |
| `marital_status` | enum | nullable | Estado civil |
| `gender` | enum | nullable | Gênero |
| `biological_sex` | enum | nullable | Sexo biológico |
| `birth_date` | timestamp | nullable | Data de nascimento |
| `cep` / `street` / `neighborhood` / `city` / `state` / `address_number` / `complement` | text | nullable | Endereço completo |
| `health_insurance` | text | nullable | Plano de saúde |
| `student_status` | enum | default `training` | `training` ou `single_consultation` |
| `referral_source` | enum | nullable | Como conheceu |
| `registration_status` | enum | default `approved` | `pending`, `approved`, `rejected` |
| `registration_token` | text | nullable | Token para auto-cadastro via link |
| `category` | text | nullable | Categoria livre |

**Relacionamentos:**
- many:1 com `personal_profiles`
- 1:many com `student_workouts`, `appointments`, `student_plans`

---

#### `workouts` — Treinos
| Campo | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | varchar(36) | PK | — |
| `name` | text | NOT NULL | Nome do treino |
| `objective` | text | nullable | Objetivo (texto livre — deveria ser enum) |
| `level` | text | nullable | Nível (texto livre — deveria ser enum) |
| `description` | text | nullable | Descrição |
| `frequency` | text | nullable | Frequência semanal |
| `duration` | integer | nullable | Duração em minutos |
| `tags` | text[] | nullable | Tags |
| `is_preset` | boolean | default false | Treino predefinido da plataforma |
| `is_trending` | boolean | default false | Treino em destaque |
| `usage_count` | integer | default 0 | Contador de uso |
| `student_count` | integer | default 0 | Nº de alunos usando |
| `rating` | decimal(3,2) | default 0 | Avaliação média |
| `personal_id` | varchar(36) | FK → personal_profiles.id (cascade) | Personal criador |
| `created_at` | timestamp | NOT NULL | — |

---

#### `workout_exercises` — Exercícios do Treino
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `workout_id` | FK → workouts.id (cascade) | — |
| `exercise_name` | text NOT NULL | Nome do exercício |
| `muscle_group` | text | Grupo muscular |
| `equipment` | text | Equipamento necessário |
| `video_url` | text | Link de vídeo demonstrativo |
| `sets` | integer | Número de séries |
| `reps` | integer | Repetições por série |
| `weight` | decimal(6,2) | Carga em kg |
| `time_in_seconds` | integer | Tempo de execução |
| `rest_time_seconds` | integer | Tempo de descanso |
| `observations` | text | Observações |
| `order_index` | integer default 0 | Ordem na lista |

---

#### `student_workouts` — Atribuição de Treino ao Aluno
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `student_id` | FK → students.id (cascade) | — |
| `workout_id` | FK → workouts.id (cascade) | — |
| `start_date` | timestamp NOT NULL | Início do período |
| `end_date` | timestamp | Fim do período |
| `status` | enum NOT NULL | `active`, `completed`, `paused`, `scheduled` |
| `feedback` | text | Feedback do aluno |
| `completed_at` | timestamp | Data de conclusão |

---

#### `availability_slots` — Horários Disponíveis do Personal
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `start_time` | timestamp NOT NULL | Início do slot |
| `end_time` | timestamp NOT NULL | Fim do slot |
| `is_recurring` | boolean default false | Recorrência (UI presente, lógica ausente) |

---

#### `appointments` — Agendamentos
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `student_id` | FK → students.id (cascade) | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `slot_id` | FK → availability_slots.id (set null) | Slot de origem (opcional) |
| `start_time` | timestamp NOT NULL | — |
| `end_time` | timestamp NOT NULL | — |
| `status` | enum NOT NULL | `pending`, `confirmed`, `cancelled`, `completed` |
| `notes` | text | Observações |
| `location` | text | Local da sessão |
| `travel_time` | integer | Tempo de deslocamento (min) |
| `has_single_payment` | boolean default false | Pagamento avulso |
| `payment_amount` | decimal(10,2) | Valor do pagamento |
| `created_at` | timestamp NOT NULL | — |

---

#### `student_plans` — Planos de Assinatura
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `student_id` | FK → students.id (cascade) | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `plan_type` | enum NOT NULL | `monthly`, `quarterly`, `semiannual`, `annual` |
| `status` | enum NOT NULL | `active`, `inactive`, `expired` |
| `start_date` / `end_date` | timestamp NOT NULL | Período do plano |
| `price` | decimal(10,2) | Valor do plano |

---

#### `reviews` — Avaliações de Personals
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `student_id` | FK → students.id (set null) | Nullable |
| `student_name` | text NOT NULL | Nome denormalizado (redundante com FK) |
| `rating` | integer NOT NULL | Nota (sem constraint de range no DB) |
| `comment` | text | Comentário livre |
| `created_at` | timestamp NOT NULL | — |

---

#### `quote_requests` — Solicitações de Orçamento
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `name` / `email` / `whatsapp` | text NOT NULL | Dados do solicitante |
| `message` | text NOT NULL | Mensagem |
| `contact_preference` | enum NOT NULL | `email`, `whatsapp`, `phone` |
| `status` | enum default `pending` | `pending`, `viewed`, `responded`, `closed` |
| `created_at` | timestamp NOT NULL | — |

---

#### `personal_gallery` — Galeria de Mídia do Personal
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `media_url` | text NOT NULL | URL da mídia |
| `media_type` | text NOT NULL | `image` ou `video` (deveria ser enum) |
| `caption` | text | Legenda |
| `order_index` | integer default 0 | Ordenação |
| `created_at` | timestamp NOT NULL | — |

> ⚠️ Tabela criada no schema mas sem endpoints nem UI de upload.

---

#### `personal_services` — Serviços Oferecidos
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `name` | text NOT NULL | Nome do serviço |
| `description` | text | Descrição |
| `price` | decimal(10,2) | Preço |
| `duration` | text | Duração (texto livre) |

> ⚠️ Sem endpoints nem UI.

---

#### `personal_experience` — Histórico Profissional
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `title` | text NOT NULL | Cargo/título |
| `company` | text | Empresa |
| `description` | text | Descrição |
| `start_year` / `end_year` | integer | Período |
| `is_current` | boolean default false | Emprego atual |

> ⚠️ Sem endpoints nem UI.

---

#### `personal_events` — Eventos Pessoais do Personal (Agenda)
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `name` | text NOT NULL | Nome do evento |
| `start_time` / `end_time` | timestamp NOT NULL | — |
| `color` | text default `#b6ff00` | Cor na agenda |
| `is_recurring` | boolean default false | Recorrência (sem lógica) |
| `location` | text | Local |
| `travel_time` | integer | Deslocamento (min) |
| `notes` | text | Notas |
| `created_at` | timestamp NOT NULL | — |

---

#### `financial_records` — Registros Financeiros
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `personal_id` | FK → personal_profiles.id (cascade) | — |
| `student_id` | FK → students.id (set null) | Aluno relacionado (opcional) |
| `amount` | decimal(10,2) NOT NULL | Valor |
| `type` | text NOT NULL | `income` ou `expense` (texto livre) |
| `category` | text | Categoria |
| `description` | text | Descrição |
| `date` | timestamp NOT NULL | Data do registro |
| `created_at` | timestamp NOT NULL | — |

---

#### `in_app_notifications` — Notificações In-App
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `user_id` | FK → users.id (cascade) | Destinatário |
| `title` | text NOT NULL | Título |
| `body` | text NOT NULL | Corpo da notificação |
| `type` | text NOT NULL | Tipo (texto livre — deveria ser enum) |
| `reference_id` | varchar(36) | ID de referência (ex: appointment_id) |
| `is_read` | boolean NOT NULL default false | Lido |
| `created_at` | timestamp NOT NULL | — |

---

#### `social_posts` — Publicações do Feed
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `user_id` | FK → users.id (cascade) | Autor |
| `content` | text NOT NULL | Texto do post |
| `media_url` | text | URL de mídia |
| `media_type` | enum | `image` ou `video` |
| `post_type` | enum NOT NULL default `general` | `workout_check`, `progress`, `tip`, `achievement`, `general` |
| `likes_count` | integer NOT NULL default 0 | Contagem denormalizada |
| `comments_count` | integer NOT NULL default 0 | Contagem denormalizada |
| `created_at` | timestamp NOT NULL | — |

---

#### `post_likes` — Curtidas
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `post_id` | FK → social_posts.id (cascade) | — |
| `user_id` | FK → users.id (cascade) | Usuário que curtiu |
| `created_at` | timestamp NOT NULL | — |

---

#### `post_comments` — Comentários
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | varchar(36) PK | — |
| `post_id` | FK → social_posts.id (cascade) | — |
| `user_id` | FK → users.id (cascade) | Autor do comentário |
| `content` | text NOT NULL | Texto |
| `created_at` | timestamp NOT NULL | — |

---

### Diagrama de Relacionamentos

```
users (1) ──────────── (1) personal_profiles
  │                           │
  │                    ┌──────┼──────────────────────────────────────┐
  │                    │      │                                      │
  │              (many) │   (many)                                (many)
  │            students  workouts                          availability_slots
  │              │  │      │                                      │
  │         (many)│  │   (many)                                   │
  │    appointments│  │ workout_exercises                          │
  │               │  │                                            │
  │           (many)  └──(many) student_workouts                  │
  │        student_plans                                          │
  │                                                               │
  │                    appointments ──────────────────────────────┘
  │                       (personal_id + student_id)
  │
  │── (1) students ── (many) student_workouts
  │                ── (many) appointments
  │                ── (many) student_plans
  │
  └── (many) social_posts
                │── (many) post_likes
                └── (many) post_comments

personal_profiles ── (many) reviews
                  ── (many) quote_requests
                  ── (many) personal_gallery
                  ── (many) personal_services
                  ── (many) personal_experience
                  ── (many) personal_events
                  ── (many) financial_records

users ── (many) in_app_notifications
```

---

## 6. Modelos de Negócio

### User (Usuário)
Entidade base de autenticação. Todo participante do sistema — personal ou aluno — é um `User`. Contém credenciais de login e o tipo que determina o perfil estendido.

### PersonalProfile (Personal Trainer)
Extensão profissional do User para personals. Armazena informações de vitrine (bio, especialidades, cidade, preço médio, CREF) e estatísticas agregadas (rating, total de avaliações). É o centro de gravidade do sistema — a maioria das outras entidades se relaciona com ela.

### Student (Aluno)
Extensão do User para alunos. Contém dados pessoais completos (endereço, CPF, saúde), objetivos e o vínculo com o personal (`personal_id`). Um aluno só pode ter **um** personal trainer por vez.

### Workout (Treino)
Criado pelo personal, representa um plano de treino reutilizável com metadados (objetivo, nível, frequência) e uma coleção de exercícios. Pode ser atribuído a múltiplos alunos.

### WorkoutExercise (Exercício)
Detalhe granular de um treino: nome, grupo muscular, equipamento, séries/reps/carga, tempo, descanso, vídeo e observações. Ordenado por `order_index`.

### StudentWorkout (Treino do Aluno)
Representa a atribuição de um treino a um aluno específico, com período de vigência e status de execução. É a ponte entre `Workout` e `Student`.

### AvailabilitySlot (Horário Disponível)
Bloco de tempo disponibilizado pelo personal para agendamento. Pode ser referenciado por um `Appointment`.

### Appointment (Agendamento)
Sessão marcada entre personal e aluno. Ciclo de vida: `pending` → `confirmed` → `completed`/`cancelled`. Contém local, deslocamento e opção de pagamento avulso.

### StudentPlan (Plano do Aluno)
Contrato de assinatura recorrente entre personal e aluno. Define tipo de plano (mensal/trimestral/etc.), período e valor. Sem integração com gateway de pagamento atualmente.

### Review (Avaliação)
Avaliação de um personal feita por um aluno. Armazena nota (integer) e comentário livre. Sem validação de que o aluno teve relação real com o personal.

### QuoteRequest (Solicitação de Orçamento)
Formulário de contato enviado por visitante (não precisa ser usuário logado) para um personal específico. Fluxo: visitante → preenche → personal recebe no painel.

### PersonalGallery (Galeria)
Portfólio de fotos/vídeos do personal. Schema criado, sem endpoints nem UI de upload.

### PersonalService (Serviço)
Serviços e preços oferecidos pelo personal. Schema criado, sem endpoints nem UI.

### PersonalExperience (Experiência Profissional)
Histórico profissional do personal. Schema criado, sem endpoints nem UI.

### PersonalEvent (Evento Pessoal da Agenda)
Compromisso pessoal do personal na agenda (ex: reunião, deslocamento, evento pessoal). Distinto dos `Appointments` de alunos.

### FinancialRecord (Registro Financeiro)
Lançamento manual de receita ou despesa. Sem integração com pagamentos reais.

### InAppNotification (Notificação In-App)
Notificação gerada pelo sistema para um usuário. Tabela e endpoints de leitura funcionais; criação automática a partir de eventos do sistema **não implementada**.

### SocialPost (Publicação do Feed)
Post do feed social com tipo categorizado (check-in, progresso, conquista, dica). Contadores de likes e comentários denormalizados para performance.

### PostLike / PostComment (Interações)
Curtidas e comentários associados a posts. Comentários têm dados do autor denormalizados na resposta da API.

---

## 7. Fluxos do Sistema

### Fluxo 1 — Cadastro e Login

**Início:** Visitante acessa `/register` ou `/login`

**Etapas (Registro):**
1. Preenche nome, e-mail, senha e tipo (`personal`/`student`)
2. Frontend valida com `registerSchema` (Zod)
3. POST `/api/auth/register`
4. Backend: verifica e-mail duplicado → hash bcrypt da senha → cria `User` → cria `PersonalProfile` ou `Student` → gera JWT → retorna `{ user, token }`
5. Frontend armazena token em `localStorage` e redireciona para `/dashboard`

**Etapas (Login):**
1. POST `/api/auth/login` com e-mail + senha
2. Backend: busca usuário → compara bcrypt → gera JWT → retorna `{ user, token }`

**Validações:** e-mail único, mínimo 6 chars na senha, tipo obrigatório
**Entidades:** `users`, `personal_profiles` ou `students`

---

### Fluxo 2 — Cadastro de Aluno pelo Personal

**Opção A — Cadastro Manual:**
1. Personal acessa `/students` → clica "Novo Aluno" → preenche formulário completo
2. POST `/api/students/create` com dados pessoais + e-mail
3. Backend: verifica e-mail → cria `User` (senha temporária) → cria `Student` vinculado → retorna dados

**Opção B — Link de Convite:**
1. Personal gera link → POST `/api/students/generate-link` → recebe token único
2. Envia link `/register/student/:token` para o aluno
3. Aluno preenche seus dados na página pública
4. POST `/api/students/self-register/:token` → valida token → cria `User` → vincula ao personal → JWT

**Opção C — Conectar Usuário Existente:**
1. Personal busca por nome/e-mail → GET `/api/users/search?q=`
2. Seleciona aluno → POST `/api/students/connect/:userId`
3. Backend: verifica se já tem `Student` record → cria ou atualiza `personalId`

**Entidades:** `users`, `students`

---

### Fluxo 3 — Criação e Atribuição de Treino

**Início:** Personal acessa `/workouts` → "Novo Treino"

**Etapas:**
1. POST `/api/workouts` com nome, objetivo, descrição
2. Acessa o treino → adiciona exercícios → POST `/api/workouts/:id/exercises`
3. Na tela de alunos → seleciona aluno → "Atribuir Treino" → POST `/api/student-workouts`
4. Aluno vê o treino em `/my-workouts`
5. Aluno marca como concluído → PATCH `/api/student-workouts/:id/complete`

**Entidades:** `workouts`, `workout_exercises`, `student_workouts`

---

### Fluxo 4 — Agendamento de Aula

**Personal cria agendamento:**
1. `/schedule` → "Novo Agendamento" → seleciona aluno, data, hora, local
2. POST `/api/appointments` com `status: "pending"`
3. Personal confirma → PATCH `/api/appointments/:id/status` `{ status: "confirmed" }`

**Aluno solicita via Marketplace:**
1. Aluno acessa `/personals/:id` → vê slots disponíveis (GET `/api/personals/:id/slots`)
2. Seleciona horário → cria appointment com `status: "pending"`
3. Personal vê na agenda → aprova (`confirmed`) ou recusa (`cancelled`)

> ⚠️ Não há notificação automática em nenhuma etapa deste fluxo.

**Entidades:** `availability_slots`, `appointments`

---

### Fluxo 5 — Feed Social

1. Usuário logado acessa `/feed`
2. GET `/api/feed` → lista posts com flag `userLiked`
3. Criar post → POST `/api/feed` com `content`, `postType`, `mediaUrl` opcional
4. Curtir → POST/DELETE `/api/feed/:id/like` → atualiza `likes_count` no post
5. Comentar → POST `/api/feed/:id/comments` → atualiza `comments_count`
6. Deletar próprio post → DELETE `/api/feed/:id` (verifica `userId === post.userId`)

**Entidades:** `social_posts`, `post_likes`, `post_comments`

---

### Fluxo 6 — Avaliação de Personal (Marketplace)

1. Visitante ou aluno logado acessa `/personals/:id`
2. GET `/api/personals/:id/reviews` → exibe avaliações existentes
3. Aluno logado preenche nota e comentário → POST `/api/personals/:id/reviews`
4. Backend: verifica se é aluno → busca dados do aluno → cria `Review`
5. ⚠️ Não há verificação se o aluno já foi atendido pelo personal

**Entidades:** `reviews`, `personal_profiles` (average_rating atualizado manualmente ou via query)

---

## 8. APIs

> Base URL: `/api` | Autenticação: `Authorization: Bearer <jwt_token>`
> `[auth]` = requer token | `[personal]` = requer userType=personal | `[student]` = requer userType=student | `[public]` = sem autenticação

### Autenticação
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| POST | `/api/auth/register` | public | `{ name, email, password, userType }` | `{ user, token }` |
| POST | `/api/auth/login` | public | `{ email, password }` | `{ user, token }` |
| GET | `/api/auth/me` | [auth] | — | `{ user, profile }` |
| POST | `/api/auth/change-password` | [auth] | `{ newPassword }` | `{ message }` |
| POST | `/api/auth/forgot-password` | public | `{ email }` | `{ resetToken }` ⚠️ token exposto |
| POST | `/api/auth/reset-password` | public | `{ token, newPassword }` | `{ message }` |

### Personal Trainers
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/personals` | public | `?specialty=&city=&search=` | `PersonalWithUser[]` |
| GET | `/api/personals/:id` | public | — | `PersonalWithUser` |
| PATCH | `/api/personals/me` | [personal] | `{ bio, specialties, city, neighborhood, averagePrice }` | `PersonalProfile` |
| GET | `/api/personals/stats` | [personal] | — | stats ⚠️ inacessível (bug de rota) |
| GET | `/api/personals/:id/slots` | public | `?available=true` | `AvailabilitySlot[]` |
| GET | `/api/personals/:id/reviews` | public | — | `Review[]` |
| POST | `/api/personals/:id/reviews` | [student] | `{ rating, comment }` | `Review` |
| GET | `/api/personals/:id/details` | public | — | `PersonalWithDetails` |

### Alunos
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/students` | [personal] | — | `StudentWithUser[]` |
| PATCH | `/api/students/me` | [student] | `{ goals, notes }` | `Student` |
| GET | `/api/students/stats` | [student] | — | stats do aluno |
| POST | `/api/students/create` | [personal] | formulário completo de aluno | `{ user, student }` |
| POST | `/api/students/generate-link` | [personal] | — | `{ token, registrationUrl }` |
| POST | `/api/students/self-register/:token` | public | dados do aluno | `{ user, token }` |
| GET | `/api/students/validate-token/:token` | public | — | `{ personal }` |
| PATCH | `/api/students/:id/approve` | [personal] | — | `Student` |
| PATCH | `/api/students/:id/reject` | [personal] | — | `Student` |
| DELETE | `/api/students/:id` | [personal] | — | 204 |
| GET | `/api/users/:userId/student-profile` | [auth] | — | `{ user, student }` |
| POST | `/api/students/connect/:userId` | [personal] | — | `Student` |
| GET | `/api/users/search` | [auth] | `?q=` | `User[]` |
| PATCH | `/api/users/me` | [auth] | campos do usuário | `User` |

### Treinos
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/workouts` | [personal] | — | `WorkoutWithExercises[]` |
| POST | `/api/workouts` | [personal] | `{ name, objective, description, level, ... }` | `Workout` |
| GET | `/api/workouts/:id` | [auth] | — | `WorkoutWithExercises` |
| DELETE | `/api/workouts/:id` | [personal] | — | 204 |
| POST | `/api/workouts/:id/exercises` | [personal] | campos do exercício | `WorkoutExercise` |
| DELETE | `/api/workouts/:id/exercises/:exerciseId` | [personal] | — | 204 |
| GET | `/api/student-workouts` | [student] | — | `StudentWorkoutWithDetails[]` |
| GET | `/api/student-workouts/:id` | [auth] | — | `StudentWorkoutWithDetails` |
| POST | `/api/student-workouts` | [personal] | `{ studentId, workoutId, startDate }` | `StudentWorkout` |
| PATCH | `/api/student-workouts/:id/complete` | [student] | — | `StudentWorkout` |

### Agenda
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/availability-slots` | [personal] | — | `AvailabilitySlot[]` |
| POST | `/api/availability-slots` | [personal] | `{ startTime, endTime, isRecurring }` | `AvailabilitySlot` |
| DELETE | `/api/availability-slots/:id` | [personal] | — | 204 |
| GET | `/api/appointments` | [auth] | — | `AppointmentWithDetails[]` |
| POST | `/api/appointments` | [auth] | `{ studentId, startTime, endTime, location, notes, status }` | `Appointment` |
| PATCH | `/api/appointments/:id/status` | [auth] | `{ status }` | `Appointment` |
| GET | `/api/appointments/upcoming` | [personal] | — | `AppointmentWithDetails[]` |
| GET | `/api/appointments/my` | [student] | — | `AppointmentWithDetails[]` |
| GET | `/api/personal-events` | [personal] | `?startDate=&endDate=` | `PersonalEvent[]` |
| POST | `/api/personal-events` | [personal] | `{ name, startTime, endTime, color, location, travelTime, notes }` | `PersonalEvent` |
| PATCH | `/api/personal-events/:id` | [personal] | campos do evento | `PersonalEvent` |
| DELETE | `/api/personal-events/:id` | [personal] | — | 204 |

### Feed Social
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/feed` | [auth] | `?limit=&offset=` | `SocialPostWithUser[]` |
| POST | `/api/feed` | [auth] | `{ content, postType, mediaUrl, mediaType }` | `SocialPostWithUser` |
| DELETE | `/api/feed/:id` | [auth] | — | 204 (owner only) |
| POST | `/api/feed/:id/like` | [auth] | — | 200 |
| DELETE | `/api/feed/:id/like` | [auth] | — | 200 |
| GET | `/api/feed/:id/comments` | [auth] | — | `PostComment[]` |
| POST | `/api/feed/:id/comments` | [auth] | `{ content }` | `PostComment` |

### Notificações
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/notifications/inbox` | [auth] | — | `InAppNotification[]` |
| PATCH | `/api/notifications/inbox/:id/read` | [auth] | — | `InAppNotification` ⚠️ sem verificação de dono |
| PATCH | `/api/notifications/inbox/read-all` | [auth] | — | 200 |

### Financeiro
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/financial` | [personal] | `?type=&startDate=&endDate=` | `FinancialRecord[]` |
| GET | `/api/financial/summary` | [personal] | — | `{ totalIncome, totalExpense, balance }` |
| POST | `/api/financial` | [personal] | `{ amount, type, category, description, date, studentId }` | `FinancialRecord` |
| PATCH | `/api/financial/:id` | [personal] | campos | `FinancialRecord` ⚠️ sem verificação de dono |
| DELETE | `/api/financial/:id` | [personal] | — | 204 ⚠️ sem verificação de dono |

### Dashboard e Orçamentos
| Método | Rota | Auth | Parâmetros | Resposta |
|---|---|---|---|---|
| GET | `/api/dashboard/stats` | [personal] | — | `{ studentCount, workoutCount, appointmentCount, revenue }` |
| POST | `/api/quotes` | public | `{ personalId, name, email, whatsapp, message, contactPreference }` | `QuoteRequest` |
| GET | `/api/quotes` | [personal] | — | `QuoteRequest[]` |

### Endpoints NÃO implementados (esperados pelo frontend)
| Rota | Motivo da ausência |
|---|---|
| GET `/api/trending-workouts` | Módulo mock — sem backend real |
| GET `/api/events` | Módulo mock — sem backend real |
| GET `/api/products` | Módulo mock — sem backend real |
| DELETE `/api/users/me` | Deletar conta não implementado |
| PATCH `/api/workouts/:id` | Edição de treino não implementada |

---

## 9. Componentes

### Layout
| Componente | Responsabilidade | Usado em |
|---|---|---|
| `AppLayout` | Shell da aplicação: sidebar (desktop) + nav mobile + header | Todas as páginas autenticadas |
| `Sidebar` | Navegação lateral fixa no desktop com links para todas as seções | AppLayout |
| `MobileNav` | Barra de navegação inferior no mobile | AppLayout |

### Dashboard
| Componente | Responsabilidade | Usado em |
|---|---|---|
| `StatsCard` | Card de métrica com ícone, valor e variação | Dashboard personal + student |
| `BarChart` | Gráfico de barras (Recharts) | Dashboard |
| `DonutChart` | Gráfico de donut (Recharts) | Dashboard |
| `FinancialSummary` | Resumo receitas/despesas | Dashboard personal |
| `MiniCalendar` | Calendário compacto | Dashboard |
| `WeeklySchedule` | Grade semanal de appointments | Dashboard |
| `BirthdayList` | Lista de aniversários de alunos | Dashboard |
| `FirstAccessModal` | Modal de boas-vindas no primeiro login | Dashboard |
| `NewStudentModal` | Modal de criação rápida de aluno | Dashboard |

### UI (Sistema de Design — shadcn/ui)
Todos os componentes em `client/src/components/ui/` são wrappers sobre primitivos Radix UI seguindo o padrão shadcn/ui:

`Accordion`, `AlertDialog`, `Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Calendar`, `Card`, `Carousel`, `Chart`, `Checkbox`, `Collapsible`, `Command`, `ContextMenu`, `Dialog`, `Drawer`, `DropdownMenu`, `Form`, `HoverCard`, `Input`, `InputOTP`, `Label`, `Menubar`, `NavigationMenu`, `Pagination`, `Popover`, `Progress`, `RadioGroup`, `ResizablePanels`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Skeleton`, `Slider`, `Switch`, `Table`, `Tabs`, `Textarea`, `Toast`, `Toaster`, `Toggle`, `ToggleGroup`, `Tooltip`

---

## 10. Páginas

| Página | Rota | Tipo | Objetivo | Integrações |
|---|---|---|---|---|
| Landing | `/` | Pública | Marketing, conversão, suporte | WhatsApp |
| Login | `/login` | Pública | Autenticação | `/api/auth/login` |
| Register | `/register` | Pública | Cadastro | `/api/auth/register` |
| ForgotPassword | `/forgot-password` | Pública | Iniciar recuperação de senha | `/api/auth/forgot-password` |
| ResetPassword | `/reset-password` | Pública | Redefinir senha | `/api/auth/reset-password` |
| Dashboard (Personal) | `/dashboard` | Protegida | Visão geral: stats, agenda, alunos | `/api/dashboard/stats`, `/api/appointments`, `/api/students` |
| Dashboard (Aluno) | `/dashboard` | Protegida | Visão geral: treinos, agendamentos | `/api/students/stats`, `/api/student-workouts`, `/api/appointments` |
| Workouts | `/workouts` | Protegida (personal) | Criar/ver treinos, IA (mock), trending (mock) | `/api/workouts` |
| WorkoutDetail | `/workouts/:id` | Protegida (personal) | Detalhar e gerenciar exercícios | `/api/workouts/:id` |
| MyWorkouts | `/my-workouts` | Protegida (student) | Treinos atribuídos | `/api/student-workouts` |
| MyWorkoutDetail | `/my-workouts/:id` | Protegida (student) | Detalhes e conclusão | `/api/student-workouts/:id` |
| Schedule | `/schedule` | Protegida | Agenda semanal/diária | `/api/appointments`, `/api/availability-slots`, `/api/personal-events` |
| Students | `/students` | Protegida (personal) | Gestão de alunos | `/api/students`, `/api/users/search` |
| StudentDetail | `/students/profile/:userId` | Protegida | Perfil do aluno | `/api/users/:userId/student-profile` |
| StudentSelfRegister | `/register/student/:token` | Pública | Auto-cadastro via link | `/api/students/validate-token/:token`, `/api/students/self-register/:token` |
| Marketplace | `/personals` | Pública | Busca de personal trainers | `/api/personals` |
| PersonalDetail | `/personals/:id` | Pública | Perfil, avaliações, agendamento | `/api/personals/:id`, `/api/personals/:id/reviews`, `/api/personals/:id/slots` |
| Feed | `/feed` | Protegida | Feed social | `/api/feed`, `/api/feed/:id/comments` |
| Notifications | `/notifications` | Protegida (personal) | Central de notificações | Mock (não funcional) |
| Profile | `/profile` | Protegida | Edição de perfil | `/api/personals/me` ou `/api/students/me` |
| Settings | `/settings` | Protegida | Senha, logout, conta | `/api/auth/change-password` |
| Events | `/events` | Protegida | Eventos esportivos | Mock (não funcional) |
| Store | `/store` | Protegida | Loja Bricks | Mock (não funcional) |

---

## 11. Autenticação

### Mecanismo
**JWT Stateless** — sem sessão no servidor. O token é armazenado no `localStorage` do browser.

### Login
1. POST `/api/auth/login` → bcrypt.compare → JWT assinado com `SESSION_SECRET` → retorna `{ user, token }`
2. Frontend armazena `token` e `user` em `localStorage`
3. `AuthContext` carrega estado inicial do `localStorage`

### Logout
`logout()` no `AuthContext`: limpa `localStorage` → redireciona para `/`

### Recuperação de Senha
> ⚠️ **Fluxo com falha de segurança crítica**
1. POST `/api/auth/forgot-password` → gera token UUID → salva em `users.password_reset_token` + expiração → **retorna token direto na resposta**
2. POST `/api/auth/reset-password` → valida token + expiração → hash nova senha → limpa token

### Autorização
Toda requisição autenticada deve conter `Authorization: Bearer <token>`.

**`authMiddleware`** (`server/routes.ts` linha 32):
- Extrai token do header
- Verifica assinatura e expiração com `jwt.verify(token, SESSION_SECRET || "insecure-secret")`
- Injeta `req.userId` e `req.userType` nos handlers

**`optionalAuthMiddleware`** (linha 55): igual mas não rejeita se token ausente (usado no marketplace público)

### Perfis e Permissões
| Recurso | Personal | Aluno | Visitante |
|---|---|---|---|
| Dashboard próprio | ✅ | ✅ | ❌ |
| Criar treinos | ✅ | ❌ | ❌ |
| Ver alunos próprios | ✅ | ❌ | ❌ |
| Ver próprios treinos atribuídos | ❌ | ✅ | ❌ |
| Criar agendamentos | ✅ | 🟡 (via marketplace) | ❌ |
| Ver marketplace de personals | ✅ | ✅ | ✅ |
| Enviar orçamento | ✅ | ✅ | ✅ |
| Feed social | ✅ | ✅ | ❌ |
| Controle financeiro | ✅ | ❌ | ❌ |

### Sessões
Sem sessão server-side. JWT tem validade implícita (não está explicitamente configurada no `jwt.sign` — usa o padrão do jsonwebtoken, sem expiração definida).

> ⚠️ Tokens não têm campo `expiresIn` configurado — tecnicamente são válidos indefinidamente enquanto a `SESSION_SECRET` não mudar.

---

## 12. Integrações

| Integração | Status | Detalhes |
|---|---|---|
| **PostgreSQL** | ✅ Ativa | Via `DATABASE_URL`. Driver `pg`, ORM Drizzle |
| **WhatsApp** | 🟡 Parcial | Link direto (`wa.me`) no suporte da landing. Sem API oficial (WhatsApp Business API) |
| **Google Fonts** | ✅ Ativa | Inter + Fira Code via CDN |
| **E-mail** | ❌ Não implementado | Necessário para recuperação de senha |
| **Storage de arquivos** | ❌ Não implementado | Sem S3/R2/similar |
| **Gateway de pagamento** | ❌ Não implementado | Stripe/PagSeguro não integrados |
| **Push Notifications** | ❌ Não implementado | Sem FCM/Web Push |
| **Google Calendar** | ❌ Não implementado | — |
| **OAuth** | ❌ Não implementado | Passport instalado mas não usado |

---

## 13. Serviços

### Serviços Reais

#### `server/storage.ts` — `DatabaseStorage`
Implementa a interface `IStorage`. É a única camada de acesso ao banco. Contém todos os métodos de CRUD organizados por entidade. Usado exclusivamente pelos handlers em `server/routes.ts`.

**Dependências:** Drizzle ORM, PostgreSQL, todas as tabelas do schema

#### `client/src/lib/auth.tsx` — `AuthContext` / `useAuth`
Context React que gerencia o estado de autenticação global. Expõe `user`, `token`, `login()`, `register()`, `logout()`, `refreshUser()`.

**Dependências:** React Context, `localStorage`, `/api/auth/*`

#### `client/src/lib/queryClient.ts` — `apiRequest` / `queryClient`
Função utilitária que centraliza todas as chamadas HTTP do frontend: injeta o JWT, trata erros globais (401 → redirect), configura o TanStack QueryClient.

**Dependências:** TanStack Query, `localStorage` (token)

### Serviços Mock (Não Funcionais em Produção)

#### `client/src/lib/mockServices.ts`
Contém serviços que simulam backends inexistentes:

| Serviço | Dados | Usado em |
|---|---|---|
| `aiWorkoutService` | 1 sugestão hardcoded em memória | `workouts.tsx` (aba IA) |
| `trendingWorkoutsService` | Array de treinos mock | `workouts.tsx` (aba Trending) |
| `notificationService` | Array em memória (reset ao recarregar) | `notifications.tsx` |
| `eventsService` | 6 eventos hardcoded | `events.tsx` |
| `productsService` | ~8 produtos hardcoded | `store.tsx` |

> ⚠️ Todos esses serviços devem ser substituídos por chamadas reais à API antes do lançamento.

---

## 14. Regras de Negócio

### Usuários e Perfis
- Um e-mail só pode estar associado a uma conta (`UNIQUE` constraint)
- O tipo de usuário (`personal`/`student`) é definido no cadastro e não pode ser alterado pela UI
- Ao criar conta como personal, um `PersonalProfile` é criado automaticamente
- Ao criar conta como student, um `Student` é criado automaticamente

### Vínculo Personal ↔ Aluno
- Um aluno pode ter **no máximo um** personal trainer vinculado (`students.personal_id`)
- O vínculo pode ser criado por três caminhos: cadastro manual, link de convite, ou conexão de usuário existente
- O personal pode aprovar, rejeitar ou remover alunos
- Ao conectar um usuário já existente que já tinha outro personal, o vínculo é simplesmente sobrescrito (sem confirmação)

### Treinos
- Apenas personals podem criar treinos
- Treinos pertencem ao personal criador (`workouts.personal_id`)
- Qualquer treino pode ser atribuído a qualquer aluno do personal
- Aluno só pode marcar treino como concluído, não editar conteúdo
- Objetivo e nível são campos de texto livre (deveriam ser enums)

### Agendamentos
- Status evolui: `pending` → `confirmed` → `completed` ou `cancelled`
- Qualquer usuário autenticado pode criar agendamento via POST `/api/appointments`
- Não há validação de conflito de horários no backend
- Não há notificação automática ao alterar status

### Avaliações
- Qualquer aluno logado pode avaliar qualquer personal (sem verificação de relação)
- A `average_rating` em `personal_profiles` não é atualizada automaticamente (deve ser recalculada)

### Feed Social
- Qualquer usuário logado pode publicar e interagir
- Apenas o autor pode deletar seu próprio post (verificação no handler)
- Likes são únicos por usuário (sem constraint UNIQUE no banco — controlado apenas pela lógica do handler via upsert/delete)

### Notificações
- Leitura de notificações: qualquer usuário autenticado pode marcar qualquer notificação como lida (bug de autorização)
- Criação automática de notificações: **não implementada**

### Acesso Financeiro
- Apenas personals acessam registros financeiros
- CRUD de registros não verifica se pertencem ao personal logado (bug de autorização)

---

## 15. Configurações

### Variáveis de Ambiente
| Variável | Obrigatoriedade | Função |
|---|---|---|
| `DATABASE_URL` | **Obrigatória** | Connection string PostgreSQL. O servidor falha ao iniciar se ausente |
| `SESSION_SECRET` | **Obrigatória em produção** | Chave de assinatura JWT. Tem fallback inseguro `"insecure-secret"` |
| `PORT` | Opcional (default: 5000) | Porta do servidor Express |
| `NODE_ENV` | Opcional (default: `development`) | Controla se Vite roda como middleware ou se os arquivos estáticos são servidos |

### Configurações Globais do Frontend

**TanStack Query** (`queryClient.ts`):
- `staleTime: Infinity` por padrão — dados não refetched automaticamente
- Função de fetch padrão usa a URL como query key e faz GET com JWT

**Vite Aliases:**
- `@` → `client/src/`
- `@shared` → `shared/`
- `@assets` → `attached_assets/`

**Tailwind — Tokens de Design (`tailwind.config.ts` + CSS variables):**
- Background principal: `#002c2b` (petrol green profundo)
- Accent/Primary: `#b6ff00` (neon green)
- Foreground/Texto: `#f7f7f7` (ice white)
- Fonte: Inter (Google Fonts) + Fira Code (monospace)

### Middlewares do Express
1. **JSON body parser** com captura de `rawBody` (server/index.ts)
2. **URL encoded parser**
3. **Logger de requisições API** (loga método, path, status, tempo e corpo JSON — ⚠️ inclui dados sensíveis)
4. **authMiddleware** e **optionalAuthMiddleware** (server/routes.ts)
5. **Error handler global** (server/index.ts) — responde JSON e relança a exceção

### Providers e Contextos (Frontend)
```
main.tsx
└── QueryClientProvider (TanStack Query)
    └── AuthProvider (AuthContext)
        └── App (Wouter Router)
            └── Routes...
```

---

## 16. Segurança

### Autenticação
- JWT assinado com HS256 e `SESSION_SECRET`
- ⚠️ Fallback para `"insecure-secret"` se a variável não estiver definida
- ⚠️ Tokens sem `expiresIn` — válidos indefinidamente

### Autorização
- Rotas protegidas exigem Bearer token válido
- `req.userId` / `req.userType` injetados pelo middleware
- ⚠️ Vários endpoints não verificam se o recurso pertence ao usuário logado (financial, events, notifications)

### Proteção de Rotas
- Frontend: `ProtectedRoute` em `App.tsx` redireciona para `/login` se não autenticado
- Backend: `authMiddleware` rejeita com 401 se token ausente/inválido

### Criptografia de Senhas
- bcryptjs com salt automático (padrão: 10 rounds)
- Nunca a senha em texto plano é armazenada ou retornada

### Proteção de Uploads
- ⚠️ **Não há upload real** — sem necessidade de validação de tipo MIME ou tamanho por ora

### Validações
- Backend: validação manual com `if (!field)` na maioria dos handlers
- Frontend + Backend compartilham schemas Zod (`shared/schema.ts`)
- ⚠️ CPF sem validação de dígito verificador
- ⚠️ URL de vídeo aceita qualquer string
- ⚠️ Rating sem constraint de range no banco (aceita valores fora de 1-5)

### Exposição de Dados
- ⚠️ CPF é retornado em `/api/users/:userId/student-profile` (apenas redacted parcialmente)
- ⚠️ Corpo completo de respostas da API é logado no console (incluindo tokens e dados pessoais)

### Reset de Senha
- ⚠️ Token retornado diretamente na resposta da API (falha crítica)

---

## 17. Estado Atual do Projeto

### Módulos Completos
- ✅ Sistema de autenticação (registro, login, logout, troca de senha)
- ✅ Cadastro e gestão de alunos (manual, link de convite, conexão)
- ✅ Criação e atribuição de treinos
- ✅ Agenda semanal/diária (appointments + eventos pessoais + slots)
- ✅ Marketplace de personals (busca, filtros, perfil público, orçamento)
- ✅ Feed social (posts, likes, comentários)
- ✅ Notificações in-app (leitura do inbox)

### Módulos Parcialmente Implementados
- 🟡 Perfil do personal (bio/especialidades editáveis; galeria, serviços e experiências no banco mas sem endpoints)
- 🟡 Controle financeiro (CRUD funcional; sem integração com pagamentos reais e sem verificação de ownership)
- 🟡 Sistema de notificações in-app (inbox funcional; criação automática e envio pelo personal não implementados)
- 🟡 Recuperação de senha (fluxo técnico existe; sem serviço de e-mail)
- 🟡 Feed com mídia (posts funcionam; upload de arquivo não implementado)

### Módulos Iniciados (Estrutura presente, sem backend real)
- 🔵 Notificações avançadas (envio pelo personal — UI elaborada, 100% mock)
- 🔵 IA de treinos (formulário completo, mock sem LLM real)
- 🔵 Treinos em alta (UI com filtros, mock)

### Módulos Não Iniciados
- ⚪ Loja Bricks (UI estática com mock; sem backend, carrinho ou pagamento)
- ⚪ Eventos esportivos (UI estática com mock; sem backend ou inscrição)
- ⚪ Upload de arquivos (storage, endpoint de upload)
- ⚪ E-mail transacional
- ⚪ Notificações push
- ⚪ Edição de treino existente
- ⚪ Galeria/serviços/experiências do personal (tabelas criadas, sem CRUD)
- ⚪ Exclusão de conta com deleção real de dados
- ⚪ Google Calendar ou qualquer sincronização de agenda

---

## 18. Dependências Técnicas

```
Autenticação
  └── é pré-requisito de tudo que está protegido

Agenda / Agendamentos
  ├── depende de: Autenticação, Vínculo Personal↔Aluno
  └── notificação de eventos dependeria de: Sistema de Notificações (não implementado)

Gestão de Treinos
  └── depende de: Autenticação, Aluno cadastrado (para atribuição)

Feed Social
  └── depende de: Autenticação
  └── upload de mídia dependeria de: Serviço de Storage (não implementado)

Sistema de Notificações (envio)
  ├── depende de: Autenticação
  ├── depende de: Vínculo Personal↔Aluno (para saber destinatários)
  └── canais externos dependem de: E-mail / WhatsApp API / FCM (não implementados)

Recuperação de Senha
  └── depende de: Serviço de E-mail (não implementado)

Upload de Foto / Galeria / Feed com Mídia
  └── depende de: Serviço de Storage (S3, R2, etc. — não implementado)

Loja / Eventos
  └── depende de: Backend real + Gateway de Pagamento (não implementados)

IA de Treinos
  └── depende de: Integração com LLM (OpenAI ou similar — não implementado)
```

---

## 19. Dívida Técnica Conhecida

| # | Item | Localização | Impacto |
|---|---|---|---|
| 1 | Token de reset de senha exposto na API | `server/routes.ts` linhas 244–271 | Crítico — falha de segurança |
| 2 | JWT sem expiração configurada | `server/routes.ts` (jwt.sign) | Alto — tokens eternos |
| 3 | Fallback inseguro `"insecure-secret"` para SESSION_SECRET | `server/routes.ts` linha 35 | Crítico em produção |
| 4 | Bug de rota: `/api/personals/stats` inacessível | `server/routes.ts` (ordem de registro) | Alto — endpoint não funciona |
| 5 | `server/routes.ts` com ~1900 linhas (monolítico) | `server/routes.ts` | Médio — manutenibilidade |
| 6 | `server/storage.ts` com ~1089 linhas (monolítico) | `server/storage.ts` | Médio — manutenibilidade |
| 7 | Sem verificação de ownership em CRUD sensível | routes: financial, events, notifications | Médio — segurança |
| 8 | Log de respostas completas (PII) | `server/index.ts` linhas 36-60 | Médio — LGPD |
| 9 | Middleware de erro relança exceção após resposta | `server/index.ts` linhas 65-71 | Médio — estabilidade |
| 10 | Treino: `objective` e `level` como texto livre | `shared/schema.ts` + `workouts` table | Baixo — consistência de dados |
| 11 | CPF sem validação de dígito verificador | `createStudentFormSchema` | Baixo — qualidade de dados |
| 12 | `birthDate` como string no Zod, timestamp no banco | `createStudentFormSchema` | Médio — bug de runtime |
| 13 | Avaliações sem verificação de relação personal-aluno | `server/routes.ts` reviews POST | Médio — dados fraudulentos |
| 14 | Sem testes (unitários, integração, E2E) | Projeto inteiro | Alto — risco de regressões |
| 15 | Mockservices misturados com código de produção | `client/src/lib/mockServices.ts` | Médio — confusão de intenção |
| 16 | Passport/express-session instalados mas não usados | `package.json` | Baixo — peso desnecessário |
| 17 | `personal_gallery`, `personal_services`, `personal_experience` criados sem endpoints | `shared/schema.ts` + ausência em routes.ts | Baixo — funcionalidade prometida |
| 18 | Sem validação de conflito de horários | handlers de appointments e slots | Alto — problema operacional |
| 19 | Sem paginação no frontend do feed | `client/src/pages/feed.tsx` | Baixo — performance futura |
| 20 | Toggles de configuração sem persistência | `client/src/pages/settings.tsx` | Baixo — UX |

---

## 20. Roadmap Técnico Atual

Com base na análise do código, o projeto está evoluindo em direção a uma **plataforma SaaS B2B2C de fitness** com as seguintes prioridades aparentes:

**Fase atual (MVP Core — parcialmente concluída):**
- Base de autenticação e perfis ✅
- Fluxo principal personal→aluno (treinos + agenda) ✅
- Marketplace para discovery de personals ✅
- Feed social para engajamento da comunidade ✅

**Próxima fase prevista (Infraestrutura):**
- Serviço de e-mail transacional (desbloqueador para recuperação de senha)
- Storage de arquivos (desbloqueador para fotos, galeria, feed com mídia)
- Sistema de notificações real (desbloqueador para engajamento ativo)

**Fase futura (Monetização):**
- Loja Bricks com gateway de pagamento
- Eventos esportivos com inscrições
- IA de treinos real com LLM

**Expansão de produto:**
- Galeria/serviços/experiências do personal (diferenciação de perfil)
- Relatórios e analytics para o personal
- App mobile (PWA ou React Native)

---

## 21. Árvore Completa do Sistema

```
Bricks
│
├── Frontend (client/)
│   ├── Público
│   │   ├── Landing Page (marketing, CTA, suporte WhatsApp)
│   │   ├── Autenticação (Login, Registro, Forgot/Reset Password)
│   │   ├── Marketplace (busca + filtro de personals)
│   │   ├── Perfil Público do Personal (avaliações, slots, orçamento)
│   │   └── Auto-cadastro de Aluno (via link de convite)
│   │
│   └── Autenticado
│       ├── Dashboard
│       │   ├── Dashboard Personal (stats, próximos, alunos recentes)
│       │   └── Dashboard Aluno (treinos, agendamentos)
│       ├── Treinos
│       │   ├── Lista de Treinos (personal)
│       │   ├── Detalhe do Treino + Exercícios (personal)
│       │   ├── IA de Treinos [MOCK]
│       │   ├── Treinos em Alta [MOCK]
│       │   └── Meus Treinos (aluno)
│       ├── Agenda
│       │   ├── Visualização Semanal/Diária
│       │   ├── Slots de Disponibilidade (personal)
│       │   ├── Agendamentos (personal + aluno)
│       │   └── Eventos Pessoais (personal)
│       ├── Alunos (personal)
│       │   ├── Lista + Busca + Filtros
│       │   ├── Cadastro Manual / Link de Convite / Conexão
│       │   ├── Atribuição de Treino
│       │   └── Perfil do Aluno
│       ├── Feed Social
│       │   ├── Timeline
│       │   ├── Criação de Post (texto + tipo + URL de imagem)
│       │   ├── Curtidas
│       │   └── Comentários
│       ├── Notificações
│       │   ├── Inbox (in-app real)
│       │   ├── Envio Imediato [MOCK]
│       │   ├── Agendamento [MOCK]
│       │   └── Recorrência [MOCK]
│       ├── Perfil
│       │   ├── Edição Personal (bio, especialidades, cidade, preço)
│       │   └── Edição Aluno (objetivos, notas)
│       ├── Configurações (senha, logout, conta)
│       ├── Eventos Esportivos [MOCK]
│       └── Loja Bricks [MOCK]
│
├── Backend (server/)
│   ├── Auth (registro, login, JWT, reset senha)
│   ├── Personals (perfil, marketplace, stats)
│   ├── Students (CRUD, vínculo, link de convite)
│   ├── Workouts (CRUD, exercícios, atribuição)
│   ├── Agenda (availability slots, appointments, personal events)
│   ├── Feed (posts, likes, comentários)
│   ├── Notifications (inbox in-app)
│   ├── Financial (receitas, despesas, resumo)
│   ├── Reviews (avaliações de personals)
│   ├── Quotes (solicitações de orçamento)
│   └── Dashboard (stats agregadas)
│
├── Shared (shared/)
│   ├── Schema Drizzle (todas as tabelas)
│   ├── Schemas Zod (validação frontend + backend)
│   └── TypeScript Types (modelos de dados)
│
└── Database (PostgreSQL)
    ├── users
    ├── personal_profiles
    ├── students
    ├── workouts + workout_exercises
    ├── student_workouts
    ├── availability_slots
    ├── appointments
    ├── student_plans
    ├── reviews
    ├── quote_requests
    ├── personal_gallery ⚠️ sem endpoints
    ├── personal_services ⚠️ sem endpoints
    ├── personal_experience ⚠️ sem endpoints
    ├── personal_events
    ├── financial_records
    ├── in_app_notifications
    ├── social_posts
    ├── post_likes
    └── post_comments
```

---

## 22. Resumo Executivo para o Tech Lead

### Visão Geral da Arquitetura
Monorepo full-stack TypeScript com React SPA no frontend e Express no backend, compartilhando contratos de tipo via `shared/schema.ts`. Arquitetura simples e direta, adequada para uma equipe pequena. O servidor Express serve tanto a API REST quanto os arquivos estáticos em produção.

### Principais Módulos
O core do produto (autenticação, alunos, treinos, agenda, marketplace) está implementado e funcional. Módulos de diferenciação (IA, notificações ativas, eventos, loja) estão mockados.

### Tecnologias
Stack moderna e bem escolhida: React 18 + TanStack Query + Zod + Drizzle ORM + PostgreSQL. Sem dependências exóticas. A curva de entrada para um desenvolvedor TypeScript experiente é baixa.

### Maturidade da Arquitetura
**Protótipo Avançado / MVP Incompleto.** A base técnica é sólida, mas a arquitetura do servidor precisa de refatoração antes de escalar (separação de rotas em módulos, camada de serviço, testes).

### Pontos Fortes
- Schema compartilhado entre front e back elimina inconsistências de tipo
- Drizzle ORM type-safe reduz erros de query
- Sistema de design consistente (shadcn/ui + Tailwind + tokens de marca)
- Fluxo de auto-cadastro de aluno via link é um diferencial bem implementado
- Código legível e sem abstrações desnecessárias

### Limitações
- `server/routes.ts` monolítico com ~1900 linhas — difícil de manter e testar
- Sem nenhum teste automatizado
- Sem camada de serviço — lógica de negócio nos handlers de rota
- Módulos críticos (notificações, IA) completamente mockados
- Ausência de serviços externos essenciais (e-mail, storage)

### Riscos Técnicos (por prioridade)
1. 🔴 **Token de reset de senha exposto na API** — resolver antes de qualquer usuário real
2. 🔴 **JWT sem expiração + fallback inseguro** — resolver antes do deploy em produção
3. 🔴 **Sem testes** — qualquer refatoração pode quebrar silenciosamente
4. 🟡 **Bug de rota** `/api/personals/stats` — inacessível por conflito com `:id`
5. 🟡 **Falta de validação de conflito de horários** — problema operacional real para usuários

### Primeiras Ações Recomendadas ao Assumir o Projeto
1. **Resolver os 2 bugs críticos de segurança** (reset token + JWT secret)
2. **Configurar um serviço de e-mail** (Resend.com — gratuito, simples) para desbloquear recuperação de senha
3. **Corrigir a ordem de rotas** (`/api/personals/stats` antes de `/:id`)
4. **Modularizar `server/routes.ts`** em arquivos por domínio (`routes/auth.ts`, `routes/workouts.ts`, etc.)
5. **Adicionar testes de integração** para os fluxos críticos (autenticação, criação de treino, agendamento)
6. **Configurar storage** (Replit Object Storage ou Cloudflare R2) para desbloquear uploads de mídia
7. **Substituir mockServices por backends reais** na ordem de prioridade de negócio
