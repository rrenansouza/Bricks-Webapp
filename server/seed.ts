import { db } from "./db";
import { users, personalProfiles, reviews, personalServices, personalExperience } from "@shared/schema";
import bcrypt from "bcryptjs";

const personalTrainers = [
  {
    name: "Rafael Santos",
    email: "rafael.santos@bricks.com",
    specialty: "Musculação",
    location: "São Paulo, SP",
    bio: "Personal trainer certificado com 10 anos de experiência. Especialista em ganho de massa muscular e transformação corporal. Já treinei mais de 500 alunos e alcancei resultados incríveis com cada um deles.",
    photoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    hourlyRate: 150,
    experience: 10,
    averageRating: "4.90",
    totalRatings: 47,
    certifications: ["CREF", "NSCA-CPT", "Precision Nutrition"],
    workModality: "both" as const,
  },
  {
    name: "Carolina Mendes",
    email: "carolina.mendes@bricks.com",
    specialty: "Yoga",
    location: "Rio de Janeiro, RJ",
    bio: "Instrutora de Yoga certificada internacionalmente. Especialista em Hatha e Vinyasa Yoga. Ajudo você a encontrar equilíbrio entre corpo e mente através da prática milenar do yoga.",
    photoUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    hourlyRate: 120,
    experience: 8,
    averageRating: "4.95",
    totalRatings: 62,
    certifications: ["Yoga Alliance RYT-500", "Mindfulness Teacher"],
    workModality: "both" as const,
  },
  {
    name: "Bruno Oliveira",
    email: "bruno.oliveira@bricks.com",
    specialty: "Crossfit",
    location: "Curitiba, PR",
    bio: "Coach de CrossFit Level 2 com especialização em programação de treinos de alta intensidade. Participo de competições e ajudo atletas a melhorar seu desempenho.",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    hourlyRate: 180,
    experience: 7,
    averageRating: "4.80",
    totalRatings: 38,
    certifications: ["CrossFit L2", "USAW Sports Performance", "FMS Level 1"],
    workModality: "presencial" as const,
  },
  {
    name: "Amanda Lima",
    email: "amanda.lima@bricks.com",
    specialty: "Pilates",
    location: "São Paulo, SP",
    bio: "Fisioterapeuta e instrutora de Pilates clínico e esportivo. Trabalho com reabilitação e fortalecimento do core utilizando técnicas avançadas de pilates.",
    photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    hourlyRate: 140,
    experience: 12,
    averageRating: "4.92",
    totalRatings: 89,
    certifications: ["CREFITO", "Pilates Authentic", "Stott Pilates"],
    workModality: "both" as const,
  },
  {
    name: "Lucas Ferreira",
    email: "lucas.ferreira@bricks.com",
    specialty: "Funcional",
    location: "Belo Horizonte, MG",
    bio: "Especialista em treinamento funcional e preparação física. Trabalho com atletas amadores e profissionais, focando em performance e prevenção de lesões.",
    photoUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400",
    hourlyRate: 130,
    experience: 6,
    averageRating: "4.75",
    totalRatings: 31,
    certifications: ["CREF", "TRX Certification", "Kettlebell Instructor"],
    workModality: "presencial" as const,
  },
  {
    name: "Juliana Costa",
    email: "juliana.costa@bricks.com",
    specialty: "Musculação",
    location: "Porto Alegre, RS",
    bio: "Personal trainer especializada em emagrecimento e condicionamento feminino. Minha abordagem integra musculação com princípios de nutrição esportiva.",
    photoUrl: "https://images.unsplash.com/photo-1609899517237-7cd8b065bfb9?w=400",
    hourlyRate: 160,
    experience: 9,
    averageRating: "4.88",
    totalRatings: 54,
    certifications: ["CREF", "Precision Nutrition Level 2", "ACSM"],
    workModality: "both" as const,
  },
  {
    name: "Pedro Martins",
    email: "pedro.martins@bricks.com",
    specialty: "Natação",
    location: "Salvador, BA",
    bio: "Ex-atleta profissional de natação, agora dedico minha experiência a ensinar pessoas de todas as idades. Aulas individuais e em grupo em piscina aquecida.",
    photoUrl: "https://images.unsplash.com/photo-1560090995-5e9c5b0e2f9c?w=400",
    hourlyRate: 100,
    experience: 15,
    averageRating: "4.93",
    totalRatings: 76,
    certifications: ["CBDA", "American Swimming Coaches Association", "First Aid"],
    workModality: "presencial" as const,
  },
  {
    name: "Mariana Alves",
    email: "mariana.alves@bricks.com",
    specialty: "Yoga",
    location: "Florianópolis, SC",
    bio: "Instrutora de yoga e meditação. Especialista em yoga terapêutico para ansiedade e estresse. Aulas online e presenciais em ambiente acolhedor e tranquilo.",
    photoUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
    hourlyRate: 110,
    experience: 11,
    averageRating: "4.97",
    totalRatings: 83,
    certifications: ["Yoga Alliance E-RYT 500", "Yoga Therapy", "Meditation Teacher"],
    workModality: "online" as const,
  },
  {
    name: "Thiago Rocha",
    email: "thiago.rocha@bricks.com",
    specialty: "Crossfit",
    location: "Brasília, DF",
    bio: "Coach de CrossFit e especialista em preparação para competições. Metodologia focada em desenvolvimento técnico e progressão segura.",
    photoUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
    hourlyRate: 170,
    experience: 5,
    averageRating: "4.70",
    totalRatings: 28,
    certifications: ["CrossFit L2", "Olympic Lifting Coach", "Mobility WOD"],
    workModality: "presencial" as const,
  },
  {
    name: "Fernanda Souza",
    email: "fernanda.souza@bricks.com",
    specialty: "Pilates",
    location: "Recife, PE",
    bio: "Instrutora de Pilates com formação em fisioterapia. Especialista em pilates para gestantes e pós-parto. Cuido do seu corpo em todas as fases da vida.",
    photoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    hourlyRate: 135,
    experience: 8,
    averageRating: "4.85",
    totalRatings: 45,
    certifications: ["CREFITO", "Pilates for Pregnancy", "Polestar Pilates"],
    workModality: "both" as const,
  },
  {
    name: "Gustavo Nunes",
    email: "gustavo.nunes@bricks.com",
    specialty: "Funcional",
    location: "Campinas, SP",
    bio: "Treinador funcional com foco em emagrecimento e qualidade de vida. Aulas dinâmicas e personalizadas para cada objetivo.",
    photoUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    hourlyRate: 125,
    experience: 4,
    averageRating: "4.65",
    totalRatings: 22,
    certifications: ["CREF", "Functional Training Specialist", "CPR Certified"],
    workModality: "both" as const,
  },
  {
    name: "Isabella Ribeiro",
    email: "isabella.ribeiro@bricks.com",
    specialty: "Musculação",
    location: "Fortaleza, CE",
    bio: "Personal trainer e competidora de fisiculturismo. Especialista em preparação de atletas e transformação corporal para competições.",
    photoUrl: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=400",
    hourlyRate: 200,
    experience: 11,
    averageRating: "4.91",
    totalRatings: 67,
    certifications: ["CREF", "IFBB Pro Card", "Sports Nutrition"],
    workModality: "both" as const,
  },
  {
    name: "Rodrigo Cardoso",
    email: "rodrigo.cardoso@bricks.com",
    specialty: "Natação",
    location: "Goiânia, GO",
    bio: "Professor de natação para iniciantes e atletas. Aulas adaptadas para todas as idades, incluindo hidroginástica para terceira idade.",
    photoUrl: "https://images.unsplash.com/photo-1530138007379-0b13f96c5c86?w=400",
    hourlyRate: 90,
    experience: 13,
    averageRating: "4.82",
    totalRatings: 59,
    certifications: ["CBDA", "Lifeguard Certified", "Adaptive Swimming"],
    workModality: "presencial" as const,
  },
  {
    name: "Camila Teixeira",
    email: "camila.teixeira@bricks.com",
    specialty: "Yoga",
    location: "Vitória, ES",
    bio: "Praticante de yoga há 20 anos, ensino há 10. Especialista em Ashtanga e yoga para atletas. Aulas online com horários flexíveis.",
    photoUrl: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400",
    hourlyRate: 115,
    experience: 10,
    averageRating: "4.94",
    totalRatings: 71,
    certifications: ["Yoga Alliance RYT-500", "Ashtanga Yoga Teacher", "Sports Yoga"],
    workModality: "online" as const,
  },
  {
    name: "Felipe Andrade",
    email: "felipe.andrade@bricks.com",
    specialty: "Crossfit",
    location: "Manaus, AM",
    bio: "Coach de CrossFit e ex-atleta de MMA. Treinos intensos focados em condicionamento físico completo e desenvolvimento de força.",
    photoUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400",
    hourlyRate: 155,
    experience: 6,
    averageRating: "4.78",
    totalRatings: 34,
    certifications: ["CrossFit L2", "MMA Conditioning", "Strength & Conditioning"],
    workModality: "presencial" as const,
  },
  {
    name: "Beatriz Moreira",
    email: "beatriz.moreira@bricks.com",
    specialty: "Pilates",
    location: "São Paulo, SP",
    bio: "Instrutora de Pilates clássico e contemporâneo. Studio próprio com equipamentos completos. Foco em postura e alívio de dores.",
    photoUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400",
    hourlyRate: 180,
    experience: 14,
    averageRating: "4.96",
    totalRatings: 92,
    certifications: ["CREF", "Romana's Pilates", "Balanced Body"],
    workModality: "presencial" as const,
  },
  {
    name: "André Silva",
    email: "andre.silva@bricks.com",
    specialty: "Funcional",
    location: "Rio de Janeiro, RJ",
    bio: "Treinador funcional com experiência em preparação de atletas de elite. Aulas ao ar livre na praia ou em academias parceiras.",
    photoUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400",
    hourlyRate: 145,
    experience: 9,
    averageRating: "4.83",
    totalRatings: 48,
    certifications: ["CREF", "ACE Personal Trainer", "Beach Workout"],
    workModality: "presencial" as const,
  },
  {
    name: "Patrícia Gomes",
    email: "patricia.gomes@bricks.com",
    specialty: "Musculação",
    location: "Curitiba, PR",
    bio: "Personal trainer com especialização em musculação para mulheres acima de 40 anos. Foco em força, saúde óssea e bem-estar.",
    photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    hourlyRate: 140,
    experience: 12,
    averageRating: "4.89",
    totalRatings: 63,
    certifications: ["CREF", "Senior Fitness", "Menopause Exercise Specialist"],
    workModality: "both" as const,
  },
];

