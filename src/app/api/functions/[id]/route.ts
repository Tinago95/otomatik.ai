import { NextResponse } from 'next/server';
import { functionFormSchema, type FunctionFormData } from '@/schemas/function'; // Adjust path

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

// --- Mock Database (Share or import from common location) ---
const mockDb: { [id: string]: FunctionRecord } = {
    'fn-123': { id: 'fn-123', name: 'MyTestFunction', description: 'Does something cool', runtime: 'nodejs18.x', handler: 'src/index.handler', timeout: 60, memory: 256, inlineCode: 'exports.handler = async (event) => { console.log("Hello from fn-123!"); return { statusCode: 200, body: "Success" }; };', inputSchema: '{"type":"object"}', outputSchema: '{"type":"object"}', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sourceType: 'inline' },
    'fn-456': { id: 'fn-456', name: 'AnotherFunction', description: '', runtime: 'nodejs18.x', handler: 'index.run', timeout: 10, memory: 128, inlineCode: 'exports.run = async (event) => { return { statusCode: 200, body: "Another one" }; };', inputSchema: '{}', outputSchema: '{}', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), sourceType: 'inline' },
};
// --- End Mock Database ---

interface Params {
  params: {
    id: string;
  };
}

// GET /api/functions/[id] - Get Function Detail
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    // --- Replace with actual DB query ---
    const func = mockDb[id];
    // --- End DB query ---

    if (!func) {
      return NextResponse.json({ message: 'Function not found' }, { status: 404 });
    }

    // Return only data relevant to FunctionFormData + ID ? Or the full DB record? Decide based on needs.
    // For edit form, returning data matching FunctionFormData is useful.
    const responseData: Partial<FunctionFormData> & {id: string} = {
        id: func.id,
        name: func.name,
        description: func.description,
        runtime: func.runtime,
        handler: func.handler,
        timeout: func.timeout,
        memory: func.memory,
        inlineCode: func.inlineCode,
        inputSchema: func.inputSchema,
        outputSchema: func.outputSchema,
        // Exclude createdAt, updatedAt, sourceType etc. unless form needs them
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`GET /api/functions/${params.id} Error:`, error);
    return NextResponse.json({ message: 'Failed to fetch function' }, { status: 500 });
  }
}


// PUT /api/functions/[id] - Update Function
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

     // --- Replace with actual DB query ---
    const existingFunc = mockDb[id];
    // --- End DB query ---

    if (!existingFunc) {
      return NextResponse.json({ message: 'Function not found' }, { status: 404 });
    }

    // Validate incoming data
    const validation = functionFormSchema.safeParse(body);
     if (!validation.success) {
      console.error('Validation Errors:', validation.error.errors);
      return NextResponse.json({ message: 'Invalid input data', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const validatedData = validation.data;

    // --- Replace with actual DB update ---
    const updatedFunction = {
        ...existingFunc, // Keep existing fields like id, createdAt
        ...validatedData, // Overwrite with validated data
        updatedAt: new Date().toISOString(),
    };
    mockDb[id] = updatedFunction;
    console.log('Updated Function:', updatedFunction);
     // --- End DB Update ---

    // --- Trigger Deployment Service (Async) ---
    // Often needed after an update too
    console.log(`TODO: Trigger deployment for updated function ${id}`);
    // --- End Trigger Deployment ---


    return NextResponse.json(updatedFunction);

  } catch (error) {
    console.error(`PUT /api/functions/${params.id} Error:`, error);
    return NextResponse.json({ message: 'Failed to update function' }, { status: 500 });
  }
}


// DELETE /api/functions/[id] - Delete Function
export async function DELETE(request: Request, { params }: Params) {
   try {
    const { id } = params;

    // --- Replace with actual DB check/delete ---
    const existingFunc = mockDb[id];
    if (!existingFunc) {
      return NextResponse.json({ message: 'Function not found' }, { status: 404 });
    }
    delete mockDb[id];
     console.log('Deleted Function:', id);
    // --- End DB Delete ---

    // --- TODO: Trigger cleanup in Deployment Service? ---
    console.log(`TODO: Trigger cleanup/deletion for deployed function ${id}`);
    // --- End Trigger Cleanup ---


    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error(`DELETE /api/functions/${params.id} Error:`, error);
    return NextResponse.json({ message: 'Failed to delete function' }, { status: 500 });
  }
}
