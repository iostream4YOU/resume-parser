import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, ArrowLeft, CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ParsingMethodSelector({ selectedMethod, onMethodSelect, onBack }) {
  const methods = [
    {
      id: "ai_powered",
      title: "AI-Powered Parsing",
      description: "Advanced AI analysis for structured data",
      icon: Sparkles,
      features: ["Intelligent field detection", "Structured JSON output", "High accuracy", "Handles complex layouts"],
      estimatedTime: "10-30 seconds",
      recommended: true
    },
    {
      id: "ocr",
      title: "OCR + AI Parsing",
      description: "OCR text extraction + AI structuring",
      icon: FileText,
      features: ["OCR text extraction", "AI structuring", "Great for scanned documents", "Structured JSON output"],
      estimatedTime: "15-35 seconds",
      recommended: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Parsing Method</h2>
        <p className="text-gray-600">Select how you want to extract data from your resumes</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedMethod === method.id 
                ? "ring-2 ring-black border-black" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onMethodSelect(method.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedMethod === method.id ? "bg-black" : "bg-gray-100"
                  }`}>
                    <method.icon className={`w-5 h-5 ${
                      selectedMethod === method.id ? "text-white" : "text-gray-600"
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {method.title}
                      {method.recommended && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="w-6 h-6 text-black" />
                )}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Est. time: {method.estimatedTime}</span>
                </div>

                <ul className="space-y-2">
                  {method.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </Button>
        
        <Button 
          onClick={() => onMethodSelect(selectedMethod)}
          className="bg-black hover:bg-black/90 text-white flex items-center gap-2"
          disabled={!selectedMethod}
        >
          <Zap className="w-4 h-4" />
          Continue with {selectedMethod === "ai_powered" ? "AI Parsing" : "OCR + AI"}
        </Button>
      </div>
    </motion.div>
  );
}