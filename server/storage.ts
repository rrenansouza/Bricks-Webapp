import { db } from "./db";
import { eq, and, ilike, or, gte, lte, desc, sql, count } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  users,
  personalProfiles,
  students,
  workouts,
  workoutExercises,
  studentWorkouts,
  availabilitySlots,
  appointments,
  studentPlans,
  reviews,
  quoteRequests,
  personalGallery,
  personalServices,
  personalExperience,
  personalEvents,
  financialRecords,
  type User,
  type InsertUser,
  type PersonalProfile,
  type InsertPersonalProfile,
  type Student,
  type InsertStudent,
  type Workout,
  type InsertWorkout,
  type WorkoutExercise,
  type InsertWorkoutExercise,
  type StudentWorkout,
  type InsertStudentWorkout,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type Appointment,
  type InsertAppointment,
  type StudentPlan,
  type InsertStudentPlan,
  type Review,
  type InsertReview,
  type QuoteRequest,
  type InsertQuoteRequest,
  type PersonalGalleryItem,
  type InsertPersonalGalleryItem,
  type PersonalService,
  type InsertPersonalService,
  type PersonalExperienceItem,
  type InsertPersonalExperienceItem,
  type PersonalEvent,
  type InsertPersonalEvent,
  type FinancialRecord,
  type InsertFinancialRecord,
  type PersonalWithUser,
  type PersonalWithDetails,
  type StudentWithUser,
  type WorkoutWithExercises,
} from "@shared/schema";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string, mustChangePasswordOnFirstLogin?: boolean): Promise<User | undefined>;

  // Personal Profiles
  createPersonalProfile(profile: InsertPersonalProfile): Promise<PersonalProfile>;
  getPersonalById(id: string): Promise<PersonalWithUser | undefined>;
  getPersonalByUserId(userId: string): Promise<PersonalProfile | undefined>;
  getPersonals(filters?: { specialty?: string; city?: string; search?: string }): Promise<PersonalWithUser[]>;
  updatePersonalProfile(id: string, data: Partial<InsertPersonalProfile>): Promise<PersonalProfile | undefined>;

  // Students
  createStudent(student: InsertStudent): Promise<Student>;
  getStudentById(id: string): Promise<StudentWithUser | undefined>;
  getStudentByUserId(userId: string): Promise<Student | undefined>;
  getStudentsByPersonalId(personalId: string): Promise<StudentWithUser[]>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined>;

  // Workouts
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  getWorkoutById(id: string): Promise<WorkoutWithExercises | undefined>;
  getWorkoutsByPersonalId(personalId: string): Promise<Workout[]>;
  updateWorkout(id: string, data: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: string): Promise<boolean>;

  // Workout Exercises
  createWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise>;
  getExercisesByWorkoutId(workoutId: string): Promise<WorkoutExercise[]>;
  updateWorkoutExercise(id: string, data: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined>;
  deleteWorkoutExercise(id: string): Promise<boolean>;

  // Student Workouts
  createStudentWorkout(assignment: InsertStudentWorkout): Promise<StudentWorkout>;
  getStudentWorkoutById(id: string): Promise<StudentWorkout | undefined>;
  getStudentWorkoutsByStudentId(studentId: string): Promise<StudentWorkout[]>;
  getStudentWorkoutsByPersonalId(personalId: string): Promise<StudentWorkout[]>;
  updateStudentWorkout(id: string, data: Partial<InsertStudentWorkout>): Promise<StudentWorkout | undefined>;
  markStudentWorkoutComplete(id: string, feedback?: string): Promise<StudentWorkout | undefined>;

  // Availability Slots
  createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot>;
  getSlotsByPersonalId(personalId: string): Promise<AvailabilitySlot[]>;
  getAvailableSlots(personalId: string, startDate: Date, endDate: Date): Promise<AvailabilitySlot[]>;
  deleteAvailabilitySlot(id: string): Promise<boolean>;

  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  getAppointmentsByPersonalId(personalId: string): Promise<Appointment[]>;
  getAppointmentsByStudentId(studentId: string): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Appointment | undefined>;

  // Student Plans
  createStudentPlan(plan: InsertStudentPlan): Promise<StudentPlan>;
  getStudentPlansByStudentId(studentId: string): Promise<StudentPlan[]>;
  getStudentPlansByPersonalId(personalId: string): Promise<StudentPlan[]>;

  // Reviews
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByPersonalId(personalId: string): Promise<Review[]>;

  // Quote Requests
  createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequestsByPersonalId(personalId: string): Promise<QuoteRequest[]>;
  updateQuoteRequestStatus(id: string, status: "pending" | "viewed" | "responded" | "closed"): Promise<QuoteRequest | undefined>;

  // Personal Gallery
  createPersonalGalleryItem(item: InsertPersonalGalleryItem): Promise<PersonalGalleryItem>;
  getPersonalGalleryByPersonalId(personalId: string): Promise<PersonalGalleryItem[]>;
  deletePersonalGalleryItem(id: string): Promise<boolean>;

  // Personal Services
  createPersonalService(service: InsertPersonalService): Promise<PersonalService>;
  getPersonalServicesByPersonalId(personalId: string): Promise<PersonalService[]>;
  updatePersonalService(id: string, data: Partial<InsertPersonalService>): Promise<PersonalService | undefined>;
  deletePersonalService(id: string): Promise<boolean>;

  // Personal Experience
  createPersonalExperience(experience: InsertPersonalExperienceItem): Promise<PersonalExperienceItem>;
  getPersonalExperienceByPersonalId(personalId: string): Promise<PersonalExperienceItem[]>;
  updatePersonalExperience(id: string, data: Partial<InsertPersonalExperienceItem>): Promise<PersonalExperienceItem | undefined>;
  deletePersonalExperience(id: string): Promise<boolean>;

  // Extended Personal Profile
  getPersonalWithDetails(id: string): Promise<PersonalWithDetails | undefined>;

  // Personal Events
  createPersonalEvent(event: InsertPersonalEvent): Promise<PersonalEvent>;
  getPersonalEventById(id: string): Promise<PersonalEvent | undefined>;
  getPersonalEventsByPersonalId(personalId: string, startDate?: Date, endDate?: Date): Promise<PersonalEvent[]>;
  updatePersonalEvent(id: string, data: Partial<InsertPersonalEvent>): Promise<PersonalEvent | undefined>;
  deletePersonalEvent(id: string): Promise<boolean>;

  // Financial Records
  createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord>;
  getFinancialRecordById(id: string): Promise<FinancialRecord | undefined>;
  getFinancialRecordsByPersonalId(personalId: string, filters?: { startDate?: Date; endDate?: Date; type?: string; category?: string }): Promise<FinancialRecord[]>;
  updateFinancialRecord(id: string, data: Partial<InsertFinancialRecord>): Promise<FinancialRecord | undefined>;
  deleteFinancialRecord(id: string): Promise<boolean>;
  getFinancialSummary(personalId: string, startDate: Date, endDate: Date): Promise<{ income: number; expenses: number }>;

  // Student Registration
  generateStudentRegistrationToken(personalId: string): Promise<{ studentId: string; token: string }>;
  getStudentByRegistrationToken(token: string): Promise<Student | undefined>;
  completeStudentSelfRegistration(token: string, userId: string, data: Partial<InsertStudent>): Promise<Student | undefined>;
  approveStudent(id: string): Promise<Student | undefined>;
  rejectStudent(id: string): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;

  // Dashboard Stats
  getDashboardStats(personalId: string): Promise<{
    activeStudents: number;
    todayAppointments: number;
    activeWorkouts: number;
    weeklyProductivity: { day: string; count: number }[];
    monthBirthdays: StudentWithUser[];
    studentsByStatus: { status: string; count: number }[];
    studentsByCity: { city: string; count: number }[];
    pendingStudents: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserPassword(id: string, hashedPassword: string, mustChangePasswordOnFirstLogin?: boolean): Promise<User | undefined> {
    const updateData: any = { password: hashedPassword };
    if (mustChangePasswordOnFirstLogin !== undefined) {
      updateData.mustChangePasswordOnFirstLogin = mustChangePasswordOnFirstLogin;
    }
    const [updated] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return updated;
  }

  // Personal Profiles
  async createPersonalProfile(profile: InsertPersonalProfile): Promise<PersonalProfile> {
    const [newProfile] = await db.insert(personalProfiles).values(profile).returning();
    return newProfile;
  }

  async getPersonalById(id: string): Promise<PersonalWithUser | undefined> {
    const result = await db
      .select()
      .from(personalProfiles)
      .innerJoin(users, eq(personalProfiles.userId, users.id))
      .where(eq(personalProfiles.id, id));
    
    if (result.length === 0) return undefined;
    
    const studentCount = await db
      .select()
      .from(students)
      .where(eq(students.personalId, id));
    
    return {
      ...result[0].personal_profiles,
      user: result[0].users,
      studentCount: studentCount.length,
    };
  }

  async getPersonalByUserId(userId: string): Promise<PersonalProfile | undefined> {
    const [profile] = await db.select().from(personalProfiles).where(eq(personalProfiles.userId, userId));
    return profile;
  }

  async getPersonals(filters?: { specialty?: string; city?: string; search?: string }): Promise<PersonalWithUser[]> {
    let query = db
      .select()
      .from(personalProfiles)
      .innerJoin(users, eq(personalProfiles.userId, users.id));

    const conditions: any[] = [];

    if (filters?.city) {
      conditions.push(ilike(personalProfiles.city, `%${filters.city}%`));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(users.name, `%${filters.search}%`),
          ilike(personalProfiles.bio, `%${filters.search}%`)
        )
      );
    }

    const results = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query;

    const personalsWithCount = await Promise.all(
      results.map(async (r) => {
        const studentCount = await db
          .select()
          .from(students)
          .where(eq(students.personalId, r.personal_profiles.id));

        let matchesSpecialty = true;
        if (filters?.specialty && r.personal_profiles.specialties) {
          matchesSpecialty = r.personal_profiles.specialties.some(
            (s) => s.toLowerCase().includes(filters.specialty!.toLowerCase())
          );
        }

        if (!matchesSpecialty) return null;

        return {
          ...r.personal_profiles,
          user: r.users,
          studentCount: studentCount.length,
        };
      })
    );

    return personalsWithCount.filter((p): p is PersonalWithUser => p !== null);
  }

  async updatePersonalProfile(id: string, data: Partial<InsertPersonalProfile>): Promise<PersonalProfile | undefined> {
    const [updated] = await db.update(personalProfiles).set(data).where(eq(personalProfiles.id, id)).returning();
    return updated;
  }

  // Students
  async createStudent(student: InsertStudent): Promise<Student> {
    const [newStudent] = await db.insert(students).values(student).returning();
    return newStudent;
  }

  async getStudentById(id: string): Promise<StudentWithUser | undefined> {
    const result = await db
      .select()
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, id));
    
    if (result.length === 0) return undefined;
    
    return {
      ...result[0].students,
      user: result[0].users,
    };
  }

  async getStudentByUserId(userId: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.userId, userId));
    return student;
  }

  async getStudentsByPersonalId(personalId: string): Promise<StudentWithUser[]> {
    const results = await db
      .select()
      .from(students)
      .innerJoin(users, eq(students.userId, users.id))
      .where(eq(students.personalId, personalId));
    
    return results.map((r) => ({
      ...r.students,
      user: r.users,
    }));
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [updated] = await db.update(students).set(data).where(eq(students.id, id)).returning();
    return updated;
  }

  // Workouts
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  async getWorkoutById(id: string): Promise<WorkoutWithExercises | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    if (!workout) return undefined;

    const exercises = await db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, id))
      .orderBy(workoutExercises.orderIndex);

    return {
      ...workout,
      exercises,
    };
  }

  async getWorkoutsByPersonalId(personalId: string): Promise<Workout[]> {
    return db
      .select()
      .from(workouts)
      .where(eq(workouts.personalId, personalId))
      .orderBy(desc(workouts.createdAt));
  }

  async updateWorkout(id: string, data: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const [updated] = await db.update(workouts).set(data).where(eq(workouts.id, id)).returning();
    return updated;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const result = await db.delete(workouts).where(eq(workouts.id, id)).returning();
    return result.length > 0;
  }

  // Workout Exercises
  async createWorkoutExercise(exercise: InsertWorkoutExercise): Promise<WorkoutExercise> {
    const [newExercise] = await db.insert(workoutExercises).values(exercise).returning();
    return newExercise;
  }

  async getExercisesByWorkoutId(workoutId: string): Promise<WorkoutExercise[]> {
    return db
      .select()
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
      .orderBy(workoutExercises.orderIndex);
  }

  async updateWorkoutExercise(id: string, data: Partial<InsertWorkoutExercise>): Promise<WorkoutExercise | undefined> {
    const [updated] = await db.update(workoutExercises).set(data).where(eq(workoutExercises.id, id)).returning();
    return updated;
  }

  async deleteWorkoutExercise(id: string): Promise<boolean> {
    const result = await db.delete(workoutExercises).where(eq(workoutExercises.id, id)).returning();
    return result.length > 0;
  }

  // Student Workouts
  async createStudentWorkout(assignment: InsertStudentWorkout): Promise<StudentWorkout> {
    const [newAssignment] = await db.insert(studentWorkouts).values(assignment).returning();
    return newAssignment;
  }

  async getStudentWorkoutById(id: string): Promise<StudentWorkout | undefined> {
    const [assignment] = await db.select().from(studentWorkouts).where(eq(studentWorkouts.id, id));
    return assignment;
  }

  async getStudentWorkoutsByStudentId(studentId: string): Promise<StudentWorkout[]> {
    return db.select().from(studentWorkouts).where(eq(studentWorkouts.studentId, studentId));
  }

  async getStudentWorkoutsByPersonalId(personalId: string): Promise<StudentWorkout[]> {
    const results = await db
      .select()
      .from(studentWorkouts)
      .innerJoin(workouts, eq(studentWorkouts.workoutId, workouts.id))
      .where(eq(workouts.personalId, personalId));
    
    return results.map((r) => r.student_workouts);
  }

  async updateStudentWorkout(id: string, data: Partial<InsertStudentWorkout>): Promise<StudentWorkout | undefined> {
    const [updated] = await db.update(studentWorkouts).set(data).where(eq(studentWorkouts.id, id)).returning();
    return updated;
  }

  async markStudentWorkoutComplete(id: string, feedback?: string): Promise<StudentWorkout | undefined> {
    const [updated] = await db
      .update(studentWorkouts)
      .set({
        status: "completed",
        completedAt: new Date(),
        feedback,
      })
      .where(eq(studentWorkouts.id, id))
      .returning();
    return updated;
  }

  // Availability Slots
  async createAvailabilitySlot(slot: InsertAvailabilitySlot): Promise<AvailabilitySlot> {
    const [newSlot] = await db.insert(availabilitySlots).values(slot).returning();
    return newSlot;
  }

  async getSlotsByPersonalId(personalId: string): Promise<AvailabilitySlot[]> {
    return db
      .select()
      .from(availabilitySlots)
      .where(eq(availabilitySlots.personalId, personalId))
      .orderBy(availabilitySlots.startTime);
  }

  async getAvailableSlots(personalId: string, startDate: Date, endDate: Date): Promise<AvailabilitySlot[]> {
    return db
      .select()
      .from(availabilitySlots)
      .where(
        and(
          eq(availabilitySlots.personalId, personalId),
          gte(availabilitySlots.startTime, startDate),
          lte(availabilitySlots.endTime, endDate)
        )
      )
      .orderBy(availabilitySlots.startTime);
  }

  async deleteAvailabilitySlot(id: string): Promise<boolean> {
    const result = await db.delete(availabilitySlots).where(eq(availabilitySlots.id, id)).returning();
    return result.length > 0;
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByPersonalId(personalId: string): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.personalId, personalId))
      .orderBy(desc(appointments.startTime));
  }

  async getAppointmentsByStudentId(studentId: string): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.studentId, studentId))
      .orderBy(desc(appointments.startTime));
  }

  async updateAppointmentStatus(id: string, status: "pending" | "confirmed" | "cancelled" | "completed"): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    return updated;
  }

  // Student Plans
  async createStudentPlan(plan: InsertStudentPlan): Promise<StudentPlan> {
    const [newPlan] = await db.insert(studentPlans).values(plan).returning();
    return newPlan;
  }

  async getStudentPlansByStudentId(studentId: string): Promise<StudentPlan[]> {
    return db.select().from(studentPlans).where(eq(studentPlans.studentId, studentId));
  }

  async getStudentPlansByPersonalId(personalId: string): Promise<StudentPlan[]> {
    return db.select().from(studentPlans).where(eq(studentPlans.personalId, personalId));
  }

  // Reviews
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update personal's average rating
    const allReviews = await this.getReviewsByPersonalId(review.personalId);
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await db.update(personalProfiles)
      .set({ 
        averageRating: avgRating.toFixed(2),
        totalRatings: allReviews.length 
      })
      .where(eq(personalProfiles.id, review.personalId));
    
    return newReview;
  }

  async getReviewsByPersonalId(personalId: string): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.personalId, personalId))
      .orderBy(desc(reviews.createdAt));
  }

  // Quote Requests
  async createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newQuote] = await db.insert(quoteRequests).values(quote).returning();
    return newQuote;
  }

  async getQuoteRequestsByPersonalId(personalId: string): Promise<QuoteRequest[]> {
    return db.select().from(quoteRequests)
      .where(eq(quoteRequests.personalId, personalId))
      .orderBy(desc(quoteRequests.createdAt));
  }

  async updateQuoteRequestStatus(id: string, status: "pending" | "viewed" | "responded" | "closed"): Promise<QuoteRequest | undefined> {
    const [updated] = await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id)).returning();
    return updated;
  }

  // Personal Gallery
  async createPersonalGalleryItem(item: InsertPersonalGalleryItem): Promise<PersonalGalleryItem> {
    const [newItem] = await db.insert(personalGallery).values(item).returning();
    return newItem;
  }

  async getPersonalGalleryByPersonalId(personalId: string): Promise<PersonalGalleryItem[]> {
    return db.select().from(personalGallery)
      .where(eq(personalGallery.personalId, personalId))
      .orderBy(personalGallery.orderIndex);
  }

  async deletePersonalGalleryItem(id: string): Promise<boolean> {
    const result = await db.delete(personalGallery).where(eq(personalGallery.id, id)).returning();
    return result.length > 0;
  }

  // Personal Services
  async createPersonalService(service: InsertPersonalService): Promise<PersonalService> {
    const [newService] = await db.insert(personalServices).values(service).returning();
    return newService;
  }

  async getPersonalServicesByPersonalId(personalId: string): Promise<PersonalService[]> {
    return db.select().from(personalServices).where(eq(personalServices.personalId, personalId));
  }

  async updatePersonalService(id: string, data: Partial<InsertPersonalService>): Promise<PersonalService | undefined> {
    const [updated] = await db.update(personalServices).set(data).where(eq(personalServices.id, id)).returning();
    return updated;
  }

  async deletePersonalService(id: string): Promise<boolean> {
    const result = await db.delete(personalServices).where(eq(personalServices.id, id)).returning();
    return result.length > 0;
  }

  // Personal Experience
  async createPersonalExperience(experience: InsertPersonalExperienceItem): Promise<PersonalExperienceItem> {
    const [newExperience] = await db.insert(personalExperience).values(experience).returning();
    return newExperience;
  }

  async getPersonalExperienceByPersonalId(personalId: string): Promise<PersonalExperienceItem[]> {
    return db.select().from(personalExperience)
      .where(eq(personalExperience.personalId, personalId))
      .orderBy(desc(personalExperience.startYear));
  }

  async updatePersonalExperience(id: string, data: Partial<InsertPersonalExperienceItem>): Promise<PersonalExperienceItem | undefined> {
    const [updated] = await db.update(personalExperience).set(data).where(eq(personalExperience.id, id)).returning();
    return updated;
  }

  async deletePersonalExperience(id: string): Promise<boolean> {
    const result = await db.delete(personalExperience).where(eq(personalExperience.id, id)).returning();
    return result.length > 0;
  }

  // Extended Personal Profile with all details
  async getPersonalWithDetails(id: string): Promise<PersonalWithDetails | undefined> {
    const personal = await this.getPersonalById(id);
    if (!personal) return undefined;

    const [reviewsList, servicesList, experienceList, galleryList] = await Promise.all([
      this.getReviewsByPersonalId(id),
      this.getPersonalServicesByPersonalId(id),
      this.getPersonalExperienceByPersonalId(id),
      this.getPersonalGalleryByPersonalId(id),
    ]);

    return {
      ...personal,
      reviews: reviewsList,
      services: servicesList,
      experience: experienceList,
      gallery: galleryList,
    };
  }

  // Personal Events
  async createPersonalEvent(event: InsertPersonalEvent): Promise<PersonalEvent> {
    const [newEvent] = await db.insert(personalEvents).values(event).returning();
    return newEvent;
  }

  async getPersonalEventById(id: string): Promise<PersonalEvent | undefined> {
    const [event] = await db.select().from(personalEvents).where(eq(personalEvents.id, id));
    return event;
  }

  async getPersonalEventsByPersonalId(personalId: string, startDate?: Date, endDate?: Date): Promise<PersonalEvent[]> {
    const conditions = [eq(personalEvents.personalId, personalId)];
    
    if (startDate) {
      conditions.push(gte(personalEvents.startTime, startDate));
    }
    if (endDate) {
      conditions.push(lte(personalEvents.endTime, endDate));
    }
    
    return db
      .select()
      .from(personalEvents)
      .where(and(...conditions))
      .orderBy(personalEvents.startTime);
  }

  async updatePersonalEvent(id: string, data: Partial<InsertPersonalEvent>): Promise<PersonalEvent | undefined> {
    const [updated] = await db.update(personalEvents).set(data).where(eq(personalEvents.id, id)).returning();
    return updated;
  }

  async deletePersonalEvent(id: string): Promise<boolean> {
    const result = await db.delete(personalEvents).where(eq(personalEvents.id, id)).returning();
    return result.length > 0;
  }

  // Financial Records
  async createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord> {
    const [newRecord] = await db.insert(financialRecords).values(record).returning();
    return newRecord;
  }

  async getFinancialRecordById(id: string): Promise<FinancialRecord | undefined> {
    const [record] = await db.select().from(financialRecords).where(eq(financialRecords.id, id));
    return record;
  }

  async getFinancialRecordsByPersonalId(
    personalId: string,
    filters?: { startDate?: Date; endDate?: Date; type?: string; category?: string }
  ): Promise<FinancialRecord[]> {
    const conditions = [eq(financialRecords.personalId, personalId)];
    
    if (filters?.startDate) {
      conditions.push(gte(financialRecords.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(financialRecords.date, filters.endDate));
    }
    if (filters?.type) {
      conditions.push(eq(financialRecords.type, filters.type));
    }
    if (filters?.category) {
      conditions.push(eq(financialRecords.category, filters.category));
    }
    
    return db
      .select()
      .from(financialRecords)
      .where(and(...conditions))
      .orderBy(desc(financialRecords.date));
  }

  async updateFinancialRecord(id: string, data: Partial<InsertFinancialRecord>): Promise<FinancialRecord | undefined> {
    const [updated] = await db.update(financialRecords).set(data).where(eq(financialRecords.id, id)).returning();
    return updated;
  }

  async deleteFinancialRecord(id: string): Promise<boolean> {
    const result = await db.delete(financialRecords).where(eq(financialRecords.id, id)).returning();
    return result.length > 0;
  }

  async getFinancialSummary(personalId: string, startDate: Date, endDate: Date): Promise<{ income: number; expenses: number }> {
    const records = await this.getFinancialRecordsByPersonalId(personalId, { startDate, endDate });
    
    let income = 0;
    let expenses = 0;
    
    for (const record of records) {
      const amount = parseFloat(record.amount);
      if (record.type === "income") {
        income += amount;
      } else {
        expenses += amount;
      }
    }
    
    return { income, expenses };
  }

  // Student Registration
  async generateStudentRegistrationToken(personalId: string): Promise<{ studentId: string; token: string }> {
    const token = randomUUID();
    
    const [newStudent] = await db.insert(students).values({
      userId: "", // Will be set when student registers
      personalId,
      registrationToken: token,
      registrationStatus: "pending",
    }).returning();
    
    return { studentId: newStudent.id, token };
  }

  async getStudentByRegistrationToken(token: string): Promise<Student | undefined> {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.registrationToken, token));
    return student;
  }

  async completeStudentSelfRegistration(token: string, userId: string, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [updated] = await db
      .update(students)
      .set({
        ...data,
        userId,
        registrationStatus: "approved",
        registrationToken: null,
      })
      .where(eq(students.registrationToken, token))
      .returning();
    return updated;
  }

  async approveStudent(id: string): Promise<Student | undefined> {
    const [updated] = await db
      .update(students)
      .set({ registrationStatus: "approved" })
      .where(eq(students.id, id))
      .returning();
    return updated;
  }

  async rejectStudent(id: string): Promise<Student | undefined> {
    const [updated] = await db
      .update(students)
      .set({ registrationStatus: "rejected" })
      .where(eq(students.id, id))
      .returning();
    return updated;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id)).returning();
    return result.length > 0;
  }

  // Dashboard Stats
  async getDashboardStats(personalId: string): Promise<{
    activeStudents: number;
    todayAppointments: number;
    activeWorkouts: number;
    weeklyProductivity: { day: string; count: number }[];
    monthBirthdays: StudentWithUser[];
    studentsByStatus: { status: string; count: number }[];
    studentsByCity: { city: string; count: number }[];
    pendingStudents: number;
  }> {
    const allStudents = await this.getStudentsByPersonalId(personalId);
    const activeStudents = allStudents.filter(s => s.registrationStatus === "approved").length;
    const pendingStudents = allStudents.filter(s => s.registrationStatus === "pending").length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allAppointments = await this.getAppointmentsByPersonalId(personalId);
    const todayAppointments = allAppointments.filter(a => {
      const appDate = new Date(a.startTime);
      return appDate >= today && appDate < tomorrow && a.status !== "cancelled";
    }).length;

    const allWorkouts = await this.getWorkoutsByPersonalId(personalId);
    const activeWorkouts = allWorkouts.length;

    // Weekly productivity (last 7 days)
    const weeklyProductivity: { day: string; count: number }[] = [];
    const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayCount = allAppointments.filter(a => {
        const appDate = new Date(a.startTime);
        return appDate >= date && appDate < nextDate && a.status === "completed";
      }).length;
      
      weeklyProductivity.push({
        day: daysOfWeek[date.getDay()],
        count: dayCount,
      });
    }

    // Month birthdays
    const currentMonth = today.getMonth();
    const monthBirthdays = allStudents.filter(s => {
      if (!s.birthDate) return false;
      const birthDate = new Date(s.birthDate);
      return birthDate.getMonth() === currentMonth;
    });

    // Students by status
    const statusCounts: Record<string, number> = {};
    for (const student of allStudents) {
      const status = student.studentStatus || "training";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
    const studentsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

    // Students by city
    const cityCounts: Record<string, number> = {};
    for (const student of allStudents) {
      const city = student.city || "Não informado";
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
    const studentsByCity = Object.entries(cityCounts).map(([city, count]) => ({ city, count }));

    return {
      activeStudents,
      todayAppointments,
      activeWorkouts,
      weeklyProductivity,
      monthBirthdays,
      studentsByStatus,
      studentsByCity,
      pendingStudents,
    };
  }
}

export const storage = new DatabaseStorage();
