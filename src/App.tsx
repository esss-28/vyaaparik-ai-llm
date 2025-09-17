import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from "@/lib/data-processing";

const queryClient = new QueryClient();

const App = () => {
  const [businessSummary, setBusinessSummary] = useState<BusinessSummary | null>(null);
  const [businessData, setBusinessData] = useState<{
    sales: SalesData[];
    inventory: InventoryData[];
    reviews: ReviewData[];
  } | null>(null);

  const handleDataComplete = (
    summary: BusinessSummary, 
    data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }
  ) => {
    setBusinessSummary(summary);
    setBusinessData(data);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                businessSummary && businessData ? 
                  <Chat businessSummary={businessSummary} businessData={businessData} /> :
                  <Landing onDataComplete={handleDataComplete} />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
