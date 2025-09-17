import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, TrendingUp, BarChart3, Lightbulb, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { queryGemini, type GeminiResponse } from '@/lib/gemini';
import { type BusinessSummary, type SalesData, type InventoryData, type ReviewData } from '@/lib/data-processing';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  response?: GeminiResponse;
}

interface ChatInterfaceProps {
  businessSummary: BusinessSummary;
  businessData: {
    sales: SalesData[];
    inventory: InventoryData[];
    reviews: ReviewData[];
  };
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ businessSummary, businessData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: `Welcome to Vyaaparik AI! 🚀 I've analyzed your business data and I'm ready to help you make smarter decisions. 

📊 **Your Business Overview:**
• Total Revenue: ₹${businessSummary.totalRevenue.toLocaleString('en-IN')}
• Orders: ${businessSummary.totalOrders}
• Average Order Value: ₹${businessSummary.averageOrderValue.toFixed(0)}
• Customer Rating: ${businessSummary.averageRating.toFixed(1)}/5

Ask me anything about your business performance, trends, or get recommendations to grow your business!`,
      timestamp: new Date(),
      response: {
        insights: "Your business data has been successfully analyzed",
        analysis: "I have comprehensive insights about your sales, inventory, and customer feedback ready for analysis",
        recommendations: [
          "Ask about sales trends",
          "Inquire about inventory optimization", 
          "Get customer satisfaction insights",
          "Request growth recommendations"
        ]
      }
    };
    
    setMessages([welcomeMessage]);
  }, [businessSummary]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const contextData = {
        businessSummary,
        sampleSalesData: businessData.sales.slice(0, 10), // Send sample for context
        sampleInventoryData: businessData.inventory.slice(0, 10),
        sampleReviews: businessData.reviews.slice(0, 10)
      };

      const response = await queryGemini(inputValue, contextData);

      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.analysis,
        timestamp: new Date(),
        response
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try your question again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Response Error",
        description: "Please try your question again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestionButtons = [
    "Why are my sales declining this month?",
    "Which products should I restock first?",
    "How can I improve customer satisfaction?",
    "Generate a marketing campaign idea",
    "Analyze my competitor positioning",
    "Suggest pricing optimizations"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-lg p-4"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vyaaparik AI</h1>
              <p className="text-sm text-muted-foreground">Business Intelligence Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/20 text-success">
              <TrendingUp className="w-3 h-3 mr-1" />
              Sales ✓
            </Badge>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              <BarChart3 className="w-3 h-3 mr-1" />
              Inventory ✓
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              <Lightbulb className="w-3 h-3 mr-1" />
              Reviews ✓
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <Card className={`max-w-2xl p-4 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'business-card'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-sm font-medium">
                        {message.type === 'user' ? 'You' : 'Vyaaparik AI'}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.response && message.response.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          Quick Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {message.response.recommendations.slice(0, 3).map((rec, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(rec)}
                            >
                              {rec}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="business-card p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Vyaaparik AI is thinking...</span>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t bg-card/30"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {suggestionButtons.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3 justify-start"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t bg-card/50 backdrop-blur-lg p-4"
      >
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your business performance, trends, or get recommendations..."
              className="h-12 text-base"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="h-12 px-6 btn-hero"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface;