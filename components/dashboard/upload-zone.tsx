"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, FileSpreadsheet, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

interface UploadZoneProps {
  onDataParsed: (data: any) => void;
}

export default function UploadZone({ onDataParsed }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        // Extract sheets into a map
        const sheetsData: Record<string, any[]> = {};
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          sheetsData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        });
        
        onDataParsed({ fileName: file.name, sheets: sheetsData });
      } catch (err) {
        console.error("Error parsing excel:", err);
        setError("Failed to parse the Excel file. Please ensure it's a valid .xlsx file.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processFile(file);
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-20">
      <div 
        className={`w-full p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging 
            ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]" 
            : "border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800/50 hover:border-neutral-600"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
      >
        <div className="p-4 bg-neutral-800 rounded-full mb-4 relative">
          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-500' : 'text-neutral-400'}`} />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          {isProcessing ? "Processing Data..." : "Upload Dashboard Data"}
        </h3>
        <p className="text-neutral-400 text-center mb-6 max-w-md">
          Drag and drop your KPI Excel file here, or click to browse. We support .xlsx files directly exported from the system.
        </p>
        
        <label className="cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx, .xls" 
            onChange={handleFileInput}
            disabled={isProcessing}
          />
          <div className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Select Excel File
          </div>
        </label>
      </div>
      
      {error && (
        <div className="mt-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}