const reviewTemplates = [
  { rating: 5, comment: "Excelente profissional! Super recomendo para quem busca resultados." },
  { rating: 5, comment: "Transformou minha vida! Em 6 meses alcancei meus objetivos." },
  { rating: 5, comment: "Muito dedicado e atencioso. As aulas são sempre motivadoras." },
  { rating: 4, comment: "Ótimo profissional, muito competente e pontual." },
  { rating: 5, comment: "O melhor personal que já tive! Vale cada centavo investido." },
  { rating: 4, comment: "Treinos desafiadores mas respeitando meus limites. Recomendo!" },
  { rating: 5, comment: "Atendimento personalizado de verdade. Me sinto muito bem acompanhada." },
  { rating: 5, comment: "Resultados incríveis! Finalmente encontrei um profissional que entende minhas necessidades." },
];

const serviceTemplates = [
  { name: "Consultoria Online", description: "Acompanhamento remoto com treinos personalizados", priceType: "monthly" as const, price: 350 },
  { name: "Aula Individual", description: "Sessão presencial de 1 hora", priceType: "per_session" as const, price: 150 },
  { name: "Pacote Mensal", description: "12 aulas presenciais por mês", priceType: "monthly" as const, price: 1200 },
  { name: "Avaliação Física", description: "Avaliação completa com bioimpedância e medidas", priceType: "per_session" as const, price: 200 },
  { name: "Programa de Emagrecimento", description: "Programa de 3 meses com acompanhamento completo", priceType: "package" as const, price: 2500 },
];

