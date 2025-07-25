import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Import Login page
import Signup from "./pages/Signup"; // Import Signup page
import InterviewPage from "./pages/InterviewPage";
import React, { useEffect, useState, useRef } from "react";
import Loader from "@/components/ui/Loader";
import Contact from './pages/Contact';
import LoginSuccess from "./pages/LoginSuccess";
import { AuthProvider } from './components/AuthContext';

const queryClient = new QueryClient();

function AppWithLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Start as true for initial load
  const prevPathname = useRef(location.pathname);

  // Show loader on initial mount
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500); // 1.5s loader on first load
    return () => clearTimeout(timeout);
  }, []);

  // Show loader on route change
  useEffect(() => {
    if (location.pathname !== prevPathname.current) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 2000);
      prevPathname.current = location.pathname;
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return (
    <>
      
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#000', // Solid black background
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Loader />
        </div>
      )}
     
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/signup" element={<Signup />} /> {/* Signup route */}
        <Route path="/interview/:topic" element={<InterviewPage />} /> {/* Interview route */}
        <Route path="/contact" element={<Contact />} /> {/* Contact route */}
        <Route path="/login-success" element={<LoginSuccess />} /> {/* Google OAuth2 JWT handler */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppWithLoader />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
