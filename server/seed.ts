import { db } from "./db";
import { users, personalProfiles, personalExperience, reviews } from "@shared/schema";
import bcrypt from "bcryptjs";

const PASSWORD_HASH = bcrypt.hashSync("123456", 10);

const SPECIALTIES = [
  "Hipertrofia",
  "Emagrecimento", 
  "Funcional",
  "Terceira Idade",
  "Mobilidade",
  "Corrida",
  "Pilates",
  "Musculação"
];

const CITIES = [
  { city: "São Paulo", neighborhoods: ["Jardins", "Pinheiros", "Vila Madalena", "Moema", "Itaim Bibi", "Brooklin", "Morumbi"] },
  { city: "Rio de Janeiro", neighborhoods: ["Copacabana", "Ipanema", "Leblon", "Barra da Tijuca", "Botafogo", "Tijuca", "Recreio"] },
  { city: "Belo Horizonte", neighborhoods: ["Savassi", "Funcionários", "Lourdes", "Santo Agostinho", "Sion", "Buritis"] },
  { city: "Curitiba", neighborhoods: ["Batel", "Centro Cívico", "Água Verde", "Cabral", "Champagnat", "Ecoville"] },
  { city: "Porto Alegre", neighborhoods: ["Moinhos de Vento", "Bela Vista", "Petrópolis", "Menino Deus", "Mont'Serrat"] },
  { city: "Brasília", neighborhoods: ["Asa Sul", "Asa Norte", "Lago Sul", "Sudoeste", "Noroeste", "Park Way"] },
  { city: "Salvador", neighborhoods: ["Ondina", "Barra", "Vitória", "Graça", "Campo Grande", "Pituba"] },
  { city: "Recife", neighborhoods: ["Boa Viagem", "Pina", "Espinheiro", "Parnamirim", "Casa Forte", "Aflitos"] },
];

interface TrainerData {
  name: string;
  isMale: boolean;
  primarySpecialty: string;
  secondarySpecialty: string;
  bio: string;
}

