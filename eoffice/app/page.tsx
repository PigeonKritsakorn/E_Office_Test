"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Papa from "papaparse";

export default function Home() {
  const [table1, setTable1] = useState<Record<string, string>[]>([]);
  const [table2, setTable2] = useState<Record<string, string>[]>([]);
  const [generatedCsv, setGeneratedCsv] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setTable: React.Dispatch<React.SetStateAction<Record<string, string>[]>>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "text/csv") {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const csvText = e.target.result as string;

            // Parse the CSV file
            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              complete: (result) => {
                console.log("Parsed CSV Data:", result.data);
                setTable(result.data as Record<string, string>[]);
              },
              error: (error) => {
                console.error("Error parsing CSV:", error);
              },
            });
          }
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid CSV file.");
        event.target.value = "";
      }
    }
  };

  const handleGenerateCsv = () => {
    if (table1.length === 0 || table2.length === 0) {
      alert("Please upload both CSV files before generating.");
      return;
    }

    // Perform "VLOOKUP"-style matching: Match a common key from table1 with table2
    const lookupKey = "Runner ID"; // Column to match
    const additionalColumn = "Details"; // Column to add from table2
    console.log(
      "Table1 Keys:",
      table1.map((row) => row[lookupKey])
    );
    console.log(
      "Table2 Keys:",
      table2.map((row) => row[lookupKey])
    );

    // Create a lookup map from table2
    const lookupMap = table2.reduce(
      (map, row) => {
        if (row[lookupKey]) {
          map[row[lookupKey]] = row[additionalColumn];
        }
        return map;
      },
      {} as Record<string, string>
    );

    // // Add the matched data to table1
    // const mergedData = table1.map((row) => ({
    //   ...row,
    //   [additionalColumn]: lookupMap[row[lookupKey]] || "Not Found", // Add data or mark as "Not Found"
    // }));
    const mergedData = table1.map((row) => {
      const lookupValue = lookupMap[row[lookupKey]] || "Not Found"; // Get the matched value or default to "Not Found"

      // Reorder columns explicitly to insert the new column in the desired position
      const { Name, Age, ...rest } = row; // Destructure columns to control their order
      return {
        "Runner ID": row["Runner ID"],
        Name,
        Details: lookupValue, // Insert new column here
        Age,
        ...rest, // Include the remaining columns
      };
    });

    // Convert merged data to CSV
    const csv = Papa.unparse(mergedData);
    console.log("Generated CSV Content:", csv);

    // Create a downloadable CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    setGeneratedCsv(url);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <div className="flex flex-col gap-2">
        <Label htmlFor="csv-upload-1">Upload Table 1 (CSV)</Label>
        <Input
          id="csv-upload-1"
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, setTable1)}
        />

        <Label htmlFor="csv-upload-2">Upload Table 2 (CSV)</Label>
        <Input
          id="csv-upload-2"
          type="file"
          accept=".csv"
          onChange={(e) => handleFileChange(e, setTable2)}
        />

        <Button
          onClick={handleGenerateCsv}
          disabled={table1.length === 0 || table2.length === 0}
        >
          Generate Merged CSV
        </Button>
        {generatedCsv && (
          <a href={generatedCsv} download="merged.csv">
            <Button>Download Merged CSV</Button>
          </a>
        )}
      </div>
    </div>
  );
}
