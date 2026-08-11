---
name: PATCH validation allowlists
description: Regra para validar atualizações parciais sem permitir alteração de identidade ou ownership.
---

Schemas de PATCH devem ser derivados dos insert schemas com uma allowlist explícita via `pick(...).partial()` sempre que possível. Campos como `id`, timestamps de criação, `userId`, `personalId`, `studentId` e outras chaves de relacionamento não devem chegar ao update.

**Why:** Usar apenas `.partial()` deixa campos de identidade editáveis; usar apenas `.omit()` pode permitir que novos campos adicionados ao insert schema sejam aceitos sem revisão. No Zod, campos desconhecidos são removidos por padrão, então uma allowlist também permite ignorar tentativas protegidas sem alterar o dono do recurso.

**How to apply:** Para PATCHs de perfil, use `pick` somente nos campos editáveis. Para PATCHs de ação sem payload, use um objeto estrito vazio. Normalize strings de data para `Date` antes do parse quando o cliente envia JSON.