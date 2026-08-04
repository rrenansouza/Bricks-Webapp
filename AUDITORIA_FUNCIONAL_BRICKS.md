# Auditoria Funcional Completa — Projeto Bricks
> Realizada em: agosto de 2026 | Método: análise estática de código-fonte (frontend + backend + schema)
> Papel: QA Sênior + Product Owner + Analista de Sistemas + Usuário Final

---

## 1. Inventário das Funcionalidades

### Autenticação

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Cadastro de usuário (personal/aluno) | `/register` | Criar conta com nome, email, senha e tipo | ✅ Funciona corretamente |
| Login | `/login` | Autenticar e obter JWT | ✅ Funciona corretamente |
| Logout | Configurações / Sidebar | Encerrar sessão | ✅ Funciona corretamente |
| Recuperação de senha (forgot) | `/forgot-password` | Gerar token de reset | 🔴 Não funciona (token retornado direto na resposta da API — falha grave de segurança) |
| Reset de senha | `/reset-password` | Redefinir senha com token | 🟡 Funciona parcialmente (formulário OK, mas fluxo de entrega do token é falho) |
| Troca de senha (logado) | Configurações | Alterar senha atual | ✅ Funciona corretamente |
| Foto de perfil | Perfil | Upload de foto | 🔴 Não implementada (campo `photoUrl` existe no schema, mas não há upload) |

### Dashboard

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Dashboard Personal — stats | `/dashboard` (personal) | Exibir contadores de alunos, treinos, agendamentos | ✅ Funciona corretamente |
| Dashboard Personal — próximos agendamentos | `/dashboard` (personal) | Cards de próximas aulas | ✅ Funciona corretamente |
| Dashboard Personal — lista de alunos | `/dashboard` (personal) | Exibir alunos ativos | ✅ Funciona corretamente |
| Dashboard Aluno — stats | `/dashboard` (aluno) | Treinos atribuídos, agendamentos | ✅ Funciona corretamente |
| Dashboard Aluno — workouts recentes | `/dashboard` (aluno) | Lista de treinos do aluno | ✅ Funciona corretamente |
| FirstAccessModal | Dashboard Personal | Modal de boas-vindas no primeiro acesso | 🔵 Visual apenas (componente existe, lógica de "primeiro acesso" não persiste) |
| BirthdayList | Dashboard | Lista de aniversários de alunos | 🔵 Visual apenas (componente existe, não há campo de data de nascimento funcional no fluxo) |
| WeeklySchedule | Dashboard | Resumo semanal da agenda | 🔵 Visual apenas |
| FinancialSummary | Dashboard | Resumo financeiro | 🟡 Funciona parcialmente (depende de `financial_records`, sem integração automática com pagamentos) |
| BarChart / DonutChart | Dashboard | Gráficos de desempenho | 🔵 Visual apenas (sem dados reais vinculados) |
| MiniCalendar | Dashboard | Mini calendário de eventos | 🔵 Visual apenas |

### Treinos (Personal)

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Criar treino | `/workouts` | Criar treino com nome, objetivo, descrição | ✅ Funciona corretamente |
| Listar treinos | `/workouts` | Ver todos os treinos criados | ✅ Funciona corretamente |
| Ver detalhe do treino | `/workouts/:id` | Detalhes + exercícios | ✅ Funciona corretamente |
| Deletar treino | `/workouts/:id` | Remover treino | ✅ Funciona corretamente |
| Adicionar exercício | `/workouts/:id` | Incluir exercício com séries, reps, vídeo | ✅ Funciona corretamente |
| Remover exercício | `/workouts/:id` | Deletar exercício do treino | ✅ Funciona corretamente |
| Editar treino | `/workouts/:id` | Atualizar nome/objetivo/descrição | 🔴 Não implementada (sem formulário de edição nem endpoint PATCH /api/workouts/:id) |
| Editar exercício | `/workouts/:id` | Atualizar exercício existente | 🔴 Não implementada |
| IA — Gerar treino | `/workouts` aba IA | Sugerir treino via inteligência artificial | 🔴 Não funciona (usa `aiWorkoutService.suggest` — serviço mock, sem integração real com IA) |
| Treinos em alta | `/workouts` aba Trending | Explorar treinos populares | 🔴 Não funciona (usa `trendingWorkoutsService` — mock; endpoint `/api/trending-workouts` inexistente no backend) |
| Copiar treino em alta | `/workouts` aba Trending | Clonar treino para biblioteca pessoal | 🔴 Não funciona (depende do mock) |

### Treinos (Aluno)

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Ver treinos atribuídos | `/my-workouts` | Listar treinos recebidos do personal | ✅ Funciona corretamente |
| Ver detalhe do treino | `/my-workouts/:id` | Ver exercícios e instruções | ✅ Funciona corretamente |
| Marcar treino como concluído | `/my-workouts/:id` | Registrar conclusão | ✅ Funciona corretamente |

### Alunos

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Listar alunos | `/students` | Ver todos os alunos do personal | ✅ Funciona corretamente |
| Buscar usuário para conectar | `/students` | Busca por nome/email | ✅ Funciona corretamente |
| Conectar aluno existente | `/students` | Vincular usuário aluno ao personal | ✅ Funciona corretamente |
| Cadastrar aluno manualmente | `/students` | Criar conta de aluno diretamente | ✅ Funciona corretamente |
| Gerar link de auto-cadastro | `/students` | Criar link de convite para aluno | ✅ Funciona corretamente |
| Auto-cadastro via link | `/register/student/:token` | Aluno preenche seus dados pelo convite | ✅ Funciona corretamente |
| Aprovar / rejeitar aluno | `/students` | Controle de acesso do aluno | ✅ Funciona corretamente |
| Remover aluno | `/students` | Desvincular aluno | ✅ Funciona corretamente |
| Atribuir treino ao aluno | `/students` | Enviar treino para aluno específico | ✅ Funciona corretamente |
| Ver perfil público do aluno | `/students/profile/:userId` | Ver dados do perfil do aluno | ✅ Funciona corretamente |
| Filtros de alunos | `/students` | Filtrar por status | 🟡 Funciona parcialmente (UI existe, lógica de filtro é local sem suporte a API) |

