import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

export default function FileUploadZone({ onFileSelect, dragActive, setDragActive }) {
  const fileInputRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); if (e.currentTarget === e.target) setDragActive(false); };
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  
  const handleDrop = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.type === "application/pdf");
    
    if (validFiles.length === 0 && files.length > 0) {
      alert("Please upload only PDF files.");
      return;
    }
    
    if (validFiles.length > 0) onFileSelect(validFiles);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type === "application/pdf");
    
    if (validFiles.length === 0 && files.length > 0) {
      alert("Please upload only PDF files.");
      return;
    }
    
    if (validFiles.length > 0) onFileSelect(validFiles);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-10 transition-colors ${dragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <input ref={fileInputRef} type="file" multiple accept=".pdf" onChange={handleFileInputChange} className="hidden" />

      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-black flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-semibold mb-2">{dragActive ? "Drop your resumes here" : "Upload Resume Files"}</h3>

        <p className="text-gray-600 mb-6">
          Drag & drop your PDF resume files or{" "}
          <button onClick={handleBrowseClick} className="text-black font-medium underline">
            browse to upload
          </button>
        </p>

        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200">
            <FileText className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">PDF</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Supports PDF resume files only
        </p>

        <Button onClick={handleBrowseClick} size="lg" className="px-6 py-5 rounded-md bg-black text-white hover:bg-black/90">
          Select Resume Files
        </Button>
      </div>
    </div>
  );
}