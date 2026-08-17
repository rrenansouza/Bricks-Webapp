/**
 * Seed script — BRK-079
 * Cria 10 personal trainers + 10 alunos com e-mail @brickstest.com e senha "Teste@123".
 * Idempotente: verifica por e-mail antes de inserir.
 * Execução: npm run seed
 */

import { db } from "./db";
import { users, personalProfiles, students } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const PASSWORD = "Teste@123";

// ── Personal trainers ────────────────────────────────────────────────────────

const PERSONALS = [
  {
    name: "Rafael Andrade",
    email: "rafael.andrade@brickstest.com",
    specialties: ["Hipertrofia", "Musculação"],
    city: "São Paulo",
    state: "SP",
    phone: "(11) 91234-0001",
    yearsExperience: 8,
    averagePrice: "120.00",
    cref: "001.234-G/SP",
    bio: "Especialista em hipertrofia e musculação com 8 anos de experiência. Atua com metodologia baseada em periodização científica para maximizar ganho de massa magra. Atende em São Paulo e região.",
  },
  {
    name: "Camila Torres",
    email: "camila.torres@brickstest.com",
    specialties: ["Emagrecimento", "Nutrição Esportiva"],
    city: "Rio de Janeiro",
    state: "RJ",
    phone: "(21) 91234-0002",
    yearsExperience: 6,
    averagePrice: "100.00",
    cref: "002.345-G/RJ",
    bio: "Personal trainer especializada em emagrecimento e nutrição esportiva. Combina treinos de alta intensidade com orientação alimentar personalizada para resultados duradouros. 6 anos de atuação no Rio de Janeiro.",
  },
  {
    name: "Bruno Ferreira",
    email: "bruno.ferreira@brickstest.com",
    specialties: ["Corrida", "Performance Esportiva"],
    city: "Belo Horizonte",
    state: "MG",
    phone: "(31) 91234-0003",
    yearsExperience: 10,
    averagePrice: "110.00",
    cref: "003.456-G/MG",
    bio: "Coach de corrida e performance esportiva com 10 anos de experiência. Desenvolve planilhas personalizadas para provas de 5 km a ultramaratonas. Ex-atleta federado.",
  },
  {
    name: "Juliana Martins",
    email: "juliana.martins@brickstest.com",
    specialties: ["Treinamento Funcional"],
    city: "Curitiba",
    state: "PR",
    phone: "(41) 91234-0004",
    yearsExperience: 5,
    averagePrice: "90.00",
    cref: "004.567-G/PR",
    bio: "Personal trainer focada em treinamento funcional com 5 anos de prática. Treinos dinâmicos que melhoram postura, mobilidade e força para o dia a dia. Atendimento indoor e outdoor.",
  },
  {
    name: "Diego Souza",
    email: "diego.souza@brickstest.com",
    specialties: ["Crossfit", "Alta Intensidade"],
    city: "Porto Alegre",
    state: "RS",
    phone: "(51) 91234-0005",
    yearsExperience: 7,
    averagePrice: "130.00",
    cref: "005.678-G/RS",
    bio: "Coach de Crossfit e treinos de alta intensidade com 7 anos de experiência. Certificado Level 2 CrossFit. Foco em desenvolvimento de força, potência e capacidade cardiovascular.",
  },
  {
    name: "Patrícia Lima",
    email: "patricia.lima@brickstest.com",
    specialties: ["Pilates", "Mobilidade"],
    city: "São Paulo",
    state: "SP",
    phone: "(11) 91234-0006",
    yearsExperience: 12,
    averagePrice: "150.00",
    cref: "006.789-G/SP",
    bio: "Instrutora de Pilates clássico e contemporâneo com 12 anos de atuação. Especialista em mobilidade articular e reequilíbrio muscular. Studio próprio com aparelhos completos em São Paulo.",
  },
  {
    name: "Marcos Vinícius",
    email: "marcos.vinicius@brickstest.com",
    specialties: ["Reabilitação", "Fisioterapia Esportiva"],
    city: "Salvador",
    state: "BA",
    phone: "(71) 91234-0007",
    yearsExperience: 15,
    averagePrice: "140.00",
    cref: "007.890-G/BA",
    bio: "Fisioterapeuta esportivo e personal trainer com 15 anos de experiência em reabilitação. Atua com recuperação pós-cirúrgica, lesões musculares e retorno ao esporte. Referência em Salvador.",
  },
  {
    name: "Fernanda Costa",
    email: "fernanda.costa@brickstest.com",
    specialties: ["Terceira Idade"],
    city: "Brasília",
    state: "DF",
    phone: "(61) 91234-0008",
    yearsExperience: 9,
    averagePrice: "100.00",
    cref: "008.901-G/DF",
    bio: "Personal trainer especializada em treinamento para a terceira idade com pós-graduação em gerontologia. Treinos seguros e motivadores que preservam autonomia e qualidade de vida.",
  },
  {
    name: "Gustavo Ramos",
    email: "gustavo.ramos@brickstest.com",
    specialties: ["Gestantes", "Pós-parto"],
    city: "Campinas",
    state: "SP",
    phone: "(19) 91234-0009",
    yearsExperience: 7,
    averagePrice: "120.00",
    cref: "009.012-G/SP",
    bio: "Especialista em treinamento para gestantes e retorno pós-parto com 7 anos de atuação. Formação em obstetrícia aplicada ao exercício. Treinos seguros e adaptados a cada trimestre e fase.",
  },
  {
    name: "Larissa Almeida",
    email: "larissa.almeida@brickstest.com",
    specialties: ["Treinamento Infantil", "Adolescentes"],
    city: "Florianópolis",
    state: "SC",
    phone: "(48) 91234-0010",
    yearsExperience: 6,
    averagePrice: "90.00",
    cref: "010.123-G/SC",
    bio: "Personal trainer especializada em treinamento infantil e para adolescentes com 6 anos de experiência. Foco em desenvolvimento motor, hábitos saudáveis e prevenção de sedentarismo desde cedo.",
  },
];