const TRAINERS_BY_SPECIALTY: Record<string, TrainerData[]> = {
  "Hipertrofia": [
    { name: "Lucas Ferreira", isMale: true, primarySpecialty: "Hipertrofia", secondarySpecialty: "Musculação", bio: "Especialista em ganho de massa muscular com metodologia científica. Mais de 500 alunos transformados em 8 anos de carreira." },
    { name: "Gabriel Santos", isMale: true, primarySpecialty: "Hipertrofia", secondarySpecialty: "Funcional", bio: "Atleta de fisiculturismo e personal trainer. Foco em hipertrofia e força com protocolos avançados." },
    { name: "Rafael Costa", isMale: true, primarySpecialty: "Hipertrofia", secondarySpecialty: "Emagrecimento", bio: "Transformo corpos através de treinos personalizados. Nutrição integrada ao treinamento para resultados máximos." },
    { name: "Amanda Silva", isMale: false, primarySpecialty: "Hipertrofia", secondarySpecialty: "Musculação", bio: "Personal trainer focada em hipertrofia feminina. Especialista em desenvolvimento glúteo e membros inferiores." },
    { name: "Thiago Oliveira", isMale: true, primarySpecialty: "Hipertrofia", secondarySpecialty: "Corrida", bio: "Mestre em fisiologia do exercício. Trabalho com protocolos de hipertrofia para atletas e iniciantes." },
  ],
  "Emagrecimento": [
    { name: "Carolina Mendes", isMale: false, primarySpecialty: "Emagrecimento", secondarySpecialty: "Funcional", bio: "Especialista em emagrecimento saudável e definitivo. Método comprovado com mais de 300 casos de sucesso." },
    { name: "Fernanda Lima", isMale: false, primarySpecialty: "Emagrecimento", secondarySpecialty: "Pilates", bio: "Transformação corporal através de treinos eficientes. Acompanhamento nutricional integrado." },
    { name: "Bruno Almeida", isMale: true, primarySpecialty: "Emagrecimento", secondarySpecialty: "Corrida", bio: "Personal trainer com foco em perda de gordura e ganho de massa magra. Resultados reais em 12 semanas." },
    { name: "Juliana Costa", isMale: false, primarySpecialty: "Emagrecimento", secondarySpecialty: "Musculação", bio: "Especializada em emagrecimento para diferentes biotipos. Treinos adaptados à sua rotina." },
    { name: "Pedro Martins", isMale: true, primarySpecialty: "Emagrecimento", secondarySpecialty: "Funcional", bio: "Método exclusivo de emagrecimento com resultados garantidos. Acompanhamento 24h via app." },
  ],
  "Funcional": [
    { name: "Mariana Souza", isMale: false, primarySpecialty: "Funcional", secondarySpecialty: "Mobilidade", bio: "Treinamento funcional para qualidade de vida e performance no dia a dia. Treinos indoor e outdoor." },
    { name: "André Ribeiro", isMale: true, primarySpecialty: "Funcional", secondarySpecialty: "Corrida", bio: "Especialista em treinos funcionais que melhoram postura, mobilidade e força geral." },
    { name: "Patrícia Gomes", isMale: false, primarySpecialty: "Funcional", secondarySpecialty: "Terceira Idade", bio: "Treinos funcionais dinâmicos e desafiadores para todas as idades e níveis." },
    { name: "Rodrigo Nascimento", isMale: true, primarySpecialty: "Funcional", secondarySpecialty: "Emagrecimento", bio: "Funcional training com foco em movimentos naturais do corpo humano." },
    { name: "Letícia Carvalho", isMale: false, primarySpecialty: "Funcional", secondarySpecialty: "Hipertrofia", bio: "Personal de funcional com certificação internacional. Especialista em treinos ao ar livre." },
  ],
  "Terceira Idade": [
    { name: "Maria Helena", isMale: false, primarySpecialty: "Terceira Idade", secondarySpecialty: "Mobilidade", bio: "Especialista em treinamento para terceira idade com 15 anos de experiência. Segurança em primeiro lugar." },
    { name: "Carlos Eduardo", isMale: true, primarySpecialty: "Terceira Idade", secondarySpecialty: "Funcional", bio: "Treinos adaptados para idosos visando autonomia e qualidade de vida. Gerontologia aplicada." },
    { name: "Sandra Oliveira", isMale: false, primarySpecialty: "Terceira Idade", secondarySpecialty: "Pilates", bio: "Personal trainer com especialização em gerontologia. Treinos seguros e motivadores." },
    { name: "Roberto Santos", isMale: true, primarySpecialty: "Terceira Idade", secondarySpecialty: "Mobilidade", bio: "Experiência de 20 anos com público 60+. Foco em prevenção de quedas e manutenção da independência." },
    { name: "Vera Lúcia", isMale: false, primarySpecialty: "Terceira Idade", secondarySpecialty: "Funcional", bio: "Especializada em exercícios para manutenção cognitiva e física na terceira idade." },
  ],
  "Mobilidade": [
    { name: "Priscila Araújo", isMale: false, primarySpecialty: "Mobilidade", secondarySpecialty: "Pilates", bio: "Especialista em mobilidade articular e flexibilidade. Formação em yoga e pilates." },
    { name: "Felipe Teixeira", isMale: true, primarySpecialty: "Mobilidade", secondarySpecialty: "Funcional", bio: "Treinos focados em amplitude de movimento e correção postural. Fisioterapeuta e personal." },
    { name: "Camila Barbosa", isMale: false, primarySpecialty: "Mobilidade", secondarySpecialty: "Terceira Idade", bio: "Personal de mobilidade para todas as idades. Corpo livre de dores e restrições." },
    { name: "Diego Moreira", isMale: true, primarySpecialty: "Mobilidade", secondarySpecialty: "Corrida", bio: "Especializado em reabilitação e ganho de mobilidade para atletas e sedentários." },
    { name: "Natália Dias", isMale: false, primarySpecialty: "Mobilidade", secondarySpecialty: "Hipertrofia", bio: "Método de mobilidade que transforma sua qualidade de movimento e previne lesões." },
  ],
  "Corrida": [
    { name: "Marcelo Castro", isMale: true, primarySpecialty: "Corrida", secondarySpecialty: "Funcional", bio: "Treinador de corrida para iniciantes e maratonistas. Assessoria completa com planilhas personalizadas." },
    { name: "Renata Vieira", isMale: false, primarySpecialty: "Corrida", secondarySpecialty: "Emagrecimento", bio: "Especialista em treinos de corrida com periodização científica. Ex-atleta profissional." },
    { name: "Gustavo Nunes", isMale: true, primarySpecialty: "Corrida", secondarySpecialty: "Mobilidade", bio: "Coach de running com experiência em provas de 5k a ultramaratonas. Foco em performance." },
    { name: "Isabela Freitas", isMale: false, primarySpecialty: "Corrida", secondarySpecialty: "Funcional", bio: "Personal trainer de corrida focada em prevenção de lesões e melhora de performance." },
    { name: "Leonardo Cardoso", isMale: true, primarySpecialty: "Corrida", secondarySpecialty: "Hipertrofia", bio: "Assessoria de corrida personalizada. Do primeiro km à sua melhor marca pessoal." },
  ],
  "Pilates": [
    { name: "Beatriz Moreira", isMale: false, primarySpecialty: "Pilates", secondarySpecialty: "Mobilidade", bio: "Instrutora de pilates clássico e contemporâneo. Studio próprio com equipamentos completos." },
    { name: "Daniela Rocha", isMale: false, primarySpecialty: "Pilates", secondarySpecialty: "Terceira Idade", bio: "Especialista em pilates terapêutico para reabilitação e prevenção. Fisioterapeuta." },
    { name: "Tatiane Alves", isMale: false, primarySpecialty: "Pilates", secondarySpecialty: "Funcional", bio: "Pilates personalizado para todas as idades e objetivos. Método Joseph Pilates." },
    { name: "Vanessa Correia", isMale: false, primarySpecialty: "Pilates", secondarySpecialty: "Emagrecimento", bio: "Personal de pilates com formação internacional. Foco em core e postura." },
    { name: "Aline Nascimento", isMale: false, primarySpecialty: "Pilates", secondarySpecialty: "Hipertrofia", bio: "Pilates para fortalecimento do core e melhora postural. Atendimento em domicílio." },
  ],
  "Musculação": [
    { name: "Ricardo Pereira", isMale: true, primarySpecialty: "Musculação", secondarySpecialty: "Hipertrofia", bio: "Personal trainer de musculação com metodologia própria. Mais de 10 anos de experiência." },
    { name: "Matheus Souza", isMale: true, primarySpecialty: "Musculação", secondarySpecialty: "Emagrecimento", bio: "Especialista em musculação para todos os níveis. Técnica perfeita e progressão gradual." },
    { name: "Henrique Lima", isMale: true, primarySpecialty: "Musculação", secondarySpecialty: "Funcional", bio: "Treinos de musculação personalizados com técnicas avançadas. Atleta e coach." },
    { name: "Sabrina Castro", isMale: false, primarySpecialty: "Musculação", secondarySpecialty: "Pilates", bio: "Personal de musculação feminina. Especialista em glúteos e definição muscular." },
    { name: "Vinícius Gomes", isMale: true, primarySpecialty: "Musculação", secondarySpecialty: "Corrida", bio: "Musculação científica com periodização e ajustes constantes. Resultados garantidos." },
  ],
};

