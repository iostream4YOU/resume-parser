
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Sparkles, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ResultsTable({ resumes, onDownload, onPreview }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-gray-900 text-white">Completed</Badge>;
      case "processing":
        return <Badge className="bg-gray-200 text-gray-800">Processing</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border border-red-300">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-300">Unknown</Badge>;
    }
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case "ai_powered":
        return <Badge className="bg-purple-100 text-purple-800">AI Powered</Badge>;
      case "ocr":
        return <Badge className="bg-blue-100 text-blue-800">OCR + AI</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getFileIcon = (filename) => {
    // Reverted to PDF-only support, always show PDF icon style
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">File Name</TableHead>
            <TableHead className="font-semibold">Method</TableHead> {/* Added Method Header */}
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Confidence</TableHead>
            <TableHead className="font-semibold">Processing Time</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume) => (
            <TableRow key={resume.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center">
                    {getFileIcon(resume.original_filename)}
                  </div>
                  <div>
                    <p className="font-medium">{resume.original_filename}</p>
                    <p className="text-xs text-gray-500">
                      {/* Reverted to PDF-only support, always display "PDF file" */}
                      PDF file
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>{getMethodBadge(resume.parsing_method)}</TableCell> {/* Added Method Cell */}

              <TableCell>{getStatusBadge(resume.parsing_status)}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${resume.confidence_score || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{resume.confidence_score || 0}%</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1 text-gray-700">
                  <Clock className="w-3 h-3" />
                  <span className="text-sm">{resume.processing_time?.toFixed(1) || 0}s</span>
                </div>
              </TableCell>

              <TableCell className="text-sm text-gray-700">
                {format(new Date(resume.created_date), "MMM d, yyyy")}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onPreview(resume)} className="border-gray-300">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(resume)}
                    className="border-gray-300"
                    disabled={resume.parsing_status !== "completed"}
                    title={resume.parsing_status !== "completed" ? `Cannot download - Status: ${resume.parsing_status}` : "Download parsed data"}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
