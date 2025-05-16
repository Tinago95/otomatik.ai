"use client";

import React from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { functionFormSchema, type FunctionFormData } from '@/schemas/function';
import { Save, Loader2, Info, Github, Code, Lock } from 'lucide-react';
import Link from 'next/link';

// Import the new components
import CodeEditor from './CodeEditor';
import SchemaBuilder from './SchemaBuilder';

// --- Mock Data (Replace with fetched data) ---
const availableCredentials = [
    { id: 'cred_abc', name: 'Shared API Key - Service X' },
    { id: 'cred_def', name: 'Database ReadOnly User' },
];
// --- ---

// Simple placeholder for TestConsole until it's implemented
interface TestConsoleProps {
    functionId?: string;
}

const TestConsolePlaceholder = ({ functionId }: TestConsoleProps) => (
     <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500 text-sm">
        <p>Test Console</p>
        <p>(Inputs based on Schema, Run, Output, Logs)</p>
        <p className="mt-2 text-xs">{functionId ? `Function ID: ${functionId}` : '(Requires Function ID - available after save)'}</p>
    </div>
);
// --- ---

interface FunctionFormProps {
  initialValues?: Partial<FunctionFormData>;
  onSubmit: (data: FunctionFormData, intent: 'draft' | 'deploy') => Promise<void>; 
  isLoadingExternally?: boolean;
  isEditMode?: boolean; 
}