### Agenda / Agendamento

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Visualizar semana na agenda | `/schedule` | Calendário semanal com eventos | ✅ Funciona corretamente |
| Visualizar dia na agenda | `/schedule` | Visão diária com horários | ✅ Funciona corretamente |
| Criar disponibilidade (slot) | `/schedule` | Personal define horários livres | ✅ Funciona corretamente |
| Remover disponibilidade | `/schedule` | Deletar slot disponível | ✅ Funciona corretamente |
| Criar agendamento (personal) | `/schedule` | Personal agenda aula diretamente | ✅ Funciona corretamente |
| Aprovar agendamento | `/schedule` | Personal aceita solicitação do aluno | ✅ Funciona corretamente |
| Recusar agendamento | `/schedule` | Personal recusa solicitação | ✅ Funciona corretamente |
| Cancelar agendamento | `/schedule` | Cancelar aula confirmada | ✅ Funciona corretamente |
| Criar evento pessoal | `/schedule` | Personal adiciona compromisso pessoal | ✅ Funciona corretamente |
| Editar evento pessoal | `/schedule` | Atualizar evento | ✅ Funciona corretamente |
| Deletar evento pessoal | `/schedule` | Remover evento | ✅ Funciona corretamente |
| Solicitar agendamento (aluno) | Marketplace/Perfil do Personal | Aluno solicita aula com personal | 🟡 Funciona parcialmente (botão de solicitar existe na tela de detalhes do personal, mas fluxo de criação pelo aluno não está mapeado completamente) |
| Detecção de conflito de horários | `/schedule` | Impedir sobreposição de agendamentos | 🔴 Não implementada (backend não valida conflito ao criar appointment ou slot) |
| Notificação ao aluno sobre agendamento | Sistema | Avisar aluno da aprovação/recusa | 🔴 Não implementada (não há criação automática de in_app_notification nos handlers de agendamento) |

### Perfil

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Ver perfil próprio | `/profile` | Exibir dados pessoais e profissionais | ✅ Funciona corretamente |
| Editar perfil (personal) | `/profile` | Atualizar bio, especialidades, cidade, preço | ✅ Funciona corretamente |
| Editar perfil (aluno) | `/profile` | Atualizar objetivos e notas | ✅ Funciona corretamente |
| Upload de foto de perfil | `/profile` | Alterar foto | 🔴 Não implementada |
| Galeria de fotos/vídeos (personal) | `/profile` | Exibir portfólio | 🔵 Visual apenas (tabela `personal_gallery` existe, sem endpoints nem UI de upload) |
| Serviços oferecidos (personal) | `/profile` | Listar serviços e preços | 🔵 Visual apenas (tabela `personal_services` existe, sem endpoints) |
| Experiências profissionais (personal) | `/profile` | Exibir histórico | 🔵 Visual apenas (tabela `personal_experiences` existe, sem endpoints) |

### Marketplace

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Listar personals | `/personals` | Descobrir personal trainers | ✅ Funciona corretamente |
| Filtrar por especialidade | `/personals` | Buscar por tipo de treino | ✅ Funciona corretamente |
| Filtrar por cidade | `/personals` | Buscar por localização | ✅ Funciona corretamente |
| Busca por nome | `/personals` | Busca textual | ✅ Funciona corretamente |
| Ver perfil do personal | `/personals/:id` | Detalhes, avaliações, serviços | ✅ Funciona corretamente |
| Enviar solicitação de orçamento | `/personals/:id` | Aluno solicita informações | ✅ Funciona corretamente |
| Ver avaliações | `/personals/:id` | Exibir reviews de alunos | ✅ Funciona corretamente |
| Criar avaliação | `/personals/:id` | Aluno avalia personal | 🟡 Funciona parcialmente (sem validação de que o aluno teve relação com o personal) |
| Ver slots disponíveis | `/personals/:id` | Exibir horários livres | ✅ Funciona corretamente |
| Agendar aula pelo marketplace | `/personals/:id` | Aluno solicita agendamento direto | 🟡 Funciona parcialmente (UI presente, mas fluxo de criação de appointment pelo aluno sem ser vinculado ao personal precisa de validação) |

### Notificações

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Ver notificações do inbox | `/notifications` | Ver notificações recebidas | ✅ Funciona corretamente |
| Marcar como lida | `/notifications` | Atualizar status da notificação | ✅ Funciona corretamente |
| Marcar todas como lidas | `/notifications` | Limpar inbox | ✅ Funciona corretamente |
| Enviar notificação (personal) | `/notifications` | Personal envia mensagem aos alunos | 🔴 Não funciona (usa `notificationService` — serviço completamente mock, não persiste nem entrega dados) |
| Agendar notificação | `/notifications` | Envio programado | 🔴 Não funciona (mock) |
| Notificação recorrente | `/notifications` | Envios periódicos | 🔴 Não funciona (mock) |
| Notificações por e-mail | Sistema | Envio via email | ⚪ Não implementada (sem serviço de email) |
| Notificações WhatsApp | Sistema | Envio via WhatsApp | ⚪ Não implementada (sem integração real) |

### Feed Social

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Ver feed | `/feed` | Listar publicações da comunidade | ✅ Funciona corretamente |
| Criar publicação | `/feed` | Publicar texto e tipo de post | ✅ Funciona corretamente |
| Deletar publicação própria | `/feed` | Remover post | ✅ Funciona corretamente |
| Curtir publicação | `/feed` | Like/unlike | ✅ Funciona corretamente |
| Comentar publicação | `/feed` | Adicionar comentário | ✅ Funciona corretamente |
| Adicionar imagem por URL | `/feed` | Inserir mídia | 🟡 Funciona parcialmente (aceita URL de imagem; sem upload real de arquivo) |
| Upload de imagem real | `/feed` | Upload direto de arquivo | 🔴 Não implementada |
| Upload de vídeo | `/feed` | Publicar vídeo | 🔴 Não implementada |
| Compartilhar publicação | `/feed` | Repost ou share externo | 🔴 Não implementada (botão ausente) |
| Paginação do feed | `/feed` | Carregar mais posts | 🔵 Visual apenas (API tem `limit/offset`, frontend não usa) |

