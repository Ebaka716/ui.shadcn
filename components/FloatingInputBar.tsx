"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Filter, X, FileText, Sheet, File as FileIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Remove Prop Interface again
// interface FloatingInputBarProps {
//   isDesktopCollapsed: boolean;
// }

// Define limits
const MAX_FILES = 5;
const ALLOWED_TYPES = [
  'application/pdf',
  'text/csv',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function FloatingInputBar(/* { isDesktopCollapsed } */) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [focusMode, setFocusMode] = useState("Learning Center");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // --- Helper function to get icon based on MIME type ---
  const getFileIcon = (mimeType: string) => {
    if (!mimeType) return <FileIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />;
    if (mimeType.startsWith('text/csv')) {
      return <Sheet className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />;
    }
    if (mimeType.startsWith('application/pdf') || mimeType.startsWith('text/') || mimeType.includes('document')) {
      return <FileText className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />;
    }
    return <FileIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />; // Default icon
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!inputValue && selectedFiles.length === 0) { 
      console.warn("Submit attempt with no input or file.");
      return; 
    }

    // Construct the query - Include file type if applicable
    let queryToSend = inputValue;
    if (selectedFiles.length > 0) {
      const firstFile = selectedFiles[0];
      const fileInfo = `${firstFile.name}|${firstFile.type || 'application/octet-stream'}`; // Include name and type, fallback type
      if (inputValue) {
        // Format: "Question about filename.ext|mime/type: Actual question"
        queryToSend = `Question about ${fileInfo}: ${inputValue}`;
      } else {
        // Format: "Analyze file: filename.ext|mime/type"
        queryToSend = `Analyze file: ${fileInfo}`;
      }
    }

    // Log the simulated action - Use selectedFiles array
    console.log("Simulating submission with:", {
      type: selectedFiles.length > 0 ? "Attachment Query" : "Text Query",
      question: inputValue, 
      fileNames: selectedFiles.map(f => f.name),
      fileSizes: selectedFiles.map(f => f.size),
      fileTypes: selectedFiles.map(f => f.type),
      constructedQuery: queryToSend, // Log the modified query
      focusMode: focusMode,
    });

    // Navigate using the constructed query
    router.push(`/results?query=${encodeURIComponent(queryToSend)}&focus=${encodeURIComponent(focusMode)}`);
    
    // Clear state after submission
    setInputValue("");
    setSelectedFiles([]); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      // No files selected or dialog cancelled
      if (event.target) event.target.value = "";
      return;
    }

    const currentFileCount = selectedFiles.length;
    const filesToAdd: File[] = [];
    let validationFailed = false;

    // Convert FileList to Array and iterate
    Array.from(files).forEach(file => {
      // Check overall limit first
      if (currentFileCount + filesToAdd.length >= MAX_FILES) {
        if (!validationFailed) { // Show only once per batch
          alert(`Cannot add more files. Maximum is ${MAX_FILES}.`);
          validationFailed = true; 
        }
        return; // Stop processing further files in this batch
      }

      // Validation: Type Check
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Invalid file type for ${file.name}. Allowed: PDF, CSV, TXT, DOCX`);
        validationFailed = true;
        return; // Skip this file, continue checking others
      }

      // Validation: Size Check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File ${file.name} is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        validationFailed = true;
        return; // Skip this file
      }

      // If valid and within limit, add to temporary list
      filesToAdd.push(file);
    });

    // Update state only if new valid files were found and no critical failure occurred
    if (filesToAdd.length > 0) {
        setSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd]);
        console.log(`${filesToAdd.length} valid file(s) added.`);
    }

    // Always reset the input value to allow re-selecting same file(s)
    if(event.target) {
      event.target.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => { 
    console.log("Removing file at index:", indexToRemove);
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    // No need to clear fileInputRef.current.value here, as it's already cleared after selection
  };

  return (
    <div className={cn(
      "sticky bottom-0 mt-6 z-10"
    )}>
      <div className="max-w-[800px] mx-auto pointer-events-auto">
        <form
          onSubmit={handleFormSubmit}
          className="w-full"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            hidden 
            multiple
            accept=".pdf,.csv,.txt,.docx"
          />

          <div className={cn(
            "rounded-lg shadow-xl bg-card overflow-hidden flex flex-col transition-colors duration-200",
            isFocused ? "border border-neutral-400 dark:border-neutral-600" : "border dark:border-neutral-800",
            selectedFiles.length > 0 && "rounded-b-none"
          )}>
            {selectedFiles.length > 0 && (
              <div className="px-3 pb-2 pt-2 bg-card border-b border-neutral-400 dark:border-neutral-800 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="inline-flex items-center pl-1.5 pr-1 py-0.5 h-6 text-xs"
                  >
                    {getFileIcon(file.type)}
                    <span className="font-normal mr-1 truncate" style={{ maxWidth: '100px' }}>{file.name}</span>
                    <Button 
                       type="button"
                       variant="ghost"
                       size="icon"
                       className="h-4 w-4 text-muted-foreground hover:text-destructive hover:bg-transparent p-0 ml-1 flex-shrink-0"
                       onClick={() => handleRemoveFile(index)}
                       aria-label={`Remove ${file.name}`}
                    >
                       <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center h-14 px-3 gap-2">
              <Input
                type="text"
                placeholder="Ask follow-up questions..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="h-full flex-grow border-none outline-none shadow-none ring-0 focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-0"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-9 w-9"
                disabled={!inputValue}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>

            <div className="flex items-center h-10 px-3 gap-2">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "flex-shrink-0 hover:bg-muted rounded-full",
                      selectedFiles.length > 0 && "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-muted rounded-full">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Focus Options ({focusMode})</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white px-3 py-1.5 text-xs rounded-md">
                    <p>Focus Options</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="start" className="bg-white dark:bg-neutral-900">
                  <DropdownMenuLabel>Focus</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setFocusMode("Learning Center")}>Learning Center</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("MyGPS")}>MyGPS</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("Investopedia")}>Investopedia</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFocusMode("My Accounts")}>My Accounts</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <button type="submit" hidden />
        </form>
      </div>
    </div>
  );
}