export default function FunctionForm({ initialValues, onSubmit, isLoadingExternally = false, isEditMode = false }: FunctionFormProps) {

  const defaultValues: FunctionFormData = {
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    sourceType: initialValues?.sourceType || 'inline',
    runtime: initialValues?.runtime || 'nodejs18.x',
    handler: initialValues?.handler || 'index.handler',
    timeout: initialValues?.timeout || 30,
    memory: initialValues?.memory || 128,
    inlineCode: initialValues?.inlineCode || '// Start coding your function here...\n\nexports.handler = async (event) => {\n  // TODO: Implement your function logic\n  const response = {\n    statusCode: 200,\n    body: JSON.stringify(\'Hello from Lambda!\'),\n  };\n  return response;\n};',
    repoUrl: initialValues?.repoUrl || '',
    branch: initialValues?.branch || '',
    filePath: initialValues?.filePath || '',
    inputSchema: initialValues?.inputSchema || '{\n  "type": "object",\n  "properties": {}\n}',
    outputSchema: initialValues?.outputSchema || '{\n  "type": "object",\n  "properties": {}\n}',
    credentialId: initialValues?.credentialId || '',
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting: isSubmittingRHF, isDirty },
    watch, 
  } = useForm<FunctionFormData>({
    resolver: zodResolver(functionFormSchema) as Resolver<FunctionFormData, unknown>,
    defaultValues,
  });

  // Watch the value of sourceType
  const sourceType = watch('sourceType');

  // Loading state combines external loading and RHF's submitting state
  const isSubmitting = isLoadingExternally || isSubmittingRHF;

  React.useEffect(() => {
    if (initialValues) {
      reset(defaultValues);
    }
  }, [initialValues, reset]);

  // Handle submission with intent (Draft vs Deploy)
  const handleFormSubmit = (intent: 'draft' | 'deploy') => {
    // Use a regular function with a more specific type to avoid ESLint warnings
    // This is a workaround for the complex typing in react-hook-form
    const onValid = (data: Record<string, unknown>) => {
      // Cast to FunctionFormData for type safety in our code
      const formData = data as FunctionFormData;
      
      // Double-check Phase 1 constraint
      if (intent === 'deploy' && formData.sourceType !== 'inline') {
         alert("Deployment from GitHub is not supported in Phase 1. Please save as draft or select Inline Code.");
         return; // Prevent submission
      }
      if (formData.sourceType === 'inline' && (!formData.inlineCode || formData.inlineCode.trim().length === 0)) {
           alert("Function code cannot be empty when using Inline Code source.");
           // RHF/Zod refine should ideally catch this, but belt-and-suspenders
           return;
      }

      return onSubmit(formData, intent)
        .then(() => {
          // Only reset dirty state if submission was successful *and* not deploying
          // For deploy, parent page might handle redirect or status update
          if (intent === 'draft') {
               reset(formData); // Reset dirty state after successful draft save
          }
        })
        .catch((error) => {
          console.error("Submission failed:", error);
          // Error display should be handled by the parent based on the thrown error
        });
    };
    
    return handleSubmit(onValid)();
  };

  return (
    // No <form> tag here, submit triggered by buttons calling handleFormSubmit
    <div className="space-y-8">

      {/* --- Basic Information Section --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Info size={18} /> Basic Information
        </h2>
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
              disabled={isSubmitting} 
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1"> Description </label>
            <input 
              id="description" 
              type="text" 
              {...register("description")} 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.description ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} 
              disabled={isSubmitting} 
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>
        </div>
      </div>

       {/* --- Function Source Section --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Function Source</h2>
         <fieldset>
            <legend className="sr-only">Function Source Type</legend>
            <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
                <div className="flex items-center gap-x-2">
                    <input
                        id="sourceTypeInline"
                        type="radio"
                        value="inline"
                        {...register("sourceType")}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        disabled={isSubmitting}
                    />
                    <label htmlFor="sourceTypeInline" className="block text-sm font-medium leading-6 text-gray-900 flex items-center gap-1">
                        <Code size={16}/> Inline Code
                    </label>
                </div>
                <div className="flex items-center gap-x-2">
                    <input
                        id="sourceTypeGitHub"
                        type="radio"
                        value="github"
                         {...register("sourceType")}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        disabled={isSubmitting}
                    />
                    <label htmlFor="sourceTypeGitHub" className="block text-sm font-medium leading-6 text-gray-900 flex items-center gap-1">
                       <Github size={16}/> GitHub Repository
                       <span className="ml-1 text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">Phase 2</span>
                    </label>
                </div>
            </div>
             {errors.sourceType && <p className="mt-2 text-xs text-red-600">{errors.sourceType.message}</p>}
        </fieldset>
      </div>


      {/* --- Inline Code Details (Conditional) --- */}
      {sourceType === 'inline' && (
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200 space-y-6" id="inline-code-section">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Inline Code Details</h3>
          {/* Runtime & Handler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="runtime" className="block text-sm font-medium text-gray-700 mb-1"> Runtime <span className="text-red-500">*</span> </label>
                  <select 
                    id="runtime" 
                    {...register("runtime")} 
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.runtime ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} 
                    disabled
                  >
                      <option value="nodejs18.x">Node.js 18.x</option>
                  </select>
                  {errors.runtime && <p className="mt-1 text-xs text-red-600">{errors.runtime.message}</p>}
              </div>
              <div>
                  <label htmlFor="handler" className="block text-sm font-medium text-gray-700 mb-1"> Handler <span className="text-red-500">*</span> </label>
                  <input 
                    id="handler" 
                    type="text" 
                    {...register("handler")} 
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.handler ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} 
                    disabled={isSubmitting} 
                  />
                  {errors.handler && <p className="mt-1 text-xs text-red-600">{errors.handler.message}</p>}
              </div>
          </div>
          {/* Code Editor */}
          <div>
             <label htmlFor="inlineCode" className="block text-sm font-medium text-gray-700 mb-1">
               Function Code <span className="text-red-500">*</span>
             </label>
             <Controller
                 name="inlineCode"
                 control={control}
                 render={({ field }) => (
                     <CodeEditor
                         value={field.value}
                         onChange={field.onChange}
                         language="javascript"
                         height="400px"
                         readOnly={isSubmitting}
                         aria-invalid={errors.inlineCode ? 'true' : 'false'}
                         aria-describedby={errors.inlineCode ? 'inlineCode-error' : undefined}
                     />
                 )}
             />
             {errors.inlineCode && <p id="inlineCode-error" className="mt-1 text-xs text-red-600">{errors.inlineCode.message}</p>}
          </div>
        </div>
      )}

       {/* --- GitHub Details (Conditional & DISABLED) --- */}
      {sourceType === 'github' && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6 relative overflow-hidden" id="github-section">
             {/* Disabled Overlay / Message */}
            <div className="absolute inset-0 bg-gray-200 bg-opacity-60 backdrop-filter backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                 <Lock size={24} className="text-gray-500 mb-2" />
                <p className="font-semibold text-gray-700">GitHub Integration - Coming in Phase 2</p>
                <p className="text-sm text-gray-500">Deploying functions directly from GitHub repositories will be available soon.</p>
            </div>

            {/* Disabled Fields */}
             <h3 className="text-md font-semibold text-gray-700 border-b pb-2 opacity-50">GitHub Repository Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
                 <div>
                    <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-500 mb-1"> Repository URL </label>
                    <input id="repoUrl" type="text" {...register("repoUrl")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed" disabled />
                 </div>
                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-500 mb-1"> Branch </label>
                    <input id="branch" type="text" {...register("branch")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed" disabled />
                 </div>
             </div>
             <div>
                <label htmlFor="filePath" className="block text-sm font-medium text-gray-500 mb-1"> File Path </label>
                <input id="filePath" type="text" {...register("filePath")} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed" placeholder="path/to/your/function.js" disabled />
             </div>
             {/* Handler might be needed for GitHub source too, TBD */}
        </div>
      )}


      {/* --- Configuration Section (Always Visible) --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Timeout */}
           <div>
            <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1"> Timeout (s) <span className="text-red-500">*</span> </label>
            <input 
              id="timeout" 
              type="number" 
              {...register("timeout", { valueAsNumber: true })} 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.timeout ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} 
              disabled={isSubmitting} 
              step="1" 
            />
            {errors.timeout && <p className="mt-1 text-xs text-red-600">{errors.timeout.message}</p>}
          </div>
           {/* Memory */}
          <div>
            <label htmlFor="memory" className="block text-sm font-medium text-gray-700 mb-1"> Memory (MB) <span className="text-red-500">*</span> </label>
            <input 
              id="memory" 
              type="number" 
              {...register("memory", { valueAsNumber: true })} 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm ${errors.memory ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} 
              disabled={isSubmitting} 
              step="64" 
            />
            {errors.memory && <p className="mt-1 text-xs text-red-600">{errors.memory.message}</p>}
          </div>
        </div>
      </div>

       {/* --- Environment Variables Section --- */}
      <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
           <h2 className="text-lg font-semibold mb-4 text-gray-800">Environment Variables</h2>
           <p className="text-sm text-gray-600 mb-3">Reference secrets securely stored in Credentials Management.</p>
           <div>
                <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-1">
                    Inject Credential <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                    <select
                        id="credentialId"
                        {...register("credentialId")}
                        className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-1 text-sm bg-white ${errors.credentialId ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
                        disabled={isSubmitting}
                    >
                        <option value="">-- No Credential --</option>
                        {availableCredentials?.map(cred => (
                            <option key={cred.id} value={cred.id}>
                                {cred.name}
                            </option>
                        ))}
                    </select>
                    <Link href="/settings/credentials/new" 
                       className="text-sm text-indigo-600 hover:underline whitespace-nowrap"
                       title="Add New Credential"
                       target="_blank"
                    >
                         + Add New
                    </Link>
                </div>
                 {errors.credentialId && <p className="mt-1 text-xs text-red-600">{errors.credentialId.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Selected credentials will be securely injected as environment variables during deployment.</p>
           </div>
           {/* Add UI for key-value pair non-secret env vars later if needed */}
       </div>

       {/* --- Input/Output Schema --- */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Schema */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                 <h2 className="text-lg font-semibold mb-4 text-gray-800">Input Schema</h2>
                 <Controller
                    name="inputSchema"
                    control={control}
                    render={({ field }) => (
                        <SchemaBuilder
                            schemaType="input"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            error={errors.inputSchema}
                        />
                    )}
                  />
            </div>
            {/* Output Schema */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                 <h2 className="text-lg font-semibold mb-4 text-gray-800">Output Schema</h2>
                  <Controller
                    name="outputSchema"
                    control={control}
                    render={({ field }) => (
                        <SchemaBuilder
                            schemaType="output"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            error={errors.outputSchema}
                        />
                    )}
                  />
            </div>
       </div>

        {/* --- Testing Section Placeholder (Only show in edit mode?) --- */}
       {isEditMode && (
           <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Test Function</h2>
                <TestConsolePlaceholder />
           </div>
       )}


      {/* --- Submit Buttons --- */}
      <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 -mx-6 px-6">
         <Link href="/functions" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
             Cancel
         </Link>
         {/* Save Draft Button */}
         <button
            type="button" 
            onClick={() => handleFormSubmit('draft')}
            disabled={isSubmitting || !isDirty} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {isSubmitting ? ( <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> ) : null}
           Save Draft
         </button>
         {/* Save & Deploy Button */}
          <button
            type="button"
            onClick={() => handleFormSubmit('deploy')}
            disabled={isSubmitting || !isDirty || sourceType === 'github'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={sourceType === 'github' ? "Deployment from GitHub source is not available in Phase 1" : ""}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            ) : (
              <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            )}
            {isSubmitting ? 'Saving...' : 'Save & Deploy'}
          </button>
      </div>
    </div>
  );
}
