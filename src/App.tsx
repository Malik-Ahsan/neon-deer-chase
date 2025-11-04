import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MasterResumePage from "./pages/MasterResumePage"; // Renamed from Index
import DashboardPage from "./pages/DashboardPage"; // New Dashboard page
import NotFound from "./pages/NotFound";
import TaggingPage from "./pages/TaggingPage";
import JobDescriptionInputPage from "./pages/JobDescriptionInputPage";
import ApplicationMaterialGenerationPage from "./pages/ApplicationMaterialGenerationPage";
import VersionManagementPage from "./pages/VersionManagementPage";
import PricingPage from "./pages/PricingPage";
import VoiceCapturePage from "./pages/VoiceCapturePage";
import CoachingPage from "./pages/CoachingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth

const queryClient = new QueryClient();

// A wrapper component to handle conditional routing for the root path
const HomeRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardPage /> : <MasterResumePage />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          <Routes>
            <Route path="/" element={<HomeRoute />} /> {/* Conditional home route */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/master-resume" element={<ProtectedRoute><MasterResumePage /></ProtectedRoute>} /> {/* New route for MasterResumePage */}
            <Route path="/tagging" element={<ProtectedRoute><TaggingPage /></ProtectedRoute>} />
            <Route path="/job-description-input" element={<ProtectedRoute><JobDescriptionInputPage /></ProtectedRoute>} />
            <Route path="/application-material-generation" element={<ProtectedRoute><ApplicationMaterialGenerationPage /></ProtectedRoute>} />
            <Route path="/version-management" element={<ProtectedRoute><VersionManagementPage /></ProtectedRoute>} />
            <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
            <Route path="/voice-capture" element={<ProtectedRoute><VoiceCapturePage /></ProtectedRoute>} />
            <Route path="/coaching" element={<ProtectedRoute><CoachingPage /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;