"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";

interface FileSubmitProps {
  onSubmit: (file: File) => void;
}

const FileSubmit: React.FC<FileSubmitProps> = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Check file's type is it csv or not
      if (file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid CSV file.");
        event.target.value = "";
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file before submitting.");
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const text = e.target.result as string;

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("Parsed CSV Data:", result.data);
            onSubmit(result.data as Record<string, string>[]);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    // <form onSubmit={handleSubmit} className="flex flex-col gap-2">
    //   <Label htmlFor="file-upload">Upload a File</Label>
    //   <Input id="file-upload" type="file" onChange={handleFileChange} />
    //   <Button type="submit">Submit</Button>
    // </form>
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor="csv-upload">Upload CSV File</Label>
      <Input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <Button type="submit" disabled={!selectedFile}>
        Submit CSV
      </Button>
    </form>
  );
};

export default function Home() {
  // const handleFileSubmit = (file: File) => {
  //   console.log("File submitted:", file);
  //   console.log(file.name);
  //   // Add your upload logic here, e.g., API call
  // };
  const handleFileSubmit = (data: Record<string, string>[]) => {
    console.log("Processed Data from CSV:", data);
    // Example: Use the data
    // You can send it to an API, display it, etc.
  };

  return (
    <div className="flex w-screen h-screen bg-white  justify-center items-center">
      <div className="w-52 h-auto flex flex-col gap-2">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
        <Button>Click me!</Button>
      </div>
      <FileSubmit onSubmit={handleFileSubmit} />
    </div>
  );
}