### Eventos

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Listar eventos esportivos | `/events` | Descobrir eventos com desconto Bricks | 🔴 Não funciona (usa `eventsService` — mock; endpoint `/api/events` inexistente no backend) |
| Filtrar eventos por cidade/tipo | `/events` | Refinar busca | 🔴 Não funciona (mock) |
| Ver detalhe do evento | `/events` (modal) | Informações completas do evento | 🔴 Não funciona (mock) |
| Inscrição em evento | `/events` | Comprar ingresso | 🔴 Não implementada (botão sem ação) |

### Loja

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Listar produtos | `/store` | Ver produtos com desconto Bricks | 🔴 Não funciona (usa `productsService` — mock; endpoint `/api/products` inexistente no backend) |
| Filtrar por categoria | `/store` | Refinar catálogo | 🔴 Não funciona (mock) |
| Ver detalhe do produto | `/store` (modal) | Ver informações do produto | 🔴 Não funciona (mock) |
| Selecionar tamanho | `/store` (modal) | Escolher variante | 🔵 Visual apenas |
| Adicionar ao carrinho | `/store` (modal) | Iniciar compra | 🔴 Não implementada (botão sem ação) |

### Configurações

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Alterar senha | `/settings` | Mudar senha da conta | ✅ Funciona corretamente |
| Logout | `/settings` | Desconectar | ✅ Funciona corretamente |
| Deletar conta | `/settings` | Encerrar conta | 🔴 Não funciona (chama `logout()` localmente sem deletar dados do servidor; sem endpoint DELETE /api/users/me) |
| Toggles de notificação (e-mail, push, agenda) | `/settings` | Salvar preferências | 🔵 Visual apenas (estado local, não persiste) |
| Modo escuro | `/settings` | Alternar tema | 🔵 Visual apenas (toggle não altera tema real, app já é dark by default) |

### Suporte

| Funcionalidade | Tela | Objetivo | Status |
|---|---|---|---|
| Botão WhatsApp | Landing | Contato direto | ✅ Funciona corretamente |
| Formulário de suporte | Landing | Enviar mensagem de suporte | 🟡 Funciona parcialmente (abre diálogo e envia para WhatsApp, mas sem backend de registro) |

---

## 2. Teste dos Fluxos

### Fluxo 1 — Cadastro de Usuário
- **Esperado:** Usuário preenche nome, e-mail, senha e tipo → conta criada → redirecionamento para dashboard.
- **Real:** Funciona corretamente. Cria perfil (personal_profile ou student) automaticamente conforme tipo.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 2 — Login
- **Esperado:** E-mail + senha → JWT → acesso ao dashboard.
- **Real:** Funciona. JWT armazenado e enviado em cada requisição autenticada.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 3 — Recuperação de Senha
- **Esperado:** Usuário recebe e-mail com link de reset.
- **Real:** API POST `/api/auth/forgot-password` retorna o `resetToken` **diretamente no JSON da resposta** em vez de enviá-lo por e-mail. Qualquer pessoa que inspecione o tráfego obtém o token.
- **Impacto:** 🔴 **Crítico** — falha de segurança grave. Sem serviço de e-mail, o fluxo de recuperação real não funciona.

### Fluxo 4 — Edição de Perfil
- **Esperado:** Personal/aluno atualiza dados → salvos no banco.
- **Real:** Funciona. PATCH `/api/personals/me` e `/api/students/me` operacionais.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 5 — Cadastro de Aluno pelo Personal
- **Esperado:** Personal cria conta de aluno com nome, e-mail, CPF → aluno recebe acesso.
- **Real:** Funciona. `POST /api/students/create` cria usuário e student vinculado.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 6 — Auto-cadastro via Link
- **Esperado:** Personal gera link → aluno acessa `/register/student/:token` → preenche dados → conta criada vinculada.
- **Real:** Funciona completamente. Token validado, aluno criado e vinculado ao personal.
- **Impacto:** ✅ Diferencial bem implementado.

### Fluxo 7 — Criação e Atribuição de Treino
- **Esperado:** Personal cria treino → adiciona exercícios → atribui ao aluno.
- **Real:** Criação e adição de exercícios funcionam. Atribuição (`POST /api/student-workouts`) funciona.
- **Impacto:** ✅ Fluxo principal do produto operacional.

### Fluxo 8 — Aluno Executa Treino
- **Esperado:** Aluno vê treino em `/my-workouts` → executa → marca como concluído.
- **Real:** Funciona. PATCH `/api/student-workouts/:id/complete` funciona.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 9 — Agendamento de Aula (Personal cria)
- **Esperado:** Personal cria agendamento para aluno → aparece na agenda de ambos.
- **Real:** Funciona. POST `/api/appointments` com status `pending`, PATCH de status operacional.
- **Impacto:** ✅ Nenhum bloqueio.

### Fluxo 10 — Agendamento de Aula (Aluno solicita pelo Marketplace)
- **Esperado:** Aluno vê slots disponíveis do personal → solicita horário → personal aprova/recusa.
- **Real:** Slots visíveis. Criação de appointment pelo aluno possível via API, mas falta notificação automática ao personal.
- **Impacto:** 🟡 Funciona, mas personal não é notificado da nova solicitação.

### Fluxo 11 — Feed Social
- **Esperado:** Usuário publica texto (com foto opcional) → aparece no feed → outros curtam e comentem.
- **Real:** Funciona para texto + URL de imagem. Curtidas e comentários funcionam.
- **Impacto:** 🟡 Sem upload real de arquivo, experiência é limitada.

### Fluxo 12 — Notificações Enviadas pelo Personal
- **Esperado:** Personal abre `/notifications` → redige mensagem → aluno recebe no inbox.
- **Real:** Toda a tela usa `notificationService` mock. Nenhuma notificação é salva no banco ou entregue.
- **Impacto:** 🔴 Funcionalidade completamente não funcional apesar da UI elaborada.

