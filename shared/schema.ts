import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userTypeEnum = pgEnum("user_type", ["personal", "student"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "cancelled", "completed"]);
export const workoutStatusEnum = pgEnum("workout_status", ["active", "completed", "paused"]);
export const planTypeEnum = pgEnum("plan_type", ["monthly", "quarterly", "semiannual", "annual"]);
export const planStatusEnum = pgEnum("plan_status", ["active", "inactive", "expired"]);
export const studentStatusEnum = pgEnum("student_status", ["training", "single_consultation"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other", "prefer_not_say"]);
export const biologicalSexEnum = pgEnum("biological_sex", ["male", "female"]);
export const maritalStatusEnum = pgEnum("marital_status", ["single", "married", "divorced", "widowed", "other"]);
export const referralSourceEnum = pgEnum("referral_source", ["friend", "professional", "social_media", "flyer", "google", "events", "other"]);
export const eventTypeEnum = pgEnum("event_type", ["appointment", "personal_event"]);
export const registrationStatusEnum = pgEnum("registration_status", ["pending", "approved", "rejected"]);

// Users table - base authentication
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: userTypeEnum("user_type").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personal trainer profiles - extends user with professional info
export const personalProfiles = pgTable("personal_profiles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  specialties: text("specialties").array(),
  city: text("city"),
  neighborhood: text("neighborhood"),
  cref: text("cref"),
  regions: text("regions").array(),
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0"),
  totalRatings: integer("total_ratings").default(0),
});

// Students table - extends user with student-specific info
export const students = pgTable("students", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  personalId: varchar("personal_id", { length: 36 }).references(() => personalProfiles.id, { onDelete: "set null" }),
  goals: text("goals"),
  notes: text("notes"),
  phone: text("phone"),
  age: integer("age"),
  cpf: text("cpf"),
  maritalStatus: maritalStatusEnum("marital_status"),
  gender: genderEnum("gender"),
  biologicalSex: biologicalSexEnum("biological_sex"),
  birthDate: timestamp("birth_date"),
  cep: text("cep"),
  street: text("street"),
  neighborhood: text("neighborhood"),
  city: text("city"),
  state: text("state"),
  addressNumber: text("address_number"),
  complement: text("complement"),
  healthInsurance: text("health_insurance"),
  studentStatus: studentStatusEnum("student_status").default("training"),
  referralSource: referralSourceEnum("referral_source"),
  registrationStatus: registrationStatusEnum("registration_status").default("approved"),
  registrationToken: text("registration_token"),
  category: text("category"),
});

