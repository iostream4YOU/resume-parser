
import React, { useState } from "react";
import { ResumeData } from "@/api/entities";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/api/integrations";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Zap, File } from "lucide-react";

import FileUploadZone from "../components/upload/FileUploadZone";
import ProcessingStatus from "../components/upload/ProcessingStatus";
import ParsingMethodSelector from "../components/upload/ParsingMethodSelector";

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState([]);
  const [currentStep, setCurrentStep] = useState("upload"); // upload, method, confirm, processing
  const [selectedMethod, setSelectedMethod] = useState("ai_powered");

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setCurrentStep("method");
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setCurrentStep("confirm");
  };

  const structureTextWithAI = async (documentText, filename, extractionMethod = "AI") => {
    const prompt = `
Analyze the following resume text extracted from the file "${filename}" using ${extractionMethod}.
Convert the content into a well-structured JSON object.
Identify all logical sections such as 'Personal Information', 'Work Experience', 'Education', 'Skills', etc., and represent them as keys in the JSON.
For lists like work history or education, use arrays of objects.
Be thorough and extract every piece of information available.
Ensure the final output is a clean, human-readable, and comprehensive JSON representation of the resume's content.

DO NOT include a 'textCv' field in your response as it will be added separately.

Resume Text:
---
${documentText}
---`;

    const result = await InvokeLLM({
      prompt,
      response_json_schema: { type: "object", description: "A dynamically structured JSON object representing the resume." }
    });

    return result;
  };

  const parseWithAI = async (fileUrl, filename) => {
    try {
      // Extract raw text from the PDF document
      const textExtractionResult = await ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: { type: "object", properties: { document_text: { type: "string" } } }
      });

      if (textExtractionResult.status !== 'success' || !textExtractionResult.output?.document_text) {
        throw new Error(`Failed to extract text from ${filename}. The file might be empty, corrupted, or an image-based PDF.`);
      }
      const documentText = textExtractionResult.output.document_text;

      const structuredData = await structureTextWithAI(documentText, filename);
      
      // Add the raw text as textCv field
      return {
        ...structuredData,
        textCv: documentText
      };
    } catch (error) {
      console.error(`AI parsing error for ${filename}:`, error);
      throw error;
    }
  };

  const parseWithOCR = async (fileUrl, filename) => {
    try {
      // Use OCR to extract text from the PDF document
      const textExtractionResult = await ExtractDataFromUploadedFile({
        file_url: fileUrl,
        json_schema: { 
          type: "object", 
          properties: { 
            document_text: { type: "string" },
            raw_content: { type: "string" }
          } 
        }
      });

      if (textExtractionResult.status !== 'success') {
        throw new Error(`OCR extraction failed for ${filename}: ${textExtractionResult.details || 'Unknown error'}`);
      }

      const extractedText = textExtractionResult.output?.document_text || textExtractionResult.output?.raw_content || "";
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(`No text content found in ${filename}. The file might be empty or contain only images.`);
      }

      const structuredData = await structureTextWithAI(extractedText, filename, "OCR");
      
      return {
        ...structuredData,
        textCv: extractedText
      };
    } catch (error) {
      console.error(`OCR parsing error for ${filename}:`, error);
      throw error;
    }
  };

  const handleStartParsing = async () => {
    setIsProcessing(true);
    setCurrentStep("processing");
    setProcessingStatus(new Array(files.length).fill("waiting"));

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let currentFileUrl = "";

      try {
        setProcessingStatus(prev => { const a = [...prev]; a[i] = "processing"; return a; });
        const startTime = Date.now();
        const uploadResult = await UploadFile({ file });
        currentFileUrl = uploadResult.file_url;

        let parsedData;
        let confidenceScore = 0;

        if (selectedMethod === "ai_powered") {
          parsedData = await parseWithAI(currentFileUrl, file.name);
          confidenceScore = 95;
        } else if (selectedMethod === "ocr") {
          parsedData = await parseWithOCR(currentFileUrl, file.name);
          confidenceScore = 90; // OCR + AI structuring is very reliable
        }

        const processingTime = (Date.now() - startTime) / 1000;

        await ResumeData.create({
          original_filename: file.name,
          file_url: currentFileUrl,
          parsing_method: selectedMethod,
          parsing_status: "completed",
          parsed_data: parsedData,
          processing_time: processingTime,
          confidence_score: confidenceScore
        });

        setProcessingStatus(prev => { const a = [...prev]; a[i] = "completed"; return a; });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);

        try {
          await ResumeData.create({
            original_filename: file.name,
            file_url: currentFileUrl,
            parsing_method: selectedMethod,
            parsing_status: "failed",
            parsed_data: { error: error.message },
            processing_time: 0,
            confidence_score: 0
          });
        } catch (saveError) {
          console.error(`Failed to save error record for ${file.name}:`, saveError);
        }

        setProcessingStatus(prev => { const a = [...prev]; a[i] = "failed"; return a; });
      }
    }

    setTimeout(() => navigate(createPageUrl("Results")), 1000);
  };

  const resetUpload = () => {
    setFiles([]);
    setIsProcessing(false);
    setProcessingStatus([]);
    setCurrentStep("upload");
    setSelectedMethod("ai_powered");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume Parser</h1>
          <p className="text-gray-600">Upload your resumes for intelligent data extraction</p>
        </div>

        {currentStep === "upload" && (
          <FileUploadZone onFileSelect={handleFileSelect} dragActive={dragActive} setDragActive={setDragActive} />
        )}

        {currentStep === "method" && (
          <ParsingMethodSelector 
            selectedMethod={selectedMethod} 
            onMethodSelect={handleMethodSelect}
            onBack={() => setCurrentStep("upload")}
          />
        )}

        {currentStep === "confirm" && (
          <div className="text-center bg-white border rounded-lg p-8 space-y-6">
              <h2 className="text-2xl font-semibold">Ready to Parse</h2>
              <div className="text-sm text-gray-600 mb-4">
                Using {selectedMethod === "ai_powered" ? "AI-Powered" : "OCR"} parsing method
              </div>
              <ul className="space-y-2">
                {files.map((file, i) => (
                    <li key={i} className="flex items-center justify-center gap-2 text-gray-700">
                        <File className="w-4 h-4" />
                        <span>{file.name}</span>
                    </li>
                ))}
              </ul>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setCurrentStep("method")}>
                  Back to Method Selection
                </Button>
                <Button onClick={handleStartParsing} size="lg" className="bg-black hover:bg-black/90 text-white">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Parsing {files.length} Resume{files.length > 1 ? "s" : ""}
                </Button>
              </div>
          </div>
        )}
        
        {currentStep === "processing" && (
          <ProcessingStatus files={files} processingStatus={processingStatus} />
        )}

        {files.length > 0 && currentStep !== "processing" && (
          <div className="text-center mt-6">
            <button onClick={resetUpload} className="text-gray-700 hover:text-black underline">
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
