import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, IndianRupee, Sparkles, Brain, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DataUpload from '@/components/DataUpload';
import DemoLoader from '@/components/DemoLoader';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';
import heroImage from '@/assets/hero-business.jpg';
import aiImage from '@/assets/ai-brain.jpg';

interface LandingProps {
  onDataComplete: (summary: BusinessSummary, data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }) => void;
}

const Landing: React.FC<LandingProps> = ({ onDataComplete }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleGetStarted = () => {
    setShowUpload(true);
  };

  if (showUpload) {
    return (
      <div>
        <DataUpload onComplete={onDataComplete} />
        <DemoLoader onLoadDemo={onDataComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Indian SME Business" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-6xl font-bold mb-6"
              >
                <span className="block text-white">🤖 Vyaaparik</span>
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  The Next Gen AI for Indian SMEs
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-white/90 mb-8 leading-relaxed"
              >
                Transform your business decisions with AI-powered insights. 
                Upload your data and get ChatGPT-like analysis tailored for Indian businesses.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button 
                  onClick={handleGetStarted}
                  className="btn-hero text-lg px-8 py-4"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start AI Analysis
                </Button>
                <Button 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src={aiImage} 
                  alt="AI Brain" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-glow"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center"
                >
                  <Brain className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Card className="business-card text-center p-8 float-animation">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">63M+</h3>
              <p className="text-muted-foreground">Indian SMEs Ready for AI</p>
            </Card>

            <Card className="business-card text-center p-8 float-animation" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-gradient-business rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-2">₹1000Cr+</h3>
              <p className="text-muted-foreground">Market Opportunity</p>
            </Card>

            <Card className="business-card text-center p-8 float-animation" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">3x</h3>
              <p className="text-muted-foreground">Faster Decision Making</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Powerful AI Features for Your Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Upload your sales, inventory, and review data to unlock comprehensive business intelligence
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="business-card p-8 h-full">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sales Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Deep dive into your sales performance with AI-powered insights. Identify trends, 
                  seasonal patterns, and growth opportunities specific to your business.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Revenue trend analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Product performance insights
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Customer behavior patterns
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="business-card p-8 h-full">
                <div className="w-12 h-12 bg-gradient-business rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Inventory Optimization</h3>
                <p className="text-muted-foreground mb-6">
                  Smart inventory management powered by AI. Get alerts for low stock, 
                  optimize ordering patterns, and reduce holding costs.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Stock level optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Demand forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Supplier performance analysis
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="business-card p-8 h-full">
                <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Customer Intelligence</h3>
                <p className="text-muted-foreground mb-6">
                  Understand your customers better with sentiment analysis and review insights. 
                  Improve satisfaction and build stronger relationships.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    Sentiment analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    Review trend monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    Customer satisfaction scores
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of Indian SMEs already using AI to make smarter business decisions
            </p>
            <Button 
              onClick={handleGetStarted}
              className="btn-hero text-lg px-12 py-4"
            >
              <Brain className="w-5 h-5 mr-2" />
              Get Started with AI Analysis
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;