// Personal events (non-student appointments)
export const personalEvents = pgTable("personal_events", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  color: text("color").default("#b6ff00"),
  isRecurring: boolean("is_recurring").default(false),
  location: text("location"),
  travelTime: integer("travel_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Financial records
export const financialRecords = pgTable("financial_records", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id, { onDelete: "set null" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(),
  category: text("category"),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Workouts created by personals
export const workouts = pgTable("workouts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  objective: text("objective"),
  description: text("description"),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Exercises within workouts
export const workoutExercises = pgTable("workout_exercises", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id", { length: 36 }).notNull().references(() => workouts.id, { onDelete: "cascade" }),
  exerciseName: text("exercise_name").notNull(),
  videoUrl: text("video_url"),
  sets: integer("sets"),
  reps: integer("reps"),
  weight: decimal("weight", { precision: 6, scale: 2 }),
  timeInSeconds: integer("time_in_seconds"),
  restTimeSeconds: integer("rest_time_seconds"),
  observations: text("observations"),
  orderIndex: integer("order_index").default(0),
});

// Workouts assigned to students
export const studentWorkouts = pgTable("student_workouts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id", { length: 36 }).notNull().references(() => students.id, { onDelete: "cascade" }),
  workoutId: varchar("workout_id", { length: 36 }).notNull().references(() => workouts.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: workoutStatusEnum("status").default("active").notNull(),
  feedback: text("feedback"),
  completedAt: timestamp("completed_at"),
});

// Personal availability slots
export const availabilitySlots = pgTable("availability_slots", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isRecurring: boolean("is_recurring").default(false),
});

// Appointments between students and personals
export const appointments = pgTable("appointments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id", { length: 36 }).notNull().references(() => students.id, { onDelete: "cascade" }),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  slotId: varchar("slot_id", { length: 36 }).references(() => availabilitySlots.id, { onDelete: "set null" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  location: text("location"),
  travelTime: integer("travel_time"),
  hasSinglePayment: boolean("has_single_payment").default(false),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student plans for payment tracking
export const studentPlans = pgTable("student_plans", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id", { length: 36 }).notNull().references(() => students.id, { onDelete: "cascade" }),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  planType: planTypeEnum("plan_type").notNull(),
  status: planStatusEnum("status").default("active").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
});

// Contact preference enum
export const contactPreferenceEnum = pgEnum("contact_preference", ["email", "whatsapp", "phone"]);

// Quote status enum
export const quoteStatusEnum = pgEnum("quote_status", ["pending", "viewed", "responded", "closed"]);

// Reviews/Ratings for personal trainers
export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  studentId: varchar("student_id", { length: 36 }).references(() => students.id, { onDelete: "set null" }),
  studentName: text("student_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quote requests
export const quoteRequests = pgTable("quote_requests", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  message: text("message").notNull(),
  contactPreference: contactPreferenceEnum("contact_preference").notNull(),
  status: quoteStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personal gallery media
export const personalGallery = pgTable("personal_gallery", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull(),
  caption: text("caption"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Personal services
export const personalServices = pgTable("personal_services", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  duration: text("duration"),
});

// Personal experience
export const personalExperience = pgTable("personal_experience", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  personalId: varchar("personal_id", { length: 36 }).notNull().references(() => personalProfiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  company: text("company"),
  description: text("description"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  isCurrent: boolean("is_current").default(false),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  personalProfile: one(personalProfiles, {
    fields: [users.id],
    references: [personalProfiles.userId],
  }),
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
}));

export const personalProfilesRelations = relations(personalProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [personalProfiles.userId],
    references: [users.id],
  }),
  students: many(students),
  workouts: many(workouts),
  availabilitySlots: many(availabilitySlots),
  appointments: many(appointments),
  studentPlans: many(studentPlans),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  personal: one(personalProfiles, {
    fields: [students.personalId],
    references: [personalProfiles.id],
  }),
  studentWorkouts: many(studentWorkouts),
  appointments: many(appointments),
  studentPlans: many(studentPlans),
}));

export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  personal: one(personalProfiles, {
    fields: [workouts.personalId],
    references: [personalProfiles.id],
  }),
  exercises: many(workoutExercises),
  studentWorkouts: many(studentWorkouts),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
}));

export const studentWorkoutsRelations = relations(studentWorkouts, ({ one }) => ({
  student: one(students, {
    fields: [studentWorkouts.studentId],
    references: [students.id],
  }),
  workout: one(workouts, {
    fields: [studentWorkouts.workoutId],
    references: [workouts.id],
  }),
}));

export const availabilitySlotsRelations = relations(availabilitySlots, ({ one, many }) => ({
  personal: one(personalProfiles, {
    fields: [availabilitySlots.personalId],
    references: [personalProfiles.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  student: one(students, {
    fields: [appointments.studentId],
    references: [students.id],
  }),
  personal: one(personalProfiles, {
    fields: [appointments.personalId],
    references: [personalProfiles.id],
  }),
  slot: one(availabilitySlots, {
    fields: [appointments.slotId],
    references: [availabilitySlots.id],
  }),
}));

export const studentPlansRelations = relations(studentPlans, ({ one }) => ({
  student: one(students, {
    fields: [studentPlans.studentId],
    references: [students.id],
  }),
  personal: one(personalProfiles, {
    fields: [studentPlans.personalId],
    references: [personalProfiles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [reviews.personalId],
    references: [personalProfiles.id],
  }),
  student: one(students, {
    fields: [reviews.studentId],
    references: [students.id],
  }),
}));

export const quoteRequestsRelations = relations(quoteRequests, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [quoteRequests.personalId],
    references: [personalProfiles.id],
  }),
}));

export const personalGalleryRelations = relations(personalGallery, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [personalGallery.personalId],
    references: [personalProfiles.id],
  }),
}));

export const personalServicesRelations = relations(personalServices, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [personalServices.personalId],
    references: [personalProfiles.id],
  }),
}));

