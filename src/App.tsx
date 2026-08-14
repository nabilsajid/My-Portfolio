import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import ShowcasePage from "./pages/ShowcasePage";
import LongFormPage from "./pages/LongFormPage";
import ShortFormPage from "./pages/ShortFormPage";
import CreativeVisualsPage from "./pages/CreativeVisualsPage";
import PhotographyCategoryPage from "./pages/PhotographyCategoryPage";
import VideoCategoryPage from "./pages/VideoCategoryPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminHomeContent from "./pages/admin/AdminHomeContent";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminFAQ from "./pages/admin/AdminFAQ";
import AdminStats from "./pages/admin/AdminStats";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminClients from "./pages/admin/AdminClients";
import AdminTestimonials from "./pages/admin/AdminTestimonials";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/showcase" element={<PageTransition><ShowcasePage /></PageTransition>} />
            <Route path="/long-form" element={<PageTransition><LongFormPage /></PageTransition>} />
            <Route path="/short-form" element={<PageTransition><ShortFormPage /></PageTransition>} />
            <Route path="/creative-visuals" element={<PageTransition><CreativeVisualsPage /></PageTransition>} />
            <Route path="/photography/:category" element={<PageTransition><PhotographyCategoryPage /></PageTransition>} />
            <Route path="/video-category/:categoryName" element={<PageTransition><VideoCategoryPage /></PageTransition>} />
            <Route path="/project/:id" element={<PageTransition><ProjectDetailPage /></PageTransition>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<AdminHomeContent />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="stats" element={<AdminStats />} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
