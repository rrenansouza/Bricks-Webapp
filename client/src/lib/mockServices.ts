import type { BricksNotification, BricksEvent, BricksProduct, AIWorkoutSuggestion, Workout, WorkoutExercise } from "@shared/schema";

// Mock data for workouts
export const mockTrendingWorkouts: (Workout & { exercises: WorkoutExercise[], personalName?: string })[] = [
  {
    id: "trend-1",
    name: "Full Body HIIT Intenso",
    objective: "weight_loss",
    level: "advanced",
    description: "Treino HIIT completo para queima maxima de gordura",
    frequency: "3x por semana",
    duration: 45,
    tags: ["HIIT", "Full Body", "Cardio"],
    isPreset: true,
    isTrending: true,
    usageCount: 156,
    studentCount: 89,
    rating: "4.8",
    personalId: "p1",
    createdAt: new Date(),
    personalName: "Carlos Fitness",
    exercises: [
      { id: "e1", workoutId: "trend-1", exerciseName: "Burpees", muscleGroup: "Full Body", equipment: "Peso corporal", sets: 4, reps: 12, restTimeSeconds: 30, orderIndex: 0, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
      { id: "e2", workoutId: "trend-1", exerciseName: "Mountain Climbers", muscleGroup: "Core", equipment: "Peso corporal", sets: 4, timeInSeconds: 45, restTimeSeconds: 20, orderIndex: 1, videoUrl: null, weight: null, reps: null, observations: null },
      { id: "e3", workoutId: "trend-1", exerciseName: "Jump Squats", muscleGroup: "Pernas", equipment: "Peso corporal", sets: 4, reps: 15, restTimeSeconds: 30, orderIndex: 2, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
    ],
  },
  {
    id: "trend-2",
    name: "Hipertrofia - Peito e Triceps",
    objective: "hypertrophy",
    level: "intermediate",
    description: "Treino focado em ganho de massa muscular para peito e triceps",
    frequency: "2x por semana",
    duration: 60,
    tags: ["Hipertrofia", "Upper Body", "Push"],
    isPreset: true,
    isTrending: true,
    usageCount: 234,
    studentCount: 145,
    rating: "4.9",
    personalId: "p2",
    createdAt: new Date(),
    personalName: "Amanda Strong",
    exercises: [
      { id: "e4", workoutId: "trend-2", exerciseName: "Supino Reto", muscleGroup: "Peito", equipment: "Barra", sets: 4, reps: 10, weight: "70", restTimeSeconds: 90, orderIndex: 0, videoUrl: null, timeInSeconds: null, observations: null },
      { id: "e5", workoutId: "trend-2", exerciseName: "Supino Inclinado", muscleGroup: "Peito", equipment: "Halter", sets: 4, reps: 12, weight: "24", restTimeSeconds: 75, orderIndex: 1, videoUrl: null, timeInSeconds: null, observations: null },
      { id: "e6", workoutId: "trend-2", exerciseName: "Triceps Pulley", muscleGroup: "Triceps", equipment: "Maquina", sets: 3, reps: 15, restTimeSeconds: 60, orderIndex: 2, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
    ],
  },
  {
    id: "trend-3",
    name: "Treino ABC Iniciantes",
    objective: "conditioning",
    level: "beginner",
    description: "Divisao ABC perfeita para quem esta comecando",
    frequency: "3x por semana",
    duration: 50,
    tags: ["ABC", "Iniciantes", "Full Body"],
    isPreset: true,
    isTrending: true,
    usageCount: 312,
    studentCount: 201,
    rating: "4.7",
    personalId: "p3",
    createdAt: new Date(),
    personalName: "Pedro Coach",
    exercises: [
      { id: "e7", workoutId: "trend-3", exerciseName: "Agachamento Livre", muscleGroup: "Pernas", equipment: "Peso corporal", sets: 3, reps: 15, restTimeSeconds: 60, orderIndex: 0, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
      { id: "e8", workoutId: "trend-3", exerciseName: "Flexao de Bracos", muscleGroup: "Peito", equipment: "Peso corporal", sets: 3, reps: 10, restTimeSeconds: 60, orderIndex: 1, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
    ],
  },
  {
    id: "trend-4",
    name: "Core Power",
    objective: "strength",
    level: "intermediate",
    description: "Fortalecimento completo do core e abdomen",
    frequency: "4x por semana",
    duration: 30,
    tags: ["Core", "Abdomen", "Funcional"],
    isPreset: true,
    isTrending: true,
    usageCount: 178,
    studentCount: 98,
    rating: "4.6",
    personalId: "p4",
    createdAt: new Date(),
    personalName: "Julia Trainer",
    exercises: [
      { id: "e9", workoutId: "trend-4", exerciseName: "Prancha", muscleGroup: "Core", equipment: "Peso corporal", sets: 4, timeInSeconds: 60, restTimeSeconds: 30, orderIndex: 0, videoUrl: null, weight: null, reps: null, observations: null },
      { id: "e10", workoutId: "trend-4", exerciseName: "Russian Twist", muscleGroup: "Obliquos", equipment: "Peso corporal", sets: 3, reps: 20, restTimeSeconds: 30, orderIndex: 1, videoUrl: null, weight: null, timeInSeconds: null, observations: null },
    ],
  },
];

// Mock notifications
let mockNotifications: BricksNotification[] = [
  {
    id: "n1",
    type: "immediate",
    title: "Lembrete de treino",
    message: "Nao esqueca do seu treino de hoje!",
    recipientType: "group",
    recipientGroup: "all_active",
    channel: "in_app",
    status: "sent",
    createdAt: new Date(Date.now() - 3600000),
    sentAt: new Date(Date.now() - 3600000),
  },
  {
    id: "n2",
    type: "scheduled",
    title: "Avaliacao fisica",
    message: "Sua avaliacao fisica esta marcada para amanha!",
    recipientType: "student",
    recipientId: "s1",
    channel: "whatsapp",
    status: "pending",
    scheduledAt: new Date(Date.now() + 86400000),
    createdAt: new Date(),
  },
];

let mockRecurringNotifications: BricksNotification[] = [
  {
    id: "rn1",
    type: "recurring",
    title: "Motivacao diaria",
    message: "Bom dia! Vamos treinar?",
    recipientType: "group",
    recipientGroup: "all_active",
    channel: "in_app",
    status: "sent",
    recurringFrequency: "daily",
    recurringTime: "07:00",
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: "rn2",
    type: "recurring",
    title: "Resumo semanal",
    message: "Confira seu progresso da semana!",
    recipientType: "group",
    recipientGroup: "all_active",
    channel: "email",
    status: "sent",
    recurringFrequency: "weekly",
    recurringDays: [1],
    recurringTime: "09:00",
    createdAt: new Date(Date.now() - 30 * 86400000),
  },
];

// Mock events
export const mockEvents: BricksEvent[] = [
  {
    id: "ev1",
    name: "Bricks Run - 5k & 10k",
    description: "Corrida oficial Bricks no Parque Ibirapuera. Kit completo incluso com camiseta, numero e medalha.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    date: new Date("2025-02-15"),
    city: "Sao Paulo",
    location: "Parque Ibirapuera",
    distance: "5k / 10k",
    eventType: "Corrida de rua",
    categories: ["5k", "10k"],
    normalPrice: 120,
    bricksPrice: 89,
    hasBricksDiscount: true,
    benefits: ["Kit exclusivo", "Area VIP", "Medalha especial Bricks"],
  },
  {
    id: "ev2",
    name: "Desafio Serra Trail Run",
    description: "Trilha desafiadora nas montanhas de Florianopolis com paisagens incriveis.",
    imageUrl: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
    date: new Date("2025-03-20"),
    city: "Florianopolis",
    location: "Morro da Lagoa",
    distance: "15k",
    eventType: "Trail Run",
    categories: ["15k", "21k"],
    normalPrice: 220,
    bricksPrice: 179,
    hasBricksDiscount: true,
    benefits: ["Transporte incluso", "Kit trail"],
  },
  {
    id: "ev3",
    name: "Workshop Performance - Treinamento Funcional",
    description: "Workshop pratico com os melhores treinadores do Brasil. Certificado incluso.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    date: new Date("2025-04-10"),
    city: "Belo Horizonte",
    location: "Centro de Convencoes",
    eventType: "Workshop",
    categories: ["Presencial"],
    normalPrice: 190,
    bricksPrice: 150,
    hasBricksDiscount: true,
    benefits: ["Certificado", "Material didatico", "Coffee break"],
  },
  {
    id: "ev4",
    name: "Triathlon Experience",
    description: "Experimente o triathlon em um ambiente seguro e com todo suporte tecnico.",
    imageUrl: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
    date: new Date("2025-05-05"),
    city: "Rio de Janeiro",
    location: "Praia de Copacabana",
    eventType: "Triathlon",
    categories: ["Sprint", "Olimpico"],
    normalPrice: 350,
    bricksPrice: 310,
    hasBricksDiscount: true,
    benefits: ["Area de transicao exclusiva", "Suporte tecnico"],
  },
  {
    id: "ev5",
    name: "Night Run Curitiba - Edicao Neon",
    description: "Corrida noturna com tema neon. Muita musica e diversao!",
    imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    date: new Date("2025-06-21"),
    city: "Curitiba",
    location: "Parque Barigui",
    distance: "5k",
    eventType: "Night Run",
    categories: ["5k"],
    normalPrice: 140,
    bricksPrice: 110,
    hasBricksDiscount: true,
    benefits: ["Kit neon", "After party"],
  },
];

// Mock products
export const mockProducts: BricksProduct[] = [
  {
    id: "prod1",
    name: "Whey Protein Bricks - Baunilha",
    brand: "Bricks Nutrition",
    description: "Whey protein de alta qualidade com 25g de proteina por dose. Sabor baunilha natural.",
    imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c1e1e4e9b?w=800",
    images: [],
    category: "Suplementos",
    normalPrice: 169,
    bricksPrice: 149,
    hasBricksDiscount: true,
    tags: ["Mais vendido"],
    inStock: true,
  },
  {
    id: "prod2",
    name: "Camiseta Dry-Fit Bricks Performance",
    brand: "Bricks Wear",
    description: "Camiseta dry-fit de alta performance. Tecido que absorve suor rapidamente.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    images: [],
    category: "Moda Fitness",
    normalPrice: 79,
    hasBricksDiscount: false,
    sizes: ["P", "M", "G", "GG"],
    tags: ["Novo"],
    inStock: true,
  },
  {
    id: "prod3",
    name: "Garrafa Termica Aco Inox 1L - Bricks",
    brand: "Bricks Gear",
    description: "Garrafa termica que mantem sua bebida gelada por ate 24 horas.",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    images: [],
    category: "Acessorios",
    normalPrice: 129,
    bricksPrice: 109,
    hasBricksDiscount: true,
    tags: ["Desconto Bricks"],
    inStock: true,
  },
  {
    id: "prod4",
    name: "Faixa Elastica Nivel Forte",
    brand: "Bricks Training",
    description: "Faixa elastica de resistencia forte para treinos funcionais.",
    imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800",
    images: [],
    category: "Equipamentos",
    normalPrice: 39,
    hasBricksDiscount: false,
    tags: [],
    inStock: true,
  },
  {
    id: "prod5",
    name: "Kit Funcional Bricks - Corda + Mini Bands + Cones",
    brand: "Bricks Training",
    description: "Kit completo para treino funcional em casa ou ao ar livre.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    images: [],
    category: "Equipamentos",
    normalPrice: 199,
    bricksPrice: 179,
    hasBricksDiscount: true,
    tags: ["Desconto Bricks", "Kit"],
    inStock: true,
  },
  {
    id: "prod6",
    name: "Legging Bricks Pro Feminina",
    brand: "Bricks Wear",
    description: "Legging de alta compressao com tecido anti-transparencia.",
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    images: [],
    category: "Moda Fitness",
    normalPrice: 149,
    hasBricksDiscount: false,
    sizes: ["P", "M", "G"],
    tags: ["Novo"],
    inStock: true,
  },
];

// Mock AI workout suggestion service
export const aiWorkoutService = {
  async suggest(params: {
    studentId?: string;
    objective: string;
    level: string;
    frequency: string;
    restrictions?: string;
    equipment: string[];
    sessionTime: number;
    includeMealPlan?: boolean;
    includeSupplements?: boolean;
  }): Promise<AIWorkoutSuggestion> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const exercises = [
      { exerciseName: "Agachamento Livre", muscleGroup: "Pernas", equipment: "Peso corporal", sets: 4, reps: 12, restTimeSeconds: 60, observations: "Manter coluna neutra" },
      { exerciseName: "Flexao de Bracos", muscleGroup: "Peito", equipment: "Peso corporal", sets: 3, reps: 15, restTimeSeconds: 45, observations: "Cotovelos proximos ao corpo" },
      { exerciseName: "Remada Curvada", muscleGroup: "Costas", equipment: params.equipment.includes("halteres") ? "Halter" : "Peso corporal", sets: 4, reps: 10, restTimeSeconds: 60 },
      { exerciseName: "Prancha", muscleGroup: "Core", equipment: "Peso corporal", sets: 3, timeInSeconds: 45, restTimeSeconds: 30, observations: "Contrair abdomen" },
      { exerciseName: "Afundo", muscleGroup: "Pernas", equipment: "Peso corporal", sets: 3, reps: 12, restTimeSeconds: 45, observations: "Alternar pernas" },
    ];

    const result: AIWorkoutSuggestion = {
      workout: {
        name: `Treino ${params.objective === "weight_loss" ? "Emagrecimento" : params.objective === "hypertrophy" ? "Hipertrofia" : "Condicionamento"} - IA`,
        objective: params.objective,
        level: params.level,
        frequency: params.frequency,
        duration: params.sessionTime,
        exercises,
      },
    };

    if (params.includeMealPlan) {
      result.mealPlan = `**Plano Alimentar Sugerido para ${params.objective === "weight_loss" ? "Emagrecimento" : "Ganho de Massa"}**

**Cafe da manha (7h)**
- 2 ovos mexidos
- 1 fatia de pao integral
- 1 fruta (banana ou maca)
- Cafe ou cha sem acucar

**Lanche da manha (10h)**
- 1 iogurte natural
- 1 punhado de castanhas

**Almoco (12h30)**
- 150g de frango grelhado ou peixe
- 4 colheres de arroz integral
- Salada verde a vontade
- 1 colher de azeite

**Lanche da tarde (15h30)**
- 1 shake de proteina
- 1 fruta

**Jantar (19h)**
- 150g de proteina magra
- Legumes refogados
- Salada

**Ceia (21h)**
- 1 copo de leite ou iogurte

*Beba pelo menos 2L de agua por dia*`;
    }

    if (params.includeSupplements) {
      result.supplements = `**Suplementacao Sugerida**

1. **Whey Protein** - 1 dose (30g) pos-treino
   - Ajuda na recuperacao muscular

2. **Creatina** - 5g diarios
   - Melhora performance e forca

3. **BCAA** - Durante o treino
   - Previne catabolismo

4. **Omega 3** - 2 capsulas ao dia
   - Anti-inflamatorio natural

5. **Multivitaminico** - 1 capsula pela manha
   - Garante micronutrientes essenciais

*Consulte um nutricionista para ajustes individuais*`;
    }

    return result;
  },
};

// Mock notification service
export const notificationService = {
  async sendNow(notification: Omit<BricksNotification, "id" | "createdAt" | "sentAt" | "type" | "status">): Promise<BricksNotification> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNotification: BricksNotification = {
      ...notification,
      id: `n${Date.now()}`,
      type: "immediate",
      status: "sent",
      createdAt: new Date(),
      sentAt: new Date(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  async schedule(notification: Omit<BricksNotification, "id" | "createdAt" | "sentAt" | "type" | "status">): Promise<BricksNotification> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNotification: BricksNotification = {
      ...notification,
      id: `n${Date.now()}`,
      type: "scheduled",
      status: "pending",
      createdAt: new Date(),
    };
    mockNotifications.push(newNotification);
    return newNotification;
  },

  async createRecurring(notification: Omit<BricksNotification, "id" | "createdAt" | "sentAt" | "type" | "status">): Promise<BricksNotification> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNotification: BricksNotification = {
      ...notification,
      id: `rn${Date.now()}`,
      type: "recurring",
      status: "sent",
      createdAt: new Date(),
    };
    mockRecurringNotifications.push(newNotification);
    return newNotification;
  },

  async getAll(): Promise<BricksNotification[]> {
    return mockNotifications;
  },

  async getScheduled(): Promise<BricksNotification[]> {
    return mockNotifications.filter((n) => n.type === "scheduled");
  },

  async getRecurring(): Promise<BricksNotification[]> {
    return mockRecurringNotifications;
  },

  async cancel(id: string): Promise<void> {
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
      notification.status = "cancelled";
    }
  },

  async pauseRecurring(id: string): Promise<void> {
    const notification = mockRecurringNotifications.find((n) => n.id === id);
    if (notification) {
      notification.status = "cancelled";
    }
  },

  async deleteRecurring(id: string): Promise<void> {
    mockRecurringNotifications = mockRecurringNotifications.filter((n) => n.id !== id);
  },

  getStats(): { sentToday: number; scheduled: number } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sentToday = mockNotifications.filter(
      (n) => n.sentAt && new Date(n.sentAt) >= today
    ).length;
    const scheduled = mockNotifications.filter((n) => n.status === "pending").length;
    return { sentToday, scheduled };
  },
};

// Mock events service
export const eventsService = {
  async getAll(filters?: { city?: string; type?: string; date?: string }): Promise<BricksEvent[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let events = [...mockEvents];
    if (filters?.city) {
      events = events.filter((e) => e.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters?.type) {
      events = events.filter((e) => e.eventType === filters.type);
    }
    return events;
  },

  async getById(id: string): Promise<BricksEvent | undefined> {
    return mockEvents.find((e) => e.id === id);
  },
};

// Mock products service
export const productsService = {
  async getAll(filters?: { category?: string; priceRange?: string }): Promise<BricksProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let products = [...mockProducts];
    if (filters?.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    return products;
  },

  async getById(id: string): Promise<BricksProduct | undefined> {
    return mockProducts.find((p) => p.id === id);
  },
};

// Mock trending workouts service
export const trendingWorkoutsService = {
  async getAll(filters?: { objective?: string; level?: string; type?: string }): Promise<typeof mockTrendingWorkouts> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let workouts = [...mockTrendingWorkouts];
    if (filters?.objective) {
      workouts = workouts.filter((w) => w.objective === filters.objective);
    }
    if (filters?.level) {
      workouts = workouts.filter((w) => w.level === filters.level);
    }
    return workouts;
  },

  async getById(id: string): Promise<(typeof mockTrendingWorkouts)[0] | undefined> {
    return mockTrendingWorkouts.find((w) => w.id === id);
  },
};

// Generate temporary password
export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
