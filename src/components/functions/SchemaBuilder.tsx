"use client";

import React, { useState } from 'react';
import Editor from '@monaco-editor/react'; // Use Monaco for JSON editor too
import { Loader2 } from 'lucide-react';

interface SchemaBuilderProps {
  value: string | undefined; // JSON schema as string from RHF field.value
  onChange: (value: string | undefined) => void; // RHF field.onChange
  schemaType: 'input' | 'output';
  disabled?: boolean;
  error?: { message?: string }; // Error object from RHF
}

// Simple Loading Component for Monaco
const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500 text-sm">
    <Loader2 className="h-5 w-5 animate-spin mr-2" />
    <span>Loading JSON Editor...</span>
  </div>
);

// Basic Form Builder Row (Highly Simplified MVP - focus is on JSON editor)
const FormBuilderRow = ({ propName, propType, isRequired, onRemove }: { propName: string, propType: string, isRequired: boolean, onRemove: () => void }) => (
    <div className="flex items-center gap-2 p-1 border-b border-gray-200 text-xs">
        <span className="font-mono text-gray-700 flex-1 truncate">{propName}</span>
        <span className="text-gray-500 flex-shrink-0 w-16 text-center">{propType}</span>
        <input type="checkbox" checked={isRequired} disabled className="mx-auto flex-shrink-0"/>
        <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700 flex-shrink-0">X</button>
    </div>
);


export default function SchemaBuilder({
  value = '{}', // Default to empty object string if undefined
  onChange,
  schemaType,
  disabled = false,
  error
}: SchemaBuilderProps) {
  const [activeTab, setActiveTab] = useState<'json' | 'form'>('json'); // Default to JSON editor

  // Basic parsing for the Form Builder (very limited MVP)
  let parsedProperties: { name: string, type: string, required: boolean }[] = [];
  const parseError = ''; // Use const since it's never reassigned
  try {
      const parsedSchema = JSON.parse(value || '{}');
      if (parsedSchema && typeof parsedSchema === 'object' && parsedSchema.properties && typeof parsedSchema.properties === 'object') {
           const requiredFields = new Set(parsedSchema.required || []);
           parsedProperties = Object.entries(parsedSchema.properties).map(([key, prop]) => {
               // Type assertion to handle the unknown type
               const typedProp = prop as { type?: string };
               return {
                   name: key,
                   type: typedProp?.type || 'any',
                   required: requiredFields.has(key)
               };
           });
      }
  } catch (error) {
      // Ignore parse errors for display, JSON editor handles validation
      console.error("JSON parse error:", error);
  }

  // Handler for Monaco Editor Change
  const handleJsonChange = (newValue: string | undefined) => {
      onChange(newValue || ''); // Ensure empty string instead of undefined if editor clears
  };


  return (
    <div className={`border rounded-md overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'}`}>
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          disabled // Disable Form Builder for initial MVP to focus on JSON Editor
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'form' ? 'bg-white border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Form Builder <span className="text-xs">(Coming Soon)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'json' ? 'bg-white border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
        >
          JSON Editor
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-1"> {/* Minimal padding around content */}
        {/* Form Builder Tab (Placeholder/Readonly Display for now) */}
         {activeTab === 'form' && (
            <div className="p-4 min-h-[200px] text-sm text-gray-600 bg-gray-50">
                <p className="mb-2 font-medium">{schemaType === 'input' ? 'Input' : 'Output'} Schema View (Read Only)</p>
                {parseError && <p className="text-red-500 text-xs mb-2">{parseError}</p>}
                {parsedProperties.length > 0 ? (
                     <div className="border rounded bg-white max-h-48 overflow-y-auto">
                         <div className="flex items-center gap-2 p-1 border-b bg-gray-100 text-xs font-bold text-gray-600">
                             <span className="flex-1">Name</span>
                             <span className="w-16 text-center flex-shrink-0">Type</span>
                             <span className="w-16 text-center flex-shrink-0">Required</span>
                             <span className="w-6 flex-shrink-0"></span> {/* For remove button alignment */}
                         </div>
                        {parsedProperties.map(prop => (
                            <FormBuilderRow
                                key={prop.name}
                                propName={prop.name}
                                propType={prop.type}
                                isRequired={prop.required}
                                onRemove={() => alert('Editing via form builder coming soon.')}
                             />
                        ))}
                     </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">No properties defined in schema or schema is invalid JSON.</p>
                )}
                 <button type="button" disabled className="mt-3 text-xs px-2 py-1 border rounded bg-gray-200 text-gray-500 cursor-not-allowed">Add Property +</button>
            </div>
         )}


        {/* JSON Editor Tab */}
         {activeTab === 'json' && (
            <Editor
                height="200px" // Adjust height as needed
                language="json"
                value={value || '{}'} // Ensure value is not undefined
                onChange={handleJsonChange}
                theme="my-light" // Use a consistent theme or allow selection
                loading={<LoadingIndicator />}
                options={{
                    readOnly: disabled,
                    minimap: { enabled: false },
                    fontSize: 12,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                    formatOnPaste: true,
                    formatOnType: true,
                 }}
            />
         )}
      </div>
        {/* Display RHF validation error below the component */}
        {error && <p className="px-2 pb-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