// ── Alunos ───────────────────────────────────────────────────────────────────

const STUDENTS_DATA = [
  {
    name: "Ana Beatriz Souza",
    email: "ana.beatriz.souza@brickstest.com",
    goals: "Emagrecimento",
    age: 29,
    city: "São Paulo",
    state: "SP",
    // vinculada a: Camila Torres (emagrecimento)
    personalEmail: "camila.torres@brickstest.com",
  },
  {
    name: "Pedro Henrique Lima",
    email: "pedro.henrique.lima@brickstest.com",
    goals: "Hipertrofia",
    age: 24,
    city: "Rio de Janeiro",
    state: "RJ",
    // vinculado a: Rafael Andrade (hipertrofia)
    personalEmail: "rafael.andrade@brickstest.com",
  },
  {
    name: "Mariana Rocha",
    email: "mariana.rocha@brickstest.com",
    goals: "Condicionamento geral",
    age: 35,
    city: "Belo Horizonte",
    state: "MG",
    // vinculada a: Juliana Martins (funcional)
    personalEmail: "juliana.martins@brickstest.com",
  },
  {
    name: "Carlos Eduardo Nunes",
    email: "carlos.eduardo.nunes@brickstest.com",
    goals: "Preparação para maratona",
    age: 41,
    city: "Curitiba",
    state: "PR",
    // vinculado a: Bruno Ferreira (corrida)
    personalEmail: "bruno.ferreira@brickstest.com",
  },
  {
    name: "Beatriz Fernandes",
    email: "beatriz.fernandes@brickstest.com",
    goals: "Crossfit / Alta performance",
    age: 27,
    city: "Porto Alegre",
    state: "RS",
    // vinculada a: Diego Souza (crossfit)
    personalEmail: "diego.souza@brickstest.com",
  },
  {
    name: "José Roberto Silva",
    email: "jose.roberto.silva@brickstest.com",
    goals: "Reabilitação pós-lesão de joelho",
    age: 52,
    city: "Salvador",
    state: "BA",
    // vinculado a: Marcos Vinícius (reabilitação) — match semântico explícito
    personalEmail: "marcos.vinicius@brickstest.com",
  },
  {
    name: "Helena Martins",
    email: "helena.martins@brickstest.com",
    goals: "Terceira idade / Mobilidade",
    age: 67,
    city: "Brasília",
    state: "DF",
    // vinculada a: Fernanda Costa (terceira idade)
    personalEmail: "fernanda.costa@brickstest.com",
  },
  {
    name: "Rodrigo Alves",
    email: "rodrigo.alves@brickstest.com",
    goals: "Ganho de força",
    age: 31,
    city: "Campinas",
    state: "SP",
    // vinculado a: Rafael Andrade (musculação/força) — 2 alunos neste personal
    personalEmail: "rafael.andrade@brickstest.com",
  },
  {
    name: "Camila Duarte",
    email: "camila.duarte@brickstest.com",
    goals: "Pós-parto / Retorno ao treino",
    age: 33,
    city: "Florianópolis",
    state: "SC",
    // vinculada a: Gustavo Ramos (pós-parto)
    personalEmail: "gustavo.ramos@brickstest.com",
  },
  {
    name: "Lucas Gabriel Pereira",
    email: "lucas.gabriel.pereira@brickstest.com",
    goals: "Iniciante sedentário — condicionamento básico",
    age: 22,
    city: "São Paulo",
    state: "SP",
    // vinculado a: Patrícia Lima (mobilidade/funcional para iniciantes)
    personalEmail: "patricia.lima@brickstest.com",
  },
];

