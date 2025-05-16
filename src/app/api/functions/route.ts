import { NextResponse } from 'next/server';
import { functionFormSchema } from '@/schemas/function'; // Adjust path

// Define a type for our mock database entries
interface FunctionRecord {
  id: string;
  name: string;
  description?: string;
  runtime: 'nodejs18.x'; // Use literal type to match the schema
  handler: string;
  timeout: number;
  memory: number;
  inlineCode: string;
  inputSchema: string;
  outputSchema: string;
  createdAt: string;
  updatedAt: string;
  sourceType?: string;
}

// --- Mock Database (Replace with actual DB connection) ---
const mockDb: { [id: string]: FunctionRecord } = {
    'fn-123': { id: 'fn-123', name: 'MyTestFunction', description: 'Does something cool', runtime: 'nodejs18.x', handler: 'src/index.handler', timeout: 60, memory: 256, inlineCode: 'exports.handler = async (event) => { console.log("Hello from fn-123!"); return { statusCode: 200, body: "Success" }; };', inputSchema: '{"type":"object"}', outputSchema: '{"type":"object"}', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    'fn-456': { id: 'fn-456', name: 'AnotherFunction', description: '', runtime: 'nodejs18.x', handler: 'index.run', timeout: 10, memory: 128, inlineCode: 'exports.run = async (event) => { return { statusCode: 200, body: "Another one" }; };', inputSchema: '{}', outputSchema: '{}', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
};
// --- End Mock Database ---

// GET /api/functions - List Functions (with basic pagination/filter examples)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    // --- Replace with actual DB query ---
    let functions = Object.values(mockDb);
    if (search) {
        functions = functions.filter(fn => fn.name.toLowerCase().includes(search.toLowerCase()));
    }
    const total = functions.length;
    const paginatedFunctions = functions.slice((page - 1) * limit, page * limit);
    // --- End DB query ---

    return NextResponse.json({
        data: paginatedFunctions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    });
  } catch (error) {
    console.error('GET /api/functions Error:', error);
    return NextResponse.json({ message: 'Failed to fetch functions' }, { status: 500 });
  }
}


// POST /api/functions - Create Function
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate incoming data against schema
    const validation = functionFormSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation Errors:', validation.error.errors);
      return NextResponse.json({ message: 'Invalid input data', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const validatedData = validation.data;

    // --- Replace with actual DB insert ---
    const newId = `fn-${Date.now()}`; // Generate ID
    const now = new Date().toISOString();
    const newFunction: FunctionRecord = {
        id: newId,
        ...validatedData,
        sourceType: 'inline', // Default for MVP
        createdAt: now,
        updatedAt: now,
    };
    mockDb[newId] = newFunction;
    console.log('Created Function:', newFunction);
    // --- End DB Insert ---

    // --- Trigger Deployment Service (Async) ---
    // IMPORTANT: Don't await deployment here, just trigger it.
    // The client will likely poll or use websockets for status.
    // Example: await triggerDeployment(newId);
    console.log(`TODO: Trigger deployment for function ${newId}`);
    // --- End Trigger Deployment ---


    // Return the newly created function (or just success + ID)
    return NextResponse.json(newFunction, { status: 201 });

  } catch (error) {
    console.error('POST /api/functions Error:', error);
    return NextResponse.json({ message: 'Failed to create function' }, { status: 500 });
  }
}
