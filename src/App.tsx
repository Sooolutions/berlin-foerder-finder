
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Alle Seiten außer der Startseite werden erst bei Bedarf geladen. Das spart
// auf langsamen Verbindungen und älteren Handys spürbar Ladezeit.
const Questionnaire = lazy(() => import("./pages/Questionnaire"));
const Results = lazy(() => import("./pages/Results"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Themen = lazy(() => import("./pages/Themen"));
const Thema = lazy(() => import("./pages/Thema"));

/**
 * Solange eine Seite nachlädt, bleibt das vorgerenderte HTML aus dem Build
 * sichtbar (siehe main.tsx). So gibt es auf /hilfe und /blog kein weißes Aufblitzen.
 */
const PrerenderFallback = () =>
  window.__PRERENDER_HTML__ ? <div dangerouslySetInnerHTML={{ __html: window.__PRERENDER_HTML__ }} /> : null;
import ConstructionNotice from "@/components/layout/ConstructionNotice";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Wer weniger Bewegung eingestellt hat, bekommt nur Überblendungen */}
    <MotionConfig reducedMotion="user">
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConstructionNotice />
      <BrowserRouter>
        <QuestionnaireProvider>
          <Suspense fallback={<PrerenderFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/results" element={<Results />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/hilfe" element={<Themen />} />
            <Route path="/hilfe/:slug" element={<Thema />} />
            <Route path="/about" element={<About />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </QuestionnaireProvider>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
    </LanguageProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
