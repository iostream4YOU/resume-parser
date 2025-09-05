import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessingStatus({ files, processingStatus, currentFileIndex }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-200';
      case 'processing':
        return 'bg-blue-100 border-blue-200';
      case 'failed':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const completedFiles = processingStatus.filter(status => status === 'completed').length;
  const overallProgress = (completedFiles / files.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Resumes</h2>
        <p className="text-gray-600">Please wait while we extract data from your files</p>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-600">{completedFiles} of {files.length} completed</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-300 ${getStatusColor(processingStatus[index])}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(processingStatus[index])}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {processingStatus[index] || 'waiting'}
                  </div>
                </div>
                
                {processingStatus[index] === 'processing' && (
                  <div className="mt-3">
                    <Progress value={undefined} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}