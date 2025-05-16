"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import FunctionForm from '@/components/functions/FunctionForm'; // Adjust path
import type { FunctionFormData } from '@/schemas/function'; // Adjust path
import { ChevronLeft, AlertCircle } from 'lucide-react';

// Props passed by App Router for dynamic segments
interface EditFunctionPageProps {
  params: {
    id: string; // The function ID from the URL
  };
}

export default function EditFunctionPage({ params }: EditFunctionPageProps) {
  const { id: functionId } = params; // Extract function ID

  const [initialValues, setInitialValues] = useState<Partial<FunctionFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch existing function data ---
  const fetchFunctionData = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching data for function ID: ${id}`);
      
      const response = await fetch(`/api/functions/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Function not found');
        throw new Error(`Failed to fetch function: ${response.statusText}`);
      }
      const data = await response.json(); // Assuming API returns data matching the form schema
      
      setInitialValues(data);

    } catch (err) {
      console.error("Failed to fetch function data:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setInitialValues(undefined); // Clear initial values on error
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed if functionId is stable within useEffect

  useEffect(() => {
    if (functionId) {
      fetchFunctionData(functionId);
    } else {
        // Should not happen with App Router structure, but handle defensively
        setError("Invalid Function ID");
        setIsLoading(false);
    }
  }, [functionId, fetchFunctionData]);

  // --- Handle Form Submission (Update) ---
  const handleUpdateFunction = async (data: FunctionFormData) => {
    console.log(`Updating function ${functionId} with data:`, data);
    setError(null); // Clear previous errors on new submission attempt
    
    try {
      const response = await fetch(`/api/functions/${functionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
         const errorData = await response.json().catch(() => ({})); // Try to get error details
         throw new Error(errorData.message || `Failed to update function: ${response.statusText}`);
      }
      
      const updatedFunction = await response.json();
      console.log("Function updated successfully:", updatedFunction);

      // Optional: Show success message (e.g., toast)
      alert('Function updated successfully!');
      
      // Update the initialValues state with the latest data
      setInitialValues(updatedFunction);

    } catch (error) {
      console.error("Failed to update function:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during update';
      setError(errorMessage); // Set error to display near the form
      alert(`Error updating function: ${errorMessage}`); // Simple feedback for now
      // Re-throw error so RHF knows submission failed and doesn't reset isSubmitting
      throw error;
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    // TODO: Implement app/functions/[id]/loading.tsx for a better skeleton UI
    return <div className="p-6 text-center">Loading function details...</div>;
  }

  if (error && !initialValues) { // Show error only if loading failed critically
     return (
        <div className="p-6">
             <div className="mb-6">
                <Link href="/functions" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
                   <ChevronLeft size={16} className="mr-1"/> Back to Functions
                </Link>
             </div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );
  }

   if (!initialValues && !isLoading) { // Function not found after loading attempt
        return (
            <div className="p-6">
                <div className="mb-6">
                    <Link href="/functions" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
                       <ChevronLeft size={16} className="mr-1"/> Back to Functions
                    </Link>
                 </div>
                <div className="text-center p-10 bg-white rounded-lg shadow">
                    <AlertCircle size={40} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Function Not Found</h2>
                    <p className="text-gray-600">Could not load configuration for the specified function ID.</p>
                </div>
            </div>
        );
    }


  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <Link href="/functions" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
           <ChevronLeft size={16} className="mr-1"/> Back to Functions
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
            Edit Function: {initialValues?.name || functionId}
        </h1>
        <span className="text-xs text-gray-500 font-mono">ID: {functionId}</span>
      </div>

       {/* Display Update Errors near the top */}
       {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
             <AlertCircle className="h-5 w-5 mr-2" />
             <span className="block sm:inline">Update failed: {error}</span>
          </div>
       )}


      {/* Render the form with initial values */}
      <FunctionForm
        key={functionId} // Add key to force re-render if ID changes (though unlikely here)
        initialValues={initialValues}
        onSubmit={handleUpdateFunction}
        isLoadingExternally={isLoading} // Pass loading state if form needs to be disabled during fetch
      />

      {/* TODO: Add sections for Deployment History, Testing Console, Logs specific to this function */}
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">More Actions (Coming Soon)</h2>
          <div className="flex space-x-4">
              <button disabled className="px-4 py-2 text-sm bg-gray-300 text-gray-600 rounded cursor-not-allowed">Deploy</button>
              <button disabled className="px-4 py-2 text-sm bg-gray-300 text-gray-600 rounded cursor-not-allowed">Test</button>
              <button disabled className="px-4 py-2 text-sm bg-gray-300 text-gray-600 rounded cursor-not-allowed">View Logs</button>
               <button disabled className="px-4 py-2 text-sm bg-red-200 text-red-700 rounded cursor-not-allowed">Delete</button>
          </div>
      </div>
    </div>
  );
}
