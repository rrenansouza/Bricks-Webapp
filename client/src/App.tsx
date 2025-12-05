import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import { LoginPage, RegisterPage } from "@/pages/auth";
import PersonalDashboard from "@/pages/dashboard-personal";
import StudentDashboard from "@/pages/dashboard-student";
import MarketplacePage from "@/pages/marketplace";
import PersonalDetailPage from "@/pages/personal-detail";
import { WorkoutsListPage, WorkoutDetailPage } from "@/pages/workouts";
import { MyWorkoutsListPage, MyWorkoutDetailPage } from "@/pages/my-workouts";
import SchedulePage from "@/pages/schedule";
import StudentsPage from "@/pages/students";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.userType === "personal") {
    return <PersonalDashboard />;
  }

  return <StudentDashboard />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      <Route path="/personals">
        <MarketplacePage />
      </Route>
      <Route path="/personals/:id">
        {(params) => <PersonalDetailPage id={params.id} />}
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardRouter />
        </ProtectedRoute>
      </Route>
      
      <Route path="/workouts">
        <ProtectedRoute>
          <WorkoutsListPage />
        </ProtectedRoute>
      </Route>
      <Route path="/workouts/new">
        <ProtectedRoute>
          <WorkoutDetailPage />
        </ProtectedRoute>
      </Route>
      <Route path="/workouts/:id">
        {(params) => (
          <ProtectedRoute>
            <WorkoutDetailPage id={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/my-workouts">
        <ProtectedRoute>
          <MyWorkoutsListPage />
        </ProtectedRoute>
      </Route>
      <Route path="/my-workouts/:id">
        {(params) => (
          <ProtectedRoute>
            <MyWorkoutDetailPage id={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/schedule">
        <ProtectedRoute>
          <SchedulePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/students">
        <ProtectedRoute>
          <StudentsPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
