import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  insertWorkoutSchema,
  insertWorkoutExerciseSchema,
  insertAvailabilitySlotSchema,
  insertAppointmentSchema,
  insertStudentWorkoutSchema,
} from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "bricks-secret-key-change-in-production";

// Auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    userType: "personal" | "student";
  };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      userType: "personal" | "student";
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Optional auth - doesn't fail if no token
function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        userType: "personal" | "student";
      };
      req.user = decoded;
    } catch (error) {
      // Invalid token, but continue without user
    }
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // =====================
  // AUTH ROUTES
  // =====================

  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        userType: validatedData.userType,
      });

      // Create profile based on user type
      if (validatedData.userType === "personal") {
        await storage.createPersonalProfile({
          userId: user.id,
          specialties: [],
        });
      } else {
        await storage.createStudent({
          userId: user.id,
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Erro ao criar conta" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { password: _, ...userWithoutPassword } = user;

      // Get profile based on user type
      let profile = null;
      if (user.userType === "personal") {
        profile = await storage.getPersonalByUserId(user.id);
      } else {
        profile = await storage.getStudentByUserId(user.id);
      }

      res.json({
        user: userWithoutPassword,
        profile,
      });
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  });

  // =====================
  // PERSONALS ROUTES
  // =====================

  // List all personals (public with filters)
  app.get("/api/personals", optionalAuthMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { specialty, city, search } = req.query;
      
      const personals = await storage.getPersonals({
        specialty: specialty as string,
        city: city as string,
        search: search as string,
      });

      res.json(personals);
    } catch (error) {
      console.error("Get personals error:", error);
      res.status(500).json({ message: "Erro ao buscar personais" });
    }
  });

  // Get personal by ID
  app.get("/api/personals/:id", optionalAuthMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const personal = await storage.getPersonalById(req.params.id);
      if (!personal) {
        return res.status(404).json({ message: "Personal não encontrado" });
      }
      res.json(personal);
    } catch (error) {
      console.error("Get personal error:", error);
      res.status(500).json({ message: "Erro ao buscar personal" });
    }
  });

  // Get personal's available slots
  app.get("/api/personals/:id/slots", async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      
      let slots;
      if (startDate && endDate) {
        slots = await storage.getAvailableSlots(
          req.params.id,
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        slots = await storage.getSlotsByPersonalId(req.params.id);
      }

      res.json(slots);
    } catch (error) {
      console.error("Get slots error:", error);
      res.status(500).json({ message: "Erro ao buscar horários" });
    }
  });

  // Update personal profile (own profile only)
  app.patch("/api/personals/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const { bio, specialties, city, neighborhood, averagePrice } = req.body;
      
      const updated = await storage.updatePersonalProfile(profile.id, {
        bio,
        specialties,
        city,
        neighborhood,
        averagePrice,
      });

      res.json(updated);
    } catch (error) {
      console.error("Update personal error:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Get personal stats (for dashboard)
  app.get("/api/personals/stats", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const students = await storage.getStudentsByPersonalId(profile.id);
      const workouts = await storage.getWorkoutsByPersonalId(profile.id);
      const appointments = await storage.getAppointmentsByPersonalId(profile.id);
      
      const upcomingAppointments = appointments.filter(
        (a) => new Date(a.startTime) > new Date() && a.status !== "cancelled"
      );

      res.json({
        totalStudents: students.length,
        activeWorkouts: workouts.length,
        upcomingAppointments: upcomingAppointments.length,
        averageRating: parseFloat(profile.averageRating || "0"),
      });
    } catch (error) {
      console.error("Get personal stats error:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // =====================
  // STUDENTS ROUTES
  // =====================

  // Get students for current personal
  app.get("/api/students", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const students = await storage.getStudentsByPersonalId(profile.id);
      res.json(students);
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ message: "Erro ao buscar alunos" });
    }
  });

  // Update student profile
  app.patch("/api/students/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "student") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const student = await storage.getStudentByUserId(req.user!.id);
      if (!student) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const { goals, notes, personalId } = req.body;
      
      const updated = await storage.updateStudent(student.id, {
        goals,
        notes,
        personalId,
      });

      res.json(updated);
    } catch (error) {
      console.error("Update student error:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  // Get student stats (for dashboard)
  app.get("/api/students/stats", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "student") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const student = await storage.getStudentByUserId(req.user!.id);
      if (!student) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const workouts = await storage.getStudentWorkoutsByStudentId(student.id);
      const appointments = await storage.getAppointmentsByStudentId(student.id);
      
      const activeWorkouts = workouts.filter((w) => w.status === "active");
      const completedWorkouts = workouts.filter((w) => w.status === "completed");
      const upcomingAppointments = appointments.filter(
        (a) => new Date(a.startTime) > new Date() && a.status !== "cancelled"
      );

      const totalWorkouts = workouts.length;
      const weeklyProgress = totalWorkouts > 0 ? (completedWorkouts.length / totalWorkouts) * 100 : 0;

      res.json({
        activeWorkouts: activeWorkouts.length,
        completedWorkouts: completedWorkouts.length,
        upcomingAppointments: upcomingAppointments.length,
        weeklyProgress: Math.round(weeklyProgress),
      });
    } catch (error) {
      console.error("Get student stats error:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // =====================
  // WORKOUTS ROUTES
  // =====================

  // Get workouts (for personal: their workouts, for student: assigned workouts)
  app.get("/api/workouts", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType === "personal") {
        const profile = await storage.getPersonalByUserId(req.user!.id);
        if (!profile) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const workouts = await storage.getWorkoutsByPersonalId(profile.id);
        res.json(workouts);
      } else {
        // For students, return assigned workouts
        const student = await storage.getStudentByUserId(req.user!.id);
        if (!student) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const assignments = await storage.getStudentWorkoutsByStudentId(student.id);
        res.json(assignments);
      }
    } catch (error) {
      console.error("Get workouts error:", error);
      res.status(500).json({ message: "Erro ao buscar treinos" });
    }
  });

  // Create workout (personal only)
  app.post("/api/workouts", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const validatedData = insertWorkoutSchema.parse({
        ...req.body,
        personalId: profile.id,
      });

      const workout = await storage.createWorkout(validatedData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Create workout error:", error);
      res.status(500).json({ message: "Erro ao criar treino" });
    }
  });

  // Get workout by ID
  app.get("/api/workouts/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const workout = await storage.getWorkoutById(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }
      res.json(workout);
    } catch (error) {
      console.error("Get workout error:", error);
      res.status(500).json({ message: "Erro ao buscar treino" });
    }
  });

  // Update workout
  app.patch("/api/workouts/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const workout = await storage.getWorkoutById(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile || workout.personalId !== profile.id) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const { name, objective, description } = req.body;
      const updated = await storage.updateWorkout(req.params.id, {
        name,
        objective,
        description,
      });

      res.json(updated);
    } catch (error) {
      console.error("Update workout error:", error);
      res.status(500).json({ message: "Erro ao atualizar treino" });
    }
  });

  // Delete workout
  app.delete("/api/workouts/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const workout = await storage.getWorkoutById(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile || workout.personalId !== profile.id) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      await storage.deleteWorkout(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete workout error:", error);
      res.status(500).json({ message: "Erro ao excluir treino" });
    }
  });

  // =====================
  // WORKOUT EXERCISES ROUTES
  // =====================

  // Add exercise to workout
  app.post("/api/workouts/:workoutId/exercises", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const workout = await storage.getWorkoutById(req.params.workoutId);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile || workout.personalId !== profile.id) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const validatedData = insertWorkoutExerciseSchema.parse({
        ...req.body,
        workoutId: req.params.workoutId,
      });

      const exercise = await storage.createWorkoutExercise(validatedData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Create exercise error:", error);
      res.status(500).json({ message: "Erro ao adicionar exercício" });
    }
  });

  // Update exercise
  app.patch("/api/workouts/:workoutId/exercises/:exerciseId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const workout = await storage.getWorkoutById(req.params.workoutId);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile || workout.personalId !== profile.id) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const updated = await storage.updateWorkoutExercise(req.params.exerciseId, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Update exercise error:", error);
      res.status(500).json({ message: "Erro ao atualizar exercício" });
    }
  });

  // Delete exercise
  app.delete("/api/workouts/:workoutId/exercises/:exerciseId", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const workout = await storage.getWorkoutById(req.params.workoutId);
      if (!workout) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile || workout.personalId !== profile.id) {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      await storage.deleteWorkoutExercise(req.params.exerciseId);
      res.status(204).send();
    } catch (error) {
      console.error("Delete exercise error:", error);
      res.status(500).json({ message: "Erro ao excluir exercício" });
    }
  });

  // =====================
  // STUDENT WORKOUTS ROUTES
  // =====================

  // Get student workouts
  app.get("/api/student-workouts", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType === "student") {
        const student = await storage.getStudentByUserId(req.user!.id);
        if (!student) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const workouts = await storage.getStudentWorkoutsByStudentId(student.id);
        res.json(workouts);
      } else {
        const profile = await storage.getPersonalByUserId(req.user!.id);
        if (!profile) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const workouts = await storage.getStudentWorkoutsByPersonalId(profile.id);
        res.json(workouts);
      }
    } catch (error) {
      console.error("Get student workouts error:", error);
      res.status(500).json({ message: "Erro ao buscar treinos" });
    }
  });

  // Assign workout to student
  app.post("/api/student-workouts", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const validatedData = insertStudentWorkoutSchema.parse(req.body);
      const assignment = await storage.createStudentWorkout(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Assign workout error:", error);
      res.status(500).json({ message: "Erro ao atribuir treino" });
    }
  });

  // Get specific student workout with details
  app.get("/api/student-workouts/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const assignment = await storage.getStudentWorkoutById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      const workout = await storage.getWorkoutById(assignment.workoutId);
      res.json({ ...assignment, workout });
    } catch (error) {
      console.error("Get student workout error:", error);
      res.status(500).json({ message: "Erro ao buscar treino" });
    }
  });

  // Mark workout as complete
  app.patch("/api/student-workouts/:id/complete", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "student") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const { feedback } = req.body;
      const updated = await storage.markStudentWorkoutComplete(req.params.id, feedback);
      
      if (!updated) {
        return res.status(404).json({ message: "Treino não encontrado" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Complete workout error:", error);
      res.status(500).json({ message: "Erro ao marcar treino como completo" });
    }
  });

  // =====================
  // AVAILABILITY SLOTS ROUTES
  // =====================

  // Get availability slots
  app.get("/api/availability-slots", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const slots = await storage.getSlotsByPersonalId(profile.id);
      res.json(slots);
    } catch (error) {
      console.error("Get slots error:", error);
      res.status(500).json({ message: "Erro ao buscar horários" });
    }
  });

  // Create availability slot
  app.post("/api/availability-slots", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      const profile = await storage.getPersonalByUserId(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const validatedData = insertAvailabilitySlotSchema.parse({
        ...req.body,
        personalId: profile.id,
      });

      const slot = await storage.createAvailabilitySlot(validatedData);
      res.status(201).json(slot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Create slot error:", error);
      res.status(500).json({ message: "Erro ao criar horário" });
    }
  });

  // Delete availability slot
  app.delete("/api/availability-slots/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "personal") {
        return res.status(403).json({ message: "Acesso não autorizado" });
      }

      await storage.deleteAvailabilitySlot(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Delete slot error:", error);
      res.status(500).json({ message: "Erro ao excluir horário" });
    }
  });

  // =====================
  // APPOINTMENTS ROUTES
  // =====================

  // Get appointments
  app.get("/api/appointments", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType === "personal") {
        const profile = await storage.getPersonalByUserId(req.user!.id);
        if (!profile) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const appointments = await storage.getAppointmentsByPersonalId(profile.id);
        res.json(appointments);
      } else {
        const student = await storage.getStudentByUserId(req.user!.id);
        if (!student) {
          return res.status(404).json({ message: "Perfil não encontrado" });
        }
        const appointments = await storage.getAppointmentsByStudentId(student.id);
        res.json(appointments);
      }
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "Erro ao buscar agendamentos" });
    }
  });

  // Create appointment (student books with personal)
  app.post("/api/appointments", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      if (req.user!.userType !== "student") {
        return res.status(403).json({ message: "Apenas alunos podem agendar" });
      }

      const student = await storage.getStudentByUserId(req.user!.id);
      if (!student) {
        return res.status(404).json({ message: "Perfil não encontrado" });
      }

      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        studentId: student.id,
      });

      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Create appointment error:", error);
      res.status(500).json({ message: "Erro ao criar agendamento" });
    }
  });

  // Update appointment status
  app.patch("/api/appointments/:id/status", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { status } = req.body;
      
      if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Status inválido" });
      }

      const updated = await storage.updateAppointmentStatus(req.params.id, status);
      
      if (!updated) {
        return res.status(404).json({ message: "Agendamento não encontrado" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Update appointment status error:", error);
      res.status(500).json({ message: "Erro ao atualizar status" });
    }
  });

  // =====================
  // USER PROFILE ROUTES
  // =====================

  // Update user profile (name, photo)
  app.patch("/api/users/me", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const { name, photoUrl } = req.body;
      
      const updated = await storage.updateUser(req.user!.id, {
        name,
        photoUrl,
      });

      if (!updated) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const { password: _, ...userWithoutPassword } = updated;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  });

  return httpServer;
}
