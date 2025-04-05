"use client"; // This form needs client-side interactivity

import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { functionFormSchema, type FunctionFormData } from '@/schemas/function'; // Adjust path as needed
import { Save, Loader2 } from 'lucide-react'; // Using lucide for icons

interface FunctionFormProps {
  // Allow passing initial values for editing
  initialValues?: Partial<FunctionFormData>;
  // onSubmit prop receives validated data
  onSubmit: (data: FunctionFormData) => Promise<void>;
  // Optional prop to indicate loading state managed by parent (e.g., during initial fetch)
  isLoadingExternally?: boolean;
}

export default function FunctionForm({
  initialValues,
  onSubmit,
  isLoadingExternally = false,
}: FunctionFormProps) {

  const {
    register,
    handleSubmit,
    control, // Keep for potential future controlled components
    reset,
    formState: { errors, isSubmitting, isDirty }, // Use RHF's isSubmitting
  } = useForm<FunctionFormData>({
    resolver: zodResolver(functionFormSchema),
    defaultValues: initialValues || { // Set defaults from schema or initialValues prop
      runtime: 'nodejs18.x',
      handler: 'index.handler',
      timeout: 30,
      memory: 128,
      inputSchema: '{}',
      outputSchema: '{}',
      // name, description, inlineCode should ideally come from initialValues or be empty
      name: '',
      description: '',
      inlineCode: '// Start coding your function here...\n\nexports.handler = async (event) => {\n  // TODO: Implement your function logic\n  const response = {\n    statusCode: 200,\n    body: JSON.stringify(\'Hello from Lambda!\'),\n  };\n  return response;\n};', // Default code stub
    },
  });

  // Reset form if initialValues change (e.g., after fetching data for edit)
  React.useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  // Wrapper for the onSubmit prop to handle async logic potentially
  const handleFormSubmit: SubmitHandler<FunctionFormData> = async (data) => {
    try {
      await onSubmit(data);
      // Optional: reset() can be called here if the parent doesn't redirect
      // reset(data); // Resets the dirty state after successful submit
    } catch (error) {
      console.error("Submission failed:", error);
      // Parent component should ideally handle displaying API errors
    }
  };

  const isLoading = isLoadingExternally || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

      {/* --- Basic Information Section --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Function Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Function Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.name ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
              disabled={isLoading}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600" role="alert">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              type="text"
              {...register("description")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.description ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
              disabled={isLoading}
            />
             {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* --- Configuration Section --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Runtime */}
          <div>
             <label htmlFor="runtime" className="block text-sm font-medium text-gray-700 mb-1">
              Runtime <span className="text-red-500">*</span>
            </label>
            {/* For MVP, this might just be display text or a disabled select */}
             <select
              id="runtime"
               {...register("runtime")}
               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm bg-white ${errors.runtime ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
               disabled // Only one option for MVP
            >
              <option value="nodejs18.x">Node.js 18.x</option>
              {/* Add other runtimes later */}
            </select>
            {errors.runtime && <p className="mt-1 text-xs text-red-600">{errors.runtime.message}</p>}
          </div>

           {/* Handler */}
          <div>
            <label htmlFor="handler" className="block text-sm font-medium text-gray-700 mb-1">
              Handler <span className="text-red-500">*</span>
            </label>
            <input
              id="handler"
              type="text"
              placeholder="index.handler"
              {...register("handler")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.handler ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
              disabled={isLoading}
            />
             {errors.handler && <p className="mt-1 text-xs text-red-600">{errors.handler.message}</p>}
          </div>

          {/* Timeout */}
           <div>
            <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1">
              Timeout (seconds) <span className="text-red-500">*</span>
            </label>
            <input
              id="timeout"
              type="number"
              {...register("timeout", { valueAsNumber: true })} // Ensure value is treated as number
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.timeout ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
              disabled={isLoading}
              step="1"
            />
             {errors.timeout && <p className="mt-1 text-xs text-red-600">{errors.timeout.message}</p>}
          </div>

           {/* Memory */}
          <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700 mb-1">
              Memory (MB) <span className="text-red-500">*</span>
            </label>
            <input
              id="memory"
              type="number"
              {...register("memory", { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.memory ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
              disabled={isLoading}
              step="64" // Enforce step based on validation
            />
             {errors.memory && <p className="mt-1 text-xs text-red-600">{errors.memory.message}</p>}
          </div>

        </div>
      </div>

       {/* --- Code Editor Placeholder --- */}
       <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
         <h2 className="text-lg font-semibold mb-4 text-gray-800">Function Code</h2>
         <label htmlFor="inlineCode" className="block text-sm font-medium text-gray-700 mb-1 sr-only">
           Inline Code <span className="text-red-500">*</span>
         </label>
         {/* Replace this textarea with CodeEditor component later */}
         <textarea
           id="inlineCode"
           rows={15}
           {...register("inlineCode")}
           className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 font-mono text-sm ${errors.inlineCode ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
           placeholder="// Your Node.js code here..."
           disabled={isLoading}
           spellCheck="false"
         />
         {errors.inlineCode && <p className="mt-1 text-xs text-red-600">{errors.inlineCode.message}</p>}
       </div>

       {/* --- Input/Output Schema Placeholders --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Schema */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Input Schema (JSON)</h2>
                <label htmlFor="inputSchema" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Input Schema</label>
                {/* Replace with SchemaBuilder later */}
                <textarea
                    id="inputSchema"
                    rows={8}
                    {...register("inputSchema")}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 font-mono text-xs ${errors.inputSchema ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                    placeholder='{ "type": "object", "properties": { ... } }'
                    disabled={isLoading}
                    spellCheck="false"
                />
                {errors.inputSchema && <p className="mt-1 text-xs text-red-600">{errors.inputSchema.message}</p>}
            </div>
            {/* Output Schema */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                 <h2 className="text-lg font-semibold mb-4 text-gray-800">Output Schema (JSON)</h2>
                 <label htmlFor="outputSchema" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Output Schema</label>
                 {/* Replace with SchemaBuilder later */}
                 <textarea
                    id="outputSchema"
                    rows={8}
                    {...register("outputSchema")}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 font-mono text-xs ${errors.outputSchema ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                    placeholder='{ "type": "object", "properties": { ... } }'
                    disabled={isLoading}
                    spellCheck="false"
                 />
                 {errors.outputSchema && <p className="mt-1 text-xs text-red-600">{errors.outputSchema.message}</p>}
            </div>
       </div>


      {/* --- Submit Button --- */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading || !isDirty} // Disable if loading or form hasn't changed
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          ) : (
            <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          )}
          {isSubmitting ? 'Saving...' : 'Save Function'}
        </button>
      </div>
    </form>
  );
}