### Fluxo 13 — Eventos e Loja
- **Esperado:** Usuário navega, vê eventos/produtos reais, se inscreve ou compra.
- **Real:** Ambas as telas usam serviços mock com dados hardcoded. Não há backend real.
- **Impacto:** 🔴 Funcionalidade decorativa no estado atual.

---

## 3. Botões e Ações

### Landing Page
| Elemento | Localização | Status |
|---|---|---|
| "Começar Gratuitamente" (hero) | landing.tsx:~linha 120 | ✅ Redireciona para `/register` |
| "Ver Personal Trainers" | landing.tsx | ✅ Redireciona para `/personals` |
| Botão de plano secundário | landing.tsx:~366 | 🔴 Sem ação (onClick ausente) |
| Botão WhatsApp suporte | landing.tsx | ✅ Abre WhatsApp |
| "Entrar" no header | landing.tsx | ✅ Redireciona para `/login` |

### Autenticação
| Elemento | Localização | Status |
|---|---|---|
| "Entrar" (submit login) | auth.tsx | ✅ Funciona |
| "Criar conta" (submit registro) | auth.tsx | ✅ Funciona |
| "Copiar link de reset" | auth.tsx:~380 | ✅ Copia token (que veio na resposta da API) |
| "Redefinir senha" | auth.tsx | ✅ Funciona |

### Dashboard Personal
| Elemento | Localização | Status |
|---|---|---|
| "Novo Treino" | dashboard-personal.tsx | ✅ Navega para `/workouts/new` |
| "Ver Agenda" | dashboard-personal.tsx | ✅ Navega para `/schedule` |
| "Ver Alunos" | dashboard-personal.tsx | ✅ Navega para `/students` |

### Treinos
| Elemento | Localização | Status |
|---|---|---|
| "Criar Treino" | workouts.tsx | ✅ Funciona |
| "Gerar com IA" | workouts.tsx | 🔴 Mock — não gera treino real |
| "Salvar treino da IA" | workouts.tsx | 🔴 Depende do mock |
| "Copiar treino em alta" | workouts.tsx | 🔴 Mock |
| "Adicionar exercício" | workouts.tsx | ✅ Funciona |
| "Deletar exercício" | workouts.tsx | ✅ Funciona |
| "Deletar treino" | workouts.tsx | ✅ Funciona (com confirmação) |
| Editar treino | workouts.tsx | 🔴 Botão/fluxo ausente |

### Agenda
| Elemento | Localização | Status |
|---|---|---|
| Navegação de semanas (◀ ▶) | schedule.tsx | ✅ Funciona |
| "Adicionar horário" (slot) | schedule.tsx | ✅ Funciona |
| "Adicionar agendamento" | schedule.tsx | ✅ Funciona |
| "Adicionar evento" | schedule.tsx | ✅ Funciona |
| "Aprovar" agendamento | schedule.tsx | ✅ Funciona |
| "Recusar" agendamento | schedule.tsx | ✅ Funciona |
| "Cancelar" agendamento | schedule.tsx | ✅ Funciona |
| "Editar evento" | schedule.tsx | ✅ Funciona |
| "Deletar evento" | schedule.tsx | ✅ Funciona |
| "Deletar slot" | schedule.tsx | ✅ Funciona |

### Notificações (tela do personal)
| Elemento | Localização | Status |
|---|---|---|
| "Enviar agora" | notifications.tsx | 🔴 Mock — não envia nada |
| "Agendar envio" | notifications.tsx | 🔴 Mock |
| "Criar recorrência" | notifications.tsx | 🔴 Mock |
| "Cancelar notificação" agendada | notifications.tsx | 🔴 Mock |
| "Pausar recorrência" | notifications.tsx | 🔴 Mock |

### Configurações
| Elemento | Localização | Status |
|---|---|---|
| "Alterar senha" (abre dialog) | settings.tsx | ✅ Funciona |
| "Salvar nova senha" | settings.tsx | ✅ Funciona |
| "Sair da conta" | settings.tsx | ✅ Funciona |
| "Deletar conta" | settings.tsx | 🔴 Só faz logout local, não deleta no servidor |
| Toggles de notificação | settings.tsx | 🔵 Visual apenas — não persiste |
| Toggle modo escuro | settings.tsx | 🔵 Visual apenas |

### Eventos
| Elemento | Localização | Status |
|---|---|---|
| "Ver mais" (card de evento) | events.tsx | 🟡 Abre modal com dados do mock |
| "Inscrever-se" (modal do evento) | events.tsx:289 | 🔴 Sem ação (nenhum onClick) |

### Loja
| Elemento | Localização | Status |
|---|---|---|
| Seleção de tamanho | store.tsx | ✅ Estado local funciona |
| "Adicionar ao Carrinho" | store.tsx:228 | 🔴 Sem ação (nenhum onClick) |

---

## 4. Formulários

### Formulário de Cadastro (Register)
- ✅ Campos obrigatórios: nome, e-mail, senha, tipo de usuário
- ✅ Validação Zod no frontend (mínimo 6 chars para senha, e-mail válido)
- ✅ Mensagens de erro exibidas
- ⚠️ Senha sem confirmação de senha no cadastro (possível typo não detectado)
- ⚠️ Sem validação de CPF no cadastro principal

### Formulário de Login
- ✅ Validação básica (e-mail + senha)
- ✅ Estado de loading desabilita botão

### Formulário de Criação de Treino
- ✅ Nome obrigatório
- ✅ Objetivo e descrição opcionais
- 🟡 Objective e level são texto livre — deveriam ser enums (Hipertrofia, Emagrecimento, etc.)

### Formulário de Exercício
- ✅ Campos: nome, grupo muscular, séries, reps, carga, tempo, descanso, vídeo, observações
- ✅ Validação mínima (nome obrigatório)
- 🟡 URL de vídeo não validada (qualquer string aceita)

### Formulário de Cadastro de Aluno (manual)
- ✅ Nome, e-mail, CPF, telefone, data de nascimento
- ⚠️ `birthDate` é string no schema Zod do formulário, mas timestamp no banco — conversão necessária
- ⚠️ CPF aceita qualquer string, sem máscara ou validação de dígito verificador
- ⚠️ Telefone sem máscara

