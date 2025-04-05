import { z } from 'zod';

// Define allowed runtimes (only nodejs18.x for MVP)
const supportedRuntimes = ['nodejs18.x'] as const; // Ensures only this value is allowed

// Basic JSON Schema validation (can be improved later)
const jsonSchemaString = z.string().refine((val) => {
  try {
    JSON.parse(val);
    // Add more sophisticated JSON schema validation if needed
    return true;
  } catch (e) {
    return false;
  }
}, { message: 'Must be valid JSON' });

export const functionFormSchema = z.object({
  name: z.string()
        .min(3, { message: 'Name must be at least 3 characters' })
        .max(50, { message: 'Name cannot exceed 50 characters' })
        // Optional: Add regex for valid characters if needed
        .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Name can only contain letters, numbers, underscores, and hyphens'}),
  description: z.string()
                .max(255, { message: 'Description cannot exceed 255 characters'})
                .optional()
                .or(z.literal('')), // Allow empty string to clear optional field
  runtime: z.enum(supportedRuntimes, { errorMap: () => ({ message: 'Invalid runtime selected' }) }),
  handler: z.string()
            .min(1, { message: 'Handler is required'})
            .regex(/^[a-zA-Z0-9_.-]+$/, { message: 'Handler format invalid (e.g., index.handler)'}) // Basic check
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
            .refine(val => val % 64 === 0, { message: 'Memory must be a multiple of 64 MB'}) // Common Lambda constraint
            .default(128),

  // Placeholders for now - will integrate CodeEditor/SchemaBuilder later
  // We'll store the *code itself* and the *schema strings* in the form state
  inlineCode: z.string()
               .min(1, { message: 'Function code cannot be empty'}),
  inputSchema: jsonSchemaString.default('{}'), // Default to empty object schema
  outputSchema: jsonSchemaString.default('{}'), // Default to empty object schema
});

// Infer the TypeScript type from the schema
export type FunctionFormData = z.infer<typeof functionFormSchema>;
