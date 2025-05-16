"use client";

import React, { useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string | undefined; // Value from react-hook-form field
  onChange: (value: string | undefined) => void; // RHF field.onChange
  language?: string;
  height?: string;
  readOnly?: boolean;
  'aria-invalid'?: 'true' | 'false'; // For accessibility based on errors
  'aria-describedby'?: string; // For accessibility based on errors
}

// Basic theme definition (can be expanded)
const defineTheme = (monaco: Monaco) => {
  monaco.editor.defineTheme('my-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [], // Add custom rules if needed
    colors: {
      // Customize colors if needed
      // 'editor.background': '#1e1e1e',
    },
  });
   monaco.editor.defineTheme('my-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
       // 'editor.background': '#ffffff',
    },
  });
};


export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby
}: CodeEditorProps) {
  const [theme, setTheme] = useState<'my-light' | 'my-dark'>('my-light'); // Simple theme state

  const handleEditorDidMount = (editor: unknown, monaco: Monaco) => {
    // Define custom themes
    defineTheme(monaco);
    // You can store the editor instance (`editor`) if needed for programmatic actions
    // console.log('Monaco editor mounted:', editor);
  };

  const handleThemeChange = (newTheme: 'my-light' | 'my-dark') => {
    setTheme(newTheme);
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden relative group">
       {/* Simple Toolbar Example */}
       <div className="bg-gray-100 px-2 py-1 flex justify-end items-center border-b border-gray-300">
           <span className="text-xs text-gray-500 mr-auto pl-1 font-medium uppercase">{language}</span>
           <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as 'my-light' | 'my-dark')}
                className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
                <option value="my-light">Light Theme</option>
                <option value="my-dark">Dark Theme</option>
            </select>
           {/* Add more toolbar buttons later (Format, Undo/Redo) */}
       </div>

      <Editor
        height={height}
        language={language}
        value={value || ''} // Ensure value is not undefined for Monaco
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme={theme} // Use state for theme
        loading={<LoadingIndicator />} // Custom loading indicator
        options={{
          readOnly: readOnly,
          minimap: { enabled: true },
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true, // Adjust layout on container resize
          wordWrap: 'on',
          // Add other Monaco options as needed
        }}
        aria-describedby={ariaDescribedby}
      />
       {/* Apply red border if invalid */}
       {ariaInvalid === 'true' && (
          <div className="absolute inset-0 border-2 border-red-500 rounded-md pointer-events-none"></div>
       )}
    </div>
  );
}

// Simple Loading Component for Monaco
const LoadingIndicator = () => (
  <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
    <Loader2 className="h-6 w-6 animate-spin mr-2" />
    <span>Loading Editor...</span>
  </div>
);