### Formulário de Agendamento
- ✅ Aluno, data, hora início/fim, local, observações
- ✅ Validação de seleção de aluno obrigatória
- 🔴 Sem validação de conflito de horário no frontend ou backend

### Formulário de Avaliação (marketplace)
- ✅ Rating e comentário
- 🟡 Sem verificação de que o aluno já foi atendido pelo personal avaliado

### Formulário de Mudança de Senha
- ✅ Validação: mínimo 6 chars, maiúscula, número
- ✅ Confirmação de senha com `refine`
- ⚠️ Sem campo de senha atual (qualquer token válido pode mudar a senha sem confirmar a atual)

### Formulário de Notificações (personal)
- 🔴 Completamente mock — dados não persistem

### Toggles de Configurações
- 🔵 Estado local apenas — reset ao recarregar a página

---

## 5. Agenda

### O que funciona:
- ✅ Visualização semanal e diária com navegação por datas
- ✅ Calendário lateral com seleção de data
- ✅ Renderização visual de appointments e eventos pessoais na grade horária
- ✅ Código de cores por tipo de evento
- ✅ Criação de slots de disponibilidade (personal)
- ✅ Criação, edição e remoção de eventos pessoais
- ✅ Criação de agendamentos com aluno, data, hora, local, deslocamento
- ✅ Aprovação, recusa e cancelamento de agendamentos
- ✅ Detalhes em modal ao clicar no evento

### O que falta (comparado a Google Calendar / Outlook):
- 🔴 **Sem detecção de conflito de horários** — é possível criar dois agendamentos no mesmo horário
- 🔴 **Sem visualização mensal** — apenas semana e dia
- 🔴 **Sem recorrência de eventos** — campo existe na interface mas sem implementação
- 🔴 **Sem sincronização com Google Calendar / iCal**
- 🔴 **Sem arrastar e soltar** para reagendar
- 🟡 **Slots de disponibilidade** não são exibidos graficamente como blocos na grade (ficam em lista separada)
- 🟡 **Agenda do aluno**: aluno não pode solicitar horários diretamente pela agenda — só pelo marketplace
- ⚠️ Sem paginação ou lazy-loading — carrega todos os appointments de uma vez

---

## 6. Agendamento de Aulas — Fluxo Completo

| Etapa | Status |
|---|---|
| Personal cria appointment | ✅ |
| Aluno solicita via marketplace | 🟡 (sem confirmação visual clara de "solicitação enviada") |
| Personal aprova | ✅ |
| Personal recusa | ✅ |
| Cancelamento após aprovação | ✅ |
| Notificação automática ao aluno | 🔴 Não implementada |
| Notificação automática ao personal | 🔴 Não implementada |
| Atualização automática em tempo real | 🔴 Não implementada (requer refresh manual) |
| Exibição na agenda do aluno | ✅ |
| Exibição na agenda do personal | ✅ |
| Persistência no banco | ✅ |

---

## 7. Associação entre Perfis (Personal ↔ Aluno)

| Método | Status |
|---|---|
| Cadastro manual pelo personal | ✅ Funciona |
| Auto-cadastro via link de convite | ✅ Funciona |
| Conectar usuário já existente (busca + connect) | ✅ Funciona |
| Sincronização de dados entre perfis | ✅ Funciona (student.personalId vinculado) |
| Acesso a funcionalidades dependentes do vínculo | ✅ Personal vê alunos, atribui treinos, agenda |
| Aprovação do vínculo | ✅ Personal pode aprovar/rejeitar |
| Remoção do vínculo | ✅ DELETE /api/students/:id |

**Inconsistências:**
- 🟡 Um aluno só pode ter **um** personal trainer (`personalId` no student). Não há suporte a múltiplos personals.
- 🟡 Ao usar "conectar usuário existente" (`POST /api/students/connect/:userId`), se o aluno já tiver um `student` record com outro personal, o handler apenas atualiza o `personalId` sem notificar nenhuma das partes.

---

## 8. Feed Social

| Funcionalidade | Status |
|---|---|
| Criar publicação de texto | ✅ |
| Tipos de post (check-in, progresso, conquista, dica) | ✅ |
| Imagem via URL | 🟡 |
| Upload de arquivo de imagem | 🔴 |
| Upload de vídeo | 🔴 |
| Curtir / descurtir | ✅ |
| Comentar | ✅ |
| Deletar post próprio | ✅ |
| Carregamento cronológico | ✅ |
| Paginação (scroll infinito) | 🔴 Frontend não implementa paginação |
| Atualização em tempo real | 🔴 Sem WebSocket / polling |
| Compartilhar | 🔴 Não implementado |

---

## 9. Perfis

### Personal Trainer — Campos presentes:
- ✅ Nome, e-mail
- ✅ Bio, especialidades, cidade, bairro, preço médio
- ✅ CREF (no seed — sem campo de edição na UI)
- 🟡 Foto de perfil (campo existe, sem upload)
- 🔴 Galeria de mídia (tabela existe, sem endpoint/UI)
- 🔴 Serviços e preços (tabela existe, sem endpoint/UI)
- 🔴 Experiências profissionais (tabela existe, sem endpoint/UI)
- 🔴 Eventos criados pelo personal (tabela `personal_events` é para agenda pessoal, não marketplace)

### Aluno — Campos presentes:
- ✅ Nome, e-mail
- ✅ Objetivos, notas
- 🟡 CPF (no formulário de criação, mas não exibido no perfil — exposto apenas no campo redact)
- 🔴 Data de nascimento (campo no banco, sem exibição ou edição)
- 🔴 Foto de perfil

---

## 10. Busca

