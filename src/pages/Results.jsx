
import React, { useState, useEffect, useCallback } from "react";
import { ResumeData } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, Sparkles, Filter, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ResultsTable from "../components/results/ResultsTable";
import PreviewModal from "../components/results/PreviewModal";

export default function Results() {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResume, setSelectedResume] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadResumes = useCallback(async () => {
    setLoading(true);
    const data = await ResumeData.list("-created_date");
    setResumes(data);
    setLoading(false);
  }, []); // Empty dependency array means this function is created once

  const filterResumes = useCallback(() => {
    let filtered = resumes;
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.original_filename && r.original_filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(r => r.parsing_status === statusFilter);
    }
    setFilteredResumes(filtered);
  }, [resumes, searchTerm, statusFilter]); // Dependencies for filterResumes

  useEffect(() => { loadResumes(); }, [loadResumes]); // useEffect now depends on the memoized loadResumes
  useEffect(() => { filterResumes(); }, [filterResumes]); // useEffect now depends on the memoized filterResumes

  const handleDownload = (resume) => {
    if (!resume.parsed_data) {
      alert("No parsed data available to download.");
      return;
    }
    const blob = new Blob([JSON.stringify(resume.parsed_data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const base = (resume.original_filename || "resume").replace(/\.[^/.]+$/, "");
    link.download = `${base}_parsed.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePreview = (resume) => { setSelectedResume(resume); setShowPreview(true); };

  const handleBulkDownload = () => {
    const completed = filteredResumes.filter(r => r.parsing_status === "completed" && r.parsed_data);
    if (completed.length === 0) {
      alert("No completed resumes with parsed data available for bulk download.");
      return;
    }
    const bulkData = completed.map(resume => ({
      filename: resume.original_filename,
      parsed_data: resume.parsed_data
    }));
    const blob = new Blob([JSON.stringify(bulkData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_parsed_resumes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const completedResumes = resumes.filter(r => r.parsing_status === "completed");
  const stats = {
    total: resumes.length,
    completed: completedResumes.length,
    avgTime: (completedResumes.reduce((sum, r) => sum + (r.processing_time || 0), 0) / (completedResumes.length || 1)).toFixed(1),
    avgConfidence: Math.round(resumes.reduce((s, r) => s + (r.confidence_score || 0), 0) / (resumes.length || 1))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">Loading parsed results...</div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parsed Results</h1>
            <p className="text-gray-600">View and download your extracted resume data</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleBulkDownload} disabled={stats.completed === 0} className="bg-black hover:bg-black/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Bulk Download ({stats.completed})
            </Button>
            <Link to={createPageUrl("Upload")}>
              <Button className="bg-black hover:bg-black/90 text-white">
                <FileText className="w-4 h-4 mr-2" />
                Parse More Resumes
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600">Total Resumes</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600">Avg. Time</p>
            <p className="text-2xl font-bold">{stats.avgTime}s</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-600">Avg. Confidence</p>
            <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2 text-gray-800">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filters</span>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <ResultsTable resumes={filteredResumes} onDownload={handleDownload} onPreview={handlePreview} />

        <PreviewModal
          resume={selectedResume}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
