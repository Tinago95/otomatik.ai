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
    
    try {
      const response = await fetch('/api/functions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create function: ${response.statusText}`);
      }

      const newFunction = await response.json();
      console.log("Function created successfully! ID:", newFunction.id);
      
      // Redirect to the function detail/edit page after successful creation
      router.push(`/functions/${newFunction.id}`);
      
    } catch (error) {
      console.error("Failed to create function:", error);
      alert(`Error creating function: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
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