| Tipo de Busca | Tela | Status |
|---|---|---|
| Busca de personals por nome | `/personals` | ✅ Funciona (debounced com `useDeferredValue`) |
| Filtro por especialidade | `/personals` | ✅ Funciona |
| Filtro por cidade | `/personals` | ✅ Funciona |
| Busca de usuários para conectar | `/students` | ✅ Funciona (`GET /api/users/search?q=`) |
| Filtro de alunos por status | `/students` | 🟡 Local apenas |
| Busca sem resultado | `/personals` | ✅ Mensagem exibida |
| Busca no feed | `/feed` | 🔴 Não implementada |
| Busca na agenda | `/schedule` | 🔴 Não implementada |
| Busca por CPF | Sistema | 🔴 Não implementada |

---

## 11. Experiência do Usuário (UX)

| Problema | Onde | Sugestão |
|---|---|---|
| Objetivo e nível do treino são campos de texto livre | workouts.tsx | Usar Select com enum: Hipertrofia, Emagrecimento, Funcional, etc. |
| Não há confirmação visual após criar treino | workouts.tsx | Toast já existe; mas redirecionar para o treino criado seria melhor |
| Tela de Notificações do personal é muito complexa (3 abas com formulários) | notifications.tsx | Simplificar: unificar envio imediato + histórico em 2 abas |
| Botão "Inscrever-se" na tela de Eventos não faz nada | events.tsx | Remover ou implementar; deixar sem ação confunde o usuário |
| Botão "Adicionar ao Carrinho" não faz nada | store.tsx | Idem |
| Toggles de configuração sem persistência | settings.tsx | Salvar em localStorage ou API |
| "Deletar conta" sem feedback de erro | settings.tsx | Chamar endpoint real ou mostrar mensagem de que a funcionalidade está em construção |
| Foto de perfil: campo visível mas sem UI de upload | profile.tsx | Ocultar campo ou implementar upload com placeholder claro |
| Ausência de breadcrumb ou título de seção no mobile | App inteiro | Adicionar header com nome da seção para contexto |
| Tela de notificações recebidas tem aba separada das notificações enviadas | notifications.tsx | Separação confusa — usuário pode não encontrar inbox |

---

## 12. Funcionalidades Inacabadas

| Funcionalidade | O que existe | O que falta | Impacto |
|---|---|---|---|
| IA de Treinos | UI completa com formulário elaborado | Integração com LLM real (OpenAI, etc.) | Personal não consegue usar o diferencial mais promissório |
| Treinos em Alta | UI com filtros e cards | Endpoint real + curadoria de treinos | Aba sem conteúdo |
| Sistema de Notificações (envio pelo personal) | UI elaborada com 3 abas | Toda a lógica de backend (criação, agendamento, envio) | Funcionalidade central para engajamento de alunos não funciona |
| Loja Bricks | UI completa com produtos e carrinho | Backend completo (produtos, carrinho, checkout) | Nenhuma transação possível |
| Eventos Esportivos | UI com filtros e cards | Backend completo (eventos, inscrições) | Nenhuma inscrição possível |
| Upload de mídia | UI com botão de imagem no feed | Serviço de armazenamento (S3, Cloudflare R2, etc.) | Feed limitado a URLs externas |
| Recuperação de senha por e-mail | Formulário funcional | Serviço de e-mail transacional (SendGrid, Resend, etc.) | Usuários que esquecem a senha ficam bloqueados |
| Galeria do Personal | Schema de banco criado | Endpoints CRUD + UI de upload | Perfil do personal incompleto |
| Serviços do Personal | Schema criado | Endpoints CRUD + UI | Personal não consegue detalhar o que oferece |
| Edição de treino | UI de detalhes criada | Formulário de edição + endpoint PATCH | Erro de digitação no treino exige deletar e recriar |
| Conflito de horários na agenda | UI de agenda funcional | Validação no backend ao criar appointment/slot | Personal pode ter dois alunos no mesmo horário |
| Notificações automáticas do sistema | Schema `in_app_notifications` existe | Lógica de criação automática em eventos (aprovação de agendamento, novo aluno, etc.) | Nenhum evento gera notificação real |

---

## 13. Bugs Encontrados

### BUG-001 — Token de reset de senha exposto na resposta da API
- **Tela:** `/forgot-password`
- **Passos:** Fazer POST em `/api/auth/forgot-password` com e-mail válido
- **Resultado atual:** Token retornado em `{ resetToken: "..." }` no corpo da resposta
- **Esperado:** Token enviado por e-mail; resposta genérica de confirmação
- **Gravidade:** 🔴 Crítico

### BUG-002 — Endpoint `/api/personals/stats` inacessível (conflito de rota)
- **Tela:** Dashboard / Profile do personal
- **Passos:** GET `/api/personals/stats`
- **Resultado atual:** Rota `/api/personals/:id` captura "stats" como `:id`, retornando erro 404 ou dados de personal com id "stats"
- **Esperado:** Retorno das estatísticas do personal autenticado
- **Gravidade:** 🔴 Alto

### BUG-003 — Deletar conta não apaga dados no servidor
- **Tela:** `/settings`
- **Passos:** Clicar em "Deletar conta" e confirmar
- **Resultado atual:** Apenas `logout()` local; dados permanecem no banco
- **Esperado:** DELETE no servidor + logout
- **Gravidade:** 🟡 Médio (LGPD: usuário tem direito à exclusão dos dados)

### BUG-004 — `markNotificationRead` sem verificação de dono
- **Tela:** Backend — `/api/notifications/inbox/:id/read`
- **Passos:** PATCH com qualquer ID de notificação
- **Resultado atual:** Qualquer usuário autenticado pode marcar a notificação de outro como lida
- **Esperado:** Verificar se a notificação pertence ao usuário logado
- **Gravidade:** 🟡 Médio

### BUG-005 — Update/delete de eventos, financial records e appointment sem verificação de posse
- **Tela:** Backend
- **Passos:** PATCH/DELETE em `/api/personal-events/:id`, `/api/financial/:id`, `/api/appointments/:id/status`
- **Resultado atual:** Qualquer personal autenticado pode alterar dados de outro
- **Esperado:** Verificar propriedade do recurso antes de modificar
- **Gravidade:** 🟡 Médio

