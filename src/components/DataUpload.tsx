import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Package, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { parseCsvFile, validateSalesData, validateInventoryData, validateReviewData, generateBusinessSummary, type SalesData, type InventoryData, type ReviewData, type BusinessSummary } from '@/lib/data-processing';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface UploadState {
  sales: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error'; data?: SalesData[]; errors?: string[] };
  inventory: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error'; data?: InventoryData[]; errors?: string[] };
  reviews: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error'; data?: ReviewData[]; errors?: string[] };
}

interface DataUploadProps {
  onComplete: (summary: BusinessSummary, data: { sales: SalesData[]; inventory: InventoryData[]; reviews: ReviewData[] }) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onComplete }) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    sales: { file: null, status: 'idle' },
    inventory: { file: null, status: 'idle' },
    reviews: { file: null, status: 'idle' }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const updateUploadState = (type: keyof UploadState, updates: Partial<UploadState[typeof type]>) => {
    setUploadState(prev => ({
      ...prev,
      [type]: { ...prev[type], ...updates }
    }));
  };

  const createDropzone = (type: keyof UploadState, title: string, icon: React.ReactNode, description: string) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      updateUploadState(type, { file, status: 'uploading' });

      try {
        const data = await parseCsvFile(file);
        let validation;
        
        switch (type) {
          case 'sales':
            validation = validateSalesData(data);
            break;
          case 'inventory':
            validation = validateInventoryData(data);
            break;
          case 'reviews':
            validation = validateReviewData(data);
            break;
        }

        if (validation.valid) {
          updateUploadState(type, { status: 'success', data: data as any });
          toast({
            title: `${title} uploaded successfully!`,
            description: `${data.length} records processed`,
          });
        } else {
          updateUploadState(type, { status: 'error', errors: validation.errors });
          toast({
            title: `${title} validation failed`,
            description: validation.errors[0],
            variant: "destructive",
          });
        }
      } catch (error) {
        updateUploadState(type, { status: 'error', errors: ['Failed to parse CSV file'] });
        toast({
          title: "Upload failed",
          description: "Please check your CSV file format",
          variant: "destructive",
        });
      }
    }, [type, title, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
      },
      maxFiles: 1
    });

    const state = uploadState[type];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
            {state.status === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
            {state.status === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
          </div>
          
          <div
            {...getRootProps()}
            className={`upload-zone cursor-pointer ${isDragActive ? 'dragover' : ''} ${state.status === 'success' ? 'border-success bg-success/10' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4">
              <Upload className={`w-12 h-12 ${state.status === 'success' ? 'text-success' : 'text-muted-foreground'}`} />
              
              {state.status === 'idle' && (
                <>
                  <p className="text-lg font-medium">Drop your {title.toLowerCase()} file here</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </>
              )}
              
              {state.status === 'uploading' && (
                <div className="text-center">
                  <p className="text-lg font-medium">Processing...</p>
                  <Progress value={66} className="w-48 mt-2" />
                </div>
              )}
              
              {state.status === 'success' && state.data && (
                <div className="text-center">
                  <p className="text-lg font-medium text-success">✅ Upload Successful!</p>
                  <p className="text-sm text-muted-foreground">{state.data.length} records processed</p>
                </div>
              )}
              
              {state.status === 'error' && (
                <div className="text-center">
                  <p className="text-lg font-medium text-destructive">❌ Upload Failed</p>
                  {state.errors && (
                    <div className="text-sm text-destructive mt-2">
                      {state.errors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {state.file && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{state.file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(state.file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  const allUploadsComplete = uploadState.sales.status === 'success' && 
                           uploadState.inventory.status === 'success' && 
                           uploadState.reviews.status === 'success';

  const handleProceedToAnalysis = async () => {
    if (!allUploadsComplete) return;

    setIsProcessing(true);
    
    try {
      // Generate business summary
      const summary = generateBusinessSummary(
        uploadState.sales.data!,
        uploadState.inventory.data!,
        uploadState.reviews.data!
      );

      // Store data in Firebase (optional - for persistence)
      const sessionData = {
        timestamp: new Date(),
        summary,
        dataStats: {
          salesRecords: uploadState.sales.data!.length,
          inventoryItems: uploadState.inventory.data!.length,
          reviewCount: uploadState.reviews.data!.length
        }
      };

      await addDoc(collection(db, 'business-sessions'), sessionData);

      // Call the completion handler
      onComplete(summary, {
        sales: uploadState.sales.data!,
        inventory: uploadState.inventory.data!,
        reviews: uploadState.reviews.data!
      });

      toast({
        title: "🚀 Data Analysis Ready!",
        description: "Your business intelligence platform is now active",
      });
    } catch (error) {
      console.error('Error processing data:', error);
      toast({
        title: "Processing Error",
        description: "There was an issue processing your data",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Upload Your Business Data
        </h2>
        <p className="text-lg text-muted-foreground">
          Upload your CSV files to unlock AI-powered business insights
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {createDropzone('sales', 'Sales Data', <TrendingUp className="w-6 h-6 text-primary" />, 'CSV with Date, Product, Quantity, Amount columns')}
        {createDropzone('inventory', 'Inventory Data', <Package className="w-6 h-6 text-secondary" />, 'CSV with Product, Stock, Price columns')}
        {createDropzone('reviews', 'Customer Reviews', <MessageCircle className="w-6 h-6 text-accent" />, 'CSV with Date, Rating, Review, Product columns')}
      </div>

      <AnimatePresence>
        {allUploadsComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <Card className="p-8 business-card">
              <div className="space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  🎉
                </motion.div>
                <h3 className="text-xl font-semibold">All Data Uploaded Successfully!</h3>
                <p className="text-muted-foreground">Ready to analyze your business with AI</p>
                
                <Button
                  onClick={handleProceedToAnalysis}
                  disabled={isProcessing}
                  className="btn-hero text-lg px-8 py-3"
                >
                  {isProcessing ? 'Processing...' : '🤖 Start AI Analysis'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataUpload;