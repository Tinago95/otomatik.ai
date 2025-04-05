"use client"; // Because FunctionForm is a client component and we use client hooks here

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FunctionForm from '@/components/functions/FunctionForm'; // Adjust path
import type { FunctionFormData } from '@/schemas/function'; // Adjust path
import { ChevronLeft } from 'lucide-react';

export default function NewFunctionPage() {
  const router = useRouter();

  // This is where you'll integrate with your API
  const handleCreateFunction = async (data: FunctionFormData) => {
    console.log("Creating function with data:", data);
    // --- TODO: Replace with actual API call ---
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      const fakeNewId = `fn-${Date.now()}`; // Get actual ID from API response
      console.log("Function created successfully! ID:", fakeNewId);
      // Redirect to the function detail/edit page after successful creation
       router.push(`/functions/${fakeNewId}`); // Adjust route as needed
       // You might want to show a success toast here before redirecting
    } catch (error) {
      console.error("Failed to create function:", error);
      // TODO: Display an error message to the user (e.g., using a toast library)
       alert(`Error creating function: ${error instanceof Error ? error.message : 'Unknown error'}`);
       // Re-throw the error if FunctionForm needs to know about it to stop isSubmitting state
       throw error;
    }
    // --- End of API call simulation ---
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <Link href="/functions" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
           <ChevronLeft size={16} className="mr-1"/> Back to Functions
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800">
            Create New Function
        </h1>
      </div>

      {/* Render the form */}
      <FunctionForm onSubmit={handleCreateFunction} />
    </div>
  );
}
