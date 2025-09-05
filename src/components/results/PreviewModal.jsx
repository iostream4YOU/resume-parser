import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, FileText } from "lucide-react";

// Recursive component to render JSON data beautifully
const JsonViewer = ({ data, level = 0 }) => {
  if (data === null || data === undefined) {
    return <span className="text-gray-500">null</span>;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return <span className={typeof data === 'string' ? 'text-green-700' : 'text-blue-700'}>{JSON.stringify(data)}</span>;
  }

  if (Array.isArray(data)) {
    return (
      <div className={`pl-4 ${level > 0 ? 'border-l border-gray-200' : ''}`}>
        <span className="text-gray-500">[</span>
        {data.map((item, index) => (
          <div key={index} className="pl-4">
            <JsonViewer data={item} level={level + 1} />
            {index < data.length - 1 && <span className="text-gray-500">,</span>}
          </div>
        ))}
        <span className="text-gray-500">]</span>
      </div>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    return (
      <div className={`pl-4 ${level > 0 ? 'border-l border-gray-200' : ''}`}>
        <span className="text-gray-500">{'{'}</span>
        {keys.map((key, index) => (
          <div key={key} className="pl-4">
            <span className="font-semibold text-purple-800">"{key}"</span>
            <span className="text-gray-500">: </span>
            <JsonViewer data={data[key]} level={level + 1} />
            {index < keys.length - 1 && <span className="text-gray-500">,</span>}
          </div>
        ))}
        <span className="text-gray-500">{'}'}</span>
      </div>
    );
  }

  return null;
};

export default function PreviewModal({ resume, isOpen, onClose, onDownload }) {
  if (!resume || !resume.parsed_data) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(resume.parsed_data, null, 2));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {resume.original_filename}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={resume.parsing_method === "ocr" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}>
                  {resume.parsing_method === "ocr" ? "OCR + AI" : "AI Powered"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Confidence: {resume.confidence_score}%
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyJson} variant="outline" className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy JSON
              </Button>
              <Button onClick={() => onDownload(resume)} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download JSON
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto">
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border">
            <JsonViewer data={resume.parsed_data} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}