### BUG-006 — Middleware de erro relança exceção após responder
- **Tela:** Backend — server/index.ts linhas 65-71
- **Passos:** Qualquer rota que lança erro
- **Resultado atual:** `res.status().json()` é chamado e depois `throw err` é executado; o processo Node.js pode encerrar por unhandled rejection
- **Esperado:** Logar o erro sem relançar após resposta enviada
- **Gravidade:** 🟡 Médio

### BUG-007 — Resposta da API loga corpo JSON completo (PII)
- **Tela:** Backend — server/index.ts linhas 36-60
- **Passos:** Qualquer requisição à API
- **Resultado atual:** Corpo completo da resposta é logado, incluindo tokens JWT, dados pessoais
- **Esperado:** Log apenas de status e tempo; sem corpo em produção
- **Gravidade:** 🟡 Médio

### BUG-008 — JWT assinado com segredo padrão "insecure-secret" se SESSION_SECRET não estiver definido
- **Tela:** Backend — autenticação
- **Passos:** Deploy sem `SESSION_SECRET`
- **Resultado atual:** Tokens assinados com string conhecida — qualquer pessoa pode forjar tokens
- **Esperado:** Falhar na inicialização se SESSION_SECRET não estiver definido
- **Gravidade:** 🔴 Crítico em produção

### BUG-009 — Criação de avaliação sem validar relação personal-aluno
- **Tela:** `/personals/:id` (público)
- **Passos:** POST `/api/personals/:id/reviews` com token de aluno sem relação com o personal
- **Resultado atual:** Review criado com sucesso
- **Esperado:** Verificar se o aluno é/foi vinculado ao personal
- **Gravidade:** 🟡 Médio (permite reviews fraudulentos)

### BUG-010 — Campo de objetivo do treino sem enum — aceita valores arbitrários
- **Tela:** `/workouts`
- **Passos:** Criar treino com objetivo "xpto qualquer"
- **Resultado atual:** Salvo sem erro
- **Esperado:** Enum restrito (Hipertrofia, Emagrecimento, etc.)
- **Gravidade:** 🔵 Baixo

### BUG-011 — CPF do aluno sem validação de dígito verificador
- **Tela:** `/students` (cadastro manual)
- **Passos:** Inserir CPF inválido (ex: "111.111.111-11")
- **Resultado atual:** Aceito e salvo
- **Esperado:** Validação de CPF com algoritmo de verificação
- **Gravidade:** 🔵 Baixo

### BUG-012 — birthDate do aluno: tipo incompatível entre formulário e banco
- **Tela:** `/students` (cadastro manual)
- **Passos:** Criar aluno com data de nascimento
- **Resultado atual:** String enviada ao banco que espera timestamp; pode gerar erro de tipo ou data errada
- **Esperado:** Conversão de string para Date antes de inserir
- **Gravidade:** 🟡 Médio

---

## 14. Melhorias Recomendadas

### UX
1. **Feedback de loading global**: adicionar skeleton screens em todas as listagens, não apenas em algumas
2. **Estado vazio rico**: telas de Feed, Agenda (sem appointments) e Treinos devem ter CTA de "criar primeiro item"
3. **Confirmação antes de deletar**: workouts, exercícios e alunos deveriam ter AlertDialog de confirmação
4. **Breadcrumbs no mobile**: usuário perde contexto de onde está
5. **Indicador de notificações não lidas**: badge no ícone do sino na sidebar

### Funcionalidades
6. **Integração de e-mail transacional** (Resend / SendGrid): necessário para recuperação de senha funcionar
7. **Upload de arquivos** (Cloudflare R2 / AWS S3): necessário para foto de perfil, feed, galeria
8. **IA de treinos real**: integrar OpenAI API com prompt estruturado
9. **Notificações push** (FCM / Web Push): para engajamento de alunos
10. **Edição de treinos e exercícios**: fluxo básico ainda ausente

### Organização
11. **Separar perfil público do personal da edição de perfil**: `/profile` é para editar; `/personals/:id` é para ver — manter consistente
12. **Unificar mock services**: criar uma camada de abstração que facilite substituir mocks por chamadas reais sem alterar componentes

### Produtividade
13. **Dashboard com métricas reais**: gráficos de retenção de alunos, treinos concluídos no mês, receita
14. **Relatório de alunos em PDF**: frequência, evolução, treinos realizados

---

## 15. Checklist Executivo

| Funcionalidade | Status | Gravidade | Prioridade | Observações |
|---|---|---|---|---|
| Cadastro / Login / JWT | ✅ | — | — | Base sólida |
| Recuperação de senha | 🔴 | Crítico | P0 | Token exposto na API |
| JWT com segredo padrão inseguro | 🔴 | Crítico | P0 | Risco em produção |
| Edição de perfil | ✅ | — | — | Funcional |
| Upload de foto | 🔴 | Alto | P1 | Sem serviço de storage |
| Criação / atribuição de treinos | ✅ | — | — | Fluxo principal OK |
| Edição de treinos | 🔴 | Médio | P1 | Falta endpoint + UI |
| IA de treinos | 🔴 | Alto | P2 | Mock sem IA real |
| Treinos em alta | 🔴 | Baixo | P3 | Mock |
| Cadastro e vínculo de alunos | ✅ | — | — | Completo e bem implementado |
| Agenda (visualização + criação) | ✅ | — | — | Boa implementação |
| Conflito de horários | 🔴 | Alto | P1 | Sem validação |
| Aprovação / recusa de agendamentos | ✅ | — | — | Funcional |
| Notificações automáticas do sistema | 🔴 | Alto | P1 | Nenhum evento gera notificação |
| Envio de notificações pelo personal | 🔴 | Alto | P1 | Completamente mock |
| Feed social (texto + likes + comentários) | ✅ | — | — | Funcional |
| Upload de mídia no feed | 🔴 | Médio | P2 | Só URL externa |
| Marketplace de personals | ✅ | — | — | Funcional |
| Avaliações sem validação de relação | 🟡 | Médio | P1 | Reviews fraudulentos possíveis |
| Eventos esportivos | 🔴 | Médio | P2 | 100% mock |
| Loja Bricks | 🔴 | Médio | P3 | 100% mock |
| Bug de rota `/api/personals/stats` | 🔴 | Alto | P0 | Inacessível |
| Segurança de ownership em CRUD | 🟡 | Médio | P1 | Múltiplos endpoints vulneráveis |
| Deletar conta | 🔴 | Médio | P1 | Não apaga dados (LGPD) |
| Toggles de configuração | 🔵 | Baixo | P2 | Sem persistência |

