import { z } from 'zod';

// Define allowed runtimes (only nodejs18.x for MVP)
const supportedRuntimes = ['nodejs18.x'] as const;
const sourceTypes = ['inline', 'github'] as const;

// Basic JSON Schema validation (can be improved later)
const jsonSchemaString = z.string().refine((val) => {
  if (!val.trim()) return true; // Allow empty string (will default to '{}')
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === 'object' && parsed !== null; // Basic object check
  } catch (error) {
    console.error("JSON parse error:", error);
    return false;
  }
}, { message: 'Must be valid JSON or empty' });

export const functionFormSchema = z.object({
  name: z.string()
        .min(3, { message: 'Name must be at least 3 characters' })
        .max(50, { message: 'Name cannot exceed 50 characters' })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Name can only contain letters, numbers, underscores, and hyphens'}),
  description: z.string()
                .max(255, { message: 'Description cannot exceed 255 characters'})
                .optional()
                .or(z.literal('')),
  sourceType: z.enum(sourceTypes).default('inline'), // Added sourceType
  runtime: z.enum(supportedRuntimes, { errorMap: () => ({ message: 'Invalid runtime selected' }) }),
  handler: z.string()
            .min(1, { message: 'Handler is required'})
            .regex(/^[a-zA-Z0-9_.-]+$/, { message: 'Handler format invalid (e.g., index.handler)'})
            .default('index.handler'),
  timeout: z.number({ invalid_type_error: 'Timeout must be a number'})
            .int()
            .min(1, { message: 'Timeout must be at least 1 second'})
            .max(300, { message: 'Timeout cannot exceed 300 seconds'})
            .default(30),
  memory: z.number({ invalid_type_error: 'Memory must be a number'})
            .int()
            .min(128, { message: 'Memory must be at least 128 MB'})
            .max(1024, { message: 'Memory cannot exceed 1024 MB'}) // Adjust max as needed for MVP
            .refine(val => val % 64 === 0, { message: 'Memory must be a multiple of 64 MB'})
            .default(128),

  // --- Inline Code Fields (Required conditionally in logic, but schema allows empty for GitHub selection) ---
  inlineCode: z.string().optional().or(z.literal('')), // Make optional in schema, validation logic handles requirement

  // --- GitHub Fields (Optional in schema for Phase 1) ---
  repoUrl: z.string().optional().or(z.literal('')),
  branch: z.string().optional().or(z.literal('')),
  filePath: z.string().optional().or(z.literal('')),

  // --- Schemas ---
  inputSchema: jsonSchemaString.optional().or(z.literal('')).default('{}'),
  outputSchema: jsonSchemaString.optional().or(z.literal('')).default('{}'),

   // --- Environment Variables (Example structure - adjust as needed) ---
   // This assumes you store the *reference ID* of the credential
   credentialId: z.string().optional().or(z.literal('')), // Example

}).refine(data => {
    // Phase 1 Validation: If sourceType is 'inline', inlineCode must be present.
    if (data.sourceType === 'inline') {
        return !!data.inlineCode && data.inlineCode.trim().length > 0;
    }
    // If sourceType is 'github', we don't validate inlineCode (and other fields would be validated in Phase 2)
    return true;
}, {
    message: 'Function code cannot be empty when using Inline Code source',
    path: ['inlineCode'], // Associate error with the inlineCode field
});


// Infer the TypeScript type from the schema
export type FunctionFormData = z.infer<typeof functionFormSchema>;

// Type for function list item data
export type FunctionListData = {
  id: string;
  name: string;
  description?: string;
  sourceType: 'inline' | 'github';
  runtime: string;
  status: 'draft' | 'active' | 'error' | 'deploying';
  lastDeployed: string | null;
  lastModified: string;
};

// Separate type for data fetched from API (including status, timestamps etc.)
export type FunctionListDataExtended = FunctionFormData & {
    id: string;
    status: 'draft' | 'deploying' | 'deployed' | 'error'; // Example deployment statuses
    createdAt: string;
    updatedAt: string;
};