const EXPERIENCE_TITLES = [
  "Personal Trainer",
  "Coordenador de Academia",
  "Preparador Físico",
  "Instrutor de Musculação",
  "Coach de Alta Performance",
  "Supervisor Técnico"
];

const COMPANIES = [
  "Smart Fit", "Bodytech", "Bio Ritmo", "Cia Athletica", "Bluefit",
  "Fórmula Academia", "Selfit", "Runner Academia", "Alpha Fitness",
  "Studio Personal", "CrossFit Box", "Studio Pilates", "Wellness Center"
];

function generateCREF(): string {
  const region = Math.floor(Math.random() * 22) + 1;
  const number = Math.floor(Math.random() * 900000) + 100000;
  const suffix = ["G", "P"][Math.floor(Math.random() * 2)];
  const states = ["SP", "RJ", "MG", "PR", "RS", "DF", "BA", "PE"];
  const state = states[Math.floor(Math.random() * states.length)];
  return `${String(region).padStart(3, "0")}.${number}-${suffix}/${state}`;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomRating(): string {
  const ratings = [4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  return ratings[Math.floor(Math.random() * ratings.length)].toFixed(2);
}

function getRandomPrice(): string {
  const prices = [80, 100, 120, 150, 180, 200, 250, 300];
  return prices[Math.floor(Math.random() * prices.length)].toFixed(2);
}

async function seed() {
  console.log("Iniciando seed do banco de dados...\n");
  
  let personalCount = 0;
  let photoIndexMen = 1;
  let photoIndexWomen = 1;
  
  for (const specialty of SPECIALTIES) {
    const trainers = TRAINERS_BY_SPECIALTY[specialty];
    console.log(`\nCriando personais de ${specialty}...`);
    
    for (const trainer of trainers) {
      const photoGender = trainer.isMale ? "men" : "women";
      const photoIndex = trainer.isMale ? photoIndexMen++ : photoIndexWomen++;
      const photoUrl = `https://randomuser.me/api/portraits/${photoGender}/${photoIndex}.jpg`;
      
      const cityData = CITIES[Math.floor(Math.random() * CITIES.length)];
      const neighborhood = cityData.neighborhoods[Math.floor(Math.random() * cityData.neighborhoods.length)];
      const regions = getRandomItems(cityData.neighborhoods, Math.floor(Math.random() * 3) + 2);
      
      const email = `${trainer.name.toLowerCase().replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@bricks.com`;
      
      const yearsExperience = Math.floor(Math.random() * 12) + 3;
      const totalRatings = Math.floor(Math.random() * 120) + 15;
      
      try {
        const [user] = await db.insert(users).values({
          name: trainer.name,
          email,
          password: PASSWORD_HASH,
          userType: "personal",
          photoUrl,
        }).returning();
        
        const [profile] = await db.insert(personalProfiles).values({
          userId: user.id,
          bio: trainer.bio,
          specialties: [trainer.primarySpecialty, trainer.secondarySpecialty],
          city: cityData.city,
          neighborhood,
          cref: generateCREF(),
          regions,
          averagePrice: getRandomPrice(),
          averageRating: getRandomRating(),
          totalRatings,
        }).returning();
        
        const startYear = new Date().getFullYear() - yearsExperience;
        await db.insert(personalExperience).values({
          personalId: profile.id,
          title: EXPERIENCE_TITLES[Math.floor(Math.random() * EXPERIENCE_TITLES.length)],
          company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
          description: `Atuação como personal trainer com foco em ${trainer.primarySpecialty.toLowerCase()} e ${trainer.secondarySpecialty.toLowerCase()}.`,
          startYear,
          isCurrent: true,
        });
        
        if (yearsExperience > 5) {
          await db.insert(personalExperience).values({
            personalId: profile.id,
            title: EXPERIENCE_TITLES[Math.floor(Math.random() * EXPERIENCE_TITLES.length)],
            company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
            description: `Desenvolvimento de programas de treinamento personalizados.`,
            startYear: startYear - 3,
            endYear: startYear,
            isCurrent: false,
          });
        }
        
        const reviewCount = Math.min(totalRatings, Math.floor(Math.random() * 4) + 2);
        const reviewerNames = [
          "Maria Silva", "João Santos", "Ana Oliveira", "Carlos Lima", 
          "Paula Costa", "Pedro Ferreira", "Juliana Alves", "Fernando Rocha",
          "Carla Mendes", "Lucas Araújo"
        ];
        const reviewComments = [
          "Excelente profissional! Super recomendo para quem busca resultados.",
          "Muito dedicado e atencioso. Os treinos são sempre motivadores.",
          "O melhor personal que já tive. Resultados incríveis em pouco tempo!",
          "Treinos desafiadores mas respeitando meus limites. Top demais!",
          "Profissional exemplar, sempre pontual e muito bem preparado.",
          "Transformou minha vida! Em 4 meses alcancei meus objetivos.",
          "Atendimento personalizado de verdade. Me sinto muito bem acompanhada.",
          "Finalmente encontrei um profissional que entende minhas necessidades."
        ];
        
        for (let r = 0; r < reviewCount; r++) {
          await db.insert(reviews).values({
            personalId: profile.id,
            studentName: reviewerNames[r % reviewerNames.length],
            rating: Math.floor(Math.random() * 2) + 4,
            comment: reviewComments[r % reviewComments.length],
          });
        }
        
        personalCount++;
        console.log(`  [${personalCount}] ${trainer.name} - ${cityData.city}`);
        
      } catch (error) {
        console.error(`Erro ao criar ${trainer.name}:`, error);
      }
    }
  }
  
  console.log(`\n========================================`);
  console.log(`Seed concluído! ${personalCount} personal trainers criados.`);
  console.log(`========================================\n`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed falhou:", error);
    process.exit(1);
  });