// ── Helper ───────────────────────────────────────────────────────────────────

async function upsertUser(email: string, name: string, userType: "personal" | "student", hashedPw: string) {
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return { user: existing, created: false };
  const [created] = await db.insert(users).values({ name, email, password: hashedPw, userType }).returning();
  return { user: created, created: true };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("\n🌱  Iniciando seed BRK-079...\n");

  const hashedPw = await bcrypt.hash(PASSWORD, 10);

  // ── Passo A: Personal trainers ──────────────────────────────────────────
  const personalProfileMap: Record<string, { profileId: string; data: typeof PERSONALS[0] }> = {};

  for (const p of PERSONALS) {
    const { user, created } = await upsertUser(p.email, p.name, "personal", hashedPw);

    // Verifica se perfil já existe
    const [existingProfile] = await db.select().from(personalProfiles).where(eq(personalProfiles.userId, user.id));

    let profileId: string;
    if (existingProfile) {
      profileId = existingProfile.id;
    } else {
      const [profile] = await db.insert(personalProfiles).values({
        userId: user.id,
        bio: p.bio,
        specialties: p.specialties,
        city: p.city,
        cref: p.cref,
        averagePrice: p.averagePrice,
        averageRating: "4.80",
        totalRatings: Math.floor(Math.random() * 50) + 10,
      }).returning();
      profileId = profile.id;
    }

    personalProfileMap[p.email] = { profileId, data: p };
    console.log(`  ${created ? "✅ criado" : "⏭  já existe"} — Personal: ${p.name} <${p.email}>`);
  }

  // ── Passo B: Alunos ─────────────────────────────────────────────────────
  const studentRows: Array<{
    name: string; role: string; email: string; senha: string;
    especialidadeOuObjetivo: string; cidade: string;
  }> = [];

  for (const s of STUDENTS_DATA) {
    const { user, created } = await upsertUser(s.email, s.name, "student", hashedPw);

    const personalEntry = personalProfileMap[s.personalEmail];
    const profileId = personalEntry?.profileId;

    // Verifica se registro de aluno já existe
    const [existingStudent] = await db.select().from(students).where(eq(students.userId, user.id));

    if (!existingStudent) {
      await db.insert(students).values({
        userId: user.id,
        personalId: profileId ?? null,
        goals: s.goals,
        age: s.age,
        city: s.city,
        state: s.state,
        registrationStatus: "approved",
        studentStatus: "training",
      });
    } else if (existingStudent.personalId !== profileId) {
      // Atualiza vínculo se mudou
      await db.update(students).set({ personalId: profileId ?? null }).where(eq(students.id, existingStudent.id));
    }

    console.log(`  ${created ? "✅ criado" : "⏭  já existe"} — Aluno:   ${s.name} <${s.email}>`);
  }

  // ── Tabela de credenciais ────────────────────────────────────────────────
  console.log("\n");
  console.log("═".repeat(120));
  console.log("  TABELA DE CREDENCIAIS — 20 usuários do seed BRK-079");
  console.log("═".repeat(120));

  const header = ["Nome", "Papel", "E-mail", "Senha", "Especialidade / Objetivo", "Cidade"];
  const rows: string[][] = [];

  for (const p of PERSONALS) {
    rows.push([p.name, "Personal", p.email, PASSWORD, p.specialties.join(", "), `${p.city}, ${p.state}`]);
  }
  for (const s of STUDENTS_DATA) {
    rows.push([s.name, "Aluno", s.email, PASSWORD, s.goals, `${s.city}, ${s.state}`]);
  }

  // Calcula largura de cada coluna
  const colWidths = header.map((h, i) =>
    Math.max(h.length, ...rows.map(r => r[i]?.length ?? 0))
  );

  const fmt = (row: string[]) =>
    "  " + row.map((cell, i) => cell.padEnd(colWidths[i])).join("  │  ");

  console.log(fmt(header));
  console.log("  " + colWidths.map(w => "─".repeat(w)).join("──┼──"));
  rows.forEach(r => console.log(fmt(r)));
  console.log("═".repeat(120));
  console.log(`\n✅  Seed concluído! 10 personal trainers + 10 alunos prontos.\n`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌  Seed falhou:", err);
    process.exit(1);
  });