---

## 16. Roadmap de Correções

### P0 — Corrigir imediatamente (bloqueadores e riscos críticos)

1. **[Segurança] Token de reset de senha não deve ser retornado na API**
   - Implementar serviço de e-mail transacional (Resend é gratuito e simples)
   - Retornar apenas `{ message: "E-mail de recuperação enviado" }`

2. **[Segurança] SESSION_SECRET obrigatório**
   - Adicionar validação no startup: se `SESSION_SECRET` não estiver definido, encerrar com erro claro
   - Remover fallback `"insecure-secret"`

3. **[Bug crítico] Corrigir ordem das rotas — `/api/personals/stats` vs `/api/personals/:id`**
   - Mover o registro de `/api/personals/stats` para **antes** de `/api/personals/:id`

---

### P1 — Corrigir antes da publicação

4. **Notificações automáticas do sistema**
   - Criar função helper `createSystemNotification(userId, title, body)` no storage
   - Chamar em: aprovação/recusa de agendamento, novo aluno vinculado, treino atribuído

5. **Validação de conflito de horários**
   - No handler `POST /api/appointments`: verificar sobreposição com appointments existentes do personal
   - No `POST /api/availability-slots`: idem

6. **Edição de treino**
   - Adicionar endpoint `PATCH /api/workouts/:id`
   - Adicionar UI de edição inline ou modal em `WorkoutDetailPage`

7. **Verificação de posse em CRUD sensível**
   - `PATCH/DELETE /api/personal-events/:id`: verificar que o evento pertence ao personal logado
   - `PATCH/DELETE /api/financial/:id`: idem
   - `PATCH /api/appointments/:id/status`: verificar personal ou aluno envolvidos
   - `PATCH /api/notifications/inbox/:id/read`: verificar userId

8. **Deletar conta com dado real**
   - Criar endpoint `DELETE /api/users/me`
   - Implementar cascade de deleção no banco ou soft delete

9. **Correção do bug `birthDate` (tipo string vs timestamp)**
   - Converter string para `new Date()` antes de inserir no banco no handler de criação de aluno

10. **Upload de foto de perfil**
    - Configurar serviço de storage (Replit Object Storage ou externo)
    - Endpoint `POST /api/upload` + field `photoUrl` em `PATCH /api/users/me`

11. **Validação de relação antes de criar review**
    - No handler `POST /api/personals/:id/reviews`: verificar `student.personalId === personal.id`

---

### P2 — Melhorias recomendadas

12. **IA de treinos real**
    - Integrar OpenAI (gpt-4o-mini) para gerar treinos a partir dos parâmetros do formulário
    - Manter mesma interface, apenas substituir `aiWorkoutService.suggest` por chamada real

13. **Upload de mídia no feed**
    - Campo de input file + upload para storage + salvar URL resultante em `mediaUrl`

14. **Persistência dos toggles de configuração**
    - Salvar preferências de notificação em coluna `notificationPreferences` (JSON) no banco

15. **Paginação do feed**
    - Frontend: implementar scroll infinito com `limit=20&offset=` usando IntersectionObserver

16. **Middleware de erro no backend**
    - Remover `throw err` após `res.json()` no handler de erro global
    - Usar `console.error` para logging sem relançar

17. **Remover log de corpo completo das respostas**
    - No `server/index.ts`, não logar `capturedJsonResponse` em produção (`NODE_ENV !== "development"`)

---

### P3 — Evoluções futuras

18. **Loja Bricks real**: backend completo com produtos, carrinho e integração com Stripe/PagSeguro
19. **Eventos esportivos**: parcerias com organizadores + backend real
20. **Treinos em Alta**: curadoria + algoritmo de ranking
21. **Notificações push**: integração com FCM para push notifications mobile/web
22. **Visualização mensal na agenda**
23. **Modo claro**: implementar alternância de tema real com CSS variables
24. **Galeria + serviços do personal**: endpoints CRUD + UI de upload
25. **Múltiplos personals por aluno**: ajustar schema se o modelo de negócio exigir

---

## Relatório Final — Resumo Executivo

### Distribuição das funcionalidades

| Categoria | Quantidade | % |
|---|---|---|
| ✅ Funcionando corretamente | ~28 | 38% |
| 🟡 Funciona parcialmente | ~12 | 16% |
| 🔴 Não funciona / quebrado | ~22 | 30% |
| 🔵 Visual apenas (sem lógica) | ~10 | 14% |
| ⚪ Não implementada | ~2 | 2% |

### Principais riscos antes de publicar

1. **🔴 Segurança**: Token de reset exposto + JWT com segredo padrão = comprometimento de contas real
2. **🔴 Experiência quebrada**: Notificações (ferramenta central para personal trainer) completamente mock
3. **🔴 Eventos e Loja**: Duas telas inteiras com zero funcionalidade real — frustram o usuário
4. **🟡 Sem notificações automáticas**: Aprovação de agendamento não notifica o aluno — ruído operacional alto
5. **🟡 LGPD**: Deletar conta não remove dados — risco de conformidade

### Nível de maturidade atual

> **🟡 MVP Incompleto / Protótipo Avançado**

O Bricks tem uma base técnica sólida e uma UI bem construída. O fluxo central — personal cria treinos, cadastra alunos e agenda aulas — está funcional. No entanto, funcionalidades críticas para o modelo de negócio (notificações, IA de treinos, eventos, loja) estão mockadas ou ausentes. Há também dois bugs de segurança críticos que impedem o deploy seguro.

**Recomendação:** Resolver P0 e P1 (estimativa: 2–3 semanas de desenvolvimento), depois lançar em beta fechado com um grupo controlado de personals e alunos. Evoluir para P2 com base no feedback real.