const experienceTemplates = [
  { title: "Personal Trainer", company: "Academia Smart Fit", startYear: 2020, endYear: null, current: true, description: "Treinamento de alunos individuais e em grupo" },
  { title: "Coach de Treino Funcional", company: "CrossFit Box", startYear: 2018, endYear: 2020, current: false, description: "Programação e execução de treinos de alta intensidade" },
  { title: "Preparador Físico", company: "Equipe Esportiva", startYear: 2015, endYear: 2018, current: false, description: "Preparação física de atletas profissionais" },
];

async function seed() {
  console.log("Starting seed process...");

  const hashedPassword = await bcrypt.hash("senha123", 10);

  for (const trainer of personalTrainers) {
    try {
      const [user] = await db.insert(users).values({
        email: trainer.email,
        password: hashedPassword,
        name: trainer.name,
        userType: "personal",
        photoUrl: trainer.photoUrl,
      }).returning();

      console.log(`Created user: ${user.name}`);

      const [profile] = await db.insert(personalProfiles).values({
        userId: user.id,
        specialty: trainer.specialty,
        location: trainer.location,
        bio: trainer.bio,
        hourlyRate: trainer.hourlyRate,
        experience: trainer.experience,
        certifications: trainer.certifications,
        workModality: trainer.workModality,
        averageRating: trainer.averageRating,
        totalRatings: trainer.totalRatings,
        isVerified: true,
      }).returning();

      console.log(`Created profile for: ${user.name}`);

      const numReviews = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numReviews; i++) {
        const review = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const studentNames = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Ferreira", "Julia Lima", "Lucas Mendes", "Beatriz Alves"];
        await db.insert(reviews).values({
          personalId: profile.id,
          studentId: null,
          studentName: studentNames[Math.floor(Math.random() * studentNames.length)],
          rating: review.rating,
          comment: review.comment,
        });
      }

      console.log(`Created reviews for: ${user.name}`);

      const numServices = Math.floor(Math.random() * 3) + 2;
      const shuffledServices = [...serviceTemplates].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numServices; i++) {
        const service = shuffledServices[i];
        await db.insert(personalServices).values({
          personalId: profile.id,
          ...service,
        });
      }

      console.log(`Created services for: ${user.name}`);

      const numExperiences = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < numExperiences; i++) {
        const exp = experienceTemplates[i];
        await db.insert(personalExperience).values({
          personalId: profile.id,
          ...exp,
        });
      }

      console.log(`Created experience for: ${user.name}`);

    } catch (error) {
      console.error(`Error creating trainer ${trainer.name}:`, error);
    }
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