export const personalExperienceRelations = relations(personalExperience, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [personalExperience.personalId],
    references: [personalProfiles.id],
  }),
}));

export const personalEventsRelations = relations(personalEvents, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [personalEvents.personalId],
    references: [personalProfiles.id],
  }),
}));

export const financialRecordsRelations = relations(financialRecords, ({ one }) => ({
  personal: one(personalProfiles, {
    fields: [financialRecords.personalId],
    references: [personalProfiles.id],
  }),
  student: one(students, {
    fields: [financialRecords.studentId],
    references: [students.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPersonalProfileSchema = createInsertSchema(personalProfiles).omit({ id: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true, createdAt: true });
export const insertWorkoutExerciseSchema = createInsertSchema(workoutExercises).omit({ id: true });
export const insertStudentWorkoutSchema = createInsertSchema(studentWorkouts).omit({ id: true, completedAt: true });
export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({ id: true });
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true });
export const insertStudentPlanSchema = createInsertSchema(studentPlans).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({ id: true, createdAt: true, status: true });
export const insertPersonalGallerySchema = createInsertSchema(personalGallery).omit({ id: true, createdAt: true });
export const insertPersonalServiceSchema = createInsertSchema(personalServices).omit({ id: true });
export const insertPersonalExperienceSchema = createInsertSchema(personalExperience).omit({ id: true });
export const insertPersonalEventSchema = createInsertSchema(personalEvents).omit({ id: true, createdAt: true });
export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({ id: true, createdAt: true });

// Student creation form validation
export const createStudentFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  age: z.number().min(1).max(120).optional(),
  cpf: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed", "other"]).optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_say"]).optional(),
  biologicalSex: z.enum(["male", "female"]).optional(),
  birthDate: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  addressNumber: z.string().optional(),
  complement: z.string().optional(),
  healthInsurance: z.string().optional(),
  studentStatus: z.enum(["training", "single_consultation"]).optional(),
  referralSource: z.enum(["friend", "professional", "social_media", "flyer", "google", "events", "other"]).optional(),
  category: z.string().optional(),
  goals: z.string().optional(),
  notes: z.string().optional(),
});

// Registration schema with validation
export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  userType: z.enum(["personal", "student"]),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Quote request form validation
export const quoteFormSchema = z.object({
  personalId: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  contactPreference: z.enum(["email", "whatsapp", "phone"]),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PersonalProfile = typeof personalProfiles.$inferSelect;
export type InsertPersonalProfile = z.infer<typeof insertPersonalProfileSchema>;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>;
export type StudentWorkout = typeof studentWorkouts.$inferSelect;
export type InsertStudentWorkout = z.infer<typeof insertStudentWorkoutSchema>;
export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type StudentPlan = typeof studentPlans.$inferSelect;
export type InsertStudentPlan = z.infer<typeof insertStudentPlanSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type PersonalGalleryItem = typeof personalGallery.$inferSelect;
export type InsertPersonalGalleryItem = z.infer<typeof insertPersonalGallerySchema>;
export type PersonalService = typeof personalServices.$inferSelect;
export type InsertPersonalService = z.infer<typeof insertPersonalServiceSchema>;
export type PersonalExperienceItem = typeof personalExperience.$inferSelect;
export type InsertPersonalExperienceItem = z.infer<typeof insertPersonalExperienceSchema>;
export type PersonalEvent = typeof personalEvents.$inferSelect;
export type InsertPersonalEvent = z.infer<typeof insertPersonalEventSchema>;
export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;
export type CreateStudentForm = z.infer<typeof createStudentFormSchema>;

// Extended types for API responses
export type PersonalWithUser = PersonalProfile & { user: User; studentCount?: number };
export type StudentWithUser = Student & { user: User };
export type WorkoutWithExercises = Workout & { exercises: WorkoutExercise[] };
export type StudentWorkoutWithDetails = StudentWorkout & { workout: WorkoutWithExercises };
export type AppointmentWithDetails = Appointment & { student: StudentWithUser; personal: PersonalWithUser };
export type PersonalWithDetails = PersonalWithUser & {
  reviews?: Review[];
  services?: PersonalService[];
  experience?: PersonalExperienceItem[];
  gallery?: PersonalGalleryItem[];
};
