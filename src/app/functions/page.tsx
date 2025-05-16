import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Play, 
  Trash2, 
  Loader2, 
  Download, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  Code, 
  Github
} from 'lucide-react';

// Import the FunctionListData type from the schema
import { type FunctionListData } from '@/schemas/function';

// Mock data for initial development
// Will be replaced with API call in production
const mockFunctions: FunctionListData[] = [
  {
    id: 'fn-123',
    name: 'ProcessPayment',
    description: 'Handles payment processing via Stripe',
    sourceType: 'inline',
    runtime: 'nodejs18.x',
    status: 'active',
    lastDeployed: '2023-05-15T10:30:00Z',
    lastModified: '2023-05-15T10:25:00Z',
  },
  {
    id: 'fn-456',
    name: 'GenerateInvoice',
    description: 'Creates PDF invoices from order data',
    sourceType: 'inline',
    runtime: 'nodejs18.x',
    status: 'draft',
    lastDeployed: null,
    lastModified: '2023-05-14T15:20:00Z',
  },
  {
    id: 'fn-789',
    name: 'SendNotification',
    description: 'Sends push notifications to users',
    sourceType: 'inline',
    runtime: 'nodejs18.x',
    status: 'error',
    lastDeployed: '2023-05-10T09:15:00Z',
    lastModified: '2023-05-13T11:45:00Z',
  },
  {
    id: 'fn-101',
    name: 'AnalyzeImage',
    description: 'Uses AI to analyze and tag uploaded images',
    sourceType: 'github',
    runtime: 'nodejs18.x',
    status: 'active',
    lastDeployed: '2023-05-11T14:20:00Z',
    lastModified: '2023-05-11T14:15:00Z',
  },
];

// Helper function to format dates
function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let bgColor = 'bg-gray-100 text-gray-800';
  let statusText = status;
  
  switch (status) {
    case 'active':
      bgColor = 'bg-green-100 text-green-800';
      statusText = 'Active';
      break;
    case 'draft':
      bgColor = 'bg-blue-100 text-blue-800';
      statusText = 'Draft';
      break;
    case 'error':
      bgColor = 'bg-red-100 text-red-800';
      statusText = 'Error';
      break;
    case 'deploying':
      bgColor = 'bg-yellow-100 text-yellow-800';
      statusText = 'Deploying';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {statusText}
    </span>
  );
}

// Source type badge component
function SourceBadge({ sourceType }: { sourceType: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
      {sourceType === 'inline' ? (
        <>
          <Code size={14} />
          <span>Inline</span>
        </>
      ) : (
        <>
          <Github size={14} />
          <span>GitHub</span>
        </>
      )}
    </span>
  );
}

export default function FunctionsPage() {
  // State for search query
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // State for loading (simulated)
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Simulate API loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter functions based on search query
  const filteredFunctions = React.useMemo(() => {
    if (!searchQuery.trim()) return mockFunctions;
    
    const query = searchQuery.toLowerCase();
    return mockFunctions.filter(fn => 
      fn.name.toLowerCase().includes(query) || 
      (fn.description && fn.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);
  
  // Handle function deletion (mock)
  const handleDelete = (id: string) => {
    // In production, this would call the API
    alert(`Delete function with ID: ${id}`);
  };
  
  // Handle function deployment (mock)
  const handleDeploy = (id: string) => {
    // In production, this would call the API
    alert(`Deploy function with ID: ${id}`);
  };
  
  // Handle function testing (mock)
  const handleTest = (id: string) => {
    // In production, this would navigate to test page
    alert(`Test function with ID: ${id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Functions</h1>
        <Link 
          href="/functions/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Function
        </Link>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search functions..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter button - to be implemented in future */}
        <button 
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled
        >
          <Filter className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Filter
        </button>
        
        {/* Sort button - to be implemented in future */}
        <button 
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled
        >
          <ArrowUpDown className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Sort
        </button>
      </div>
      
      {/* Functions list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading functions...</span>
          </div>
        ) : filteredFunctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No functions found</p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search query
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredFunctions.map((fn) => (
              <li key={fn.id}>
                <div className="px-6 py-4 flex items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-indigo-600 truncate">
                        <Link href={`/functions/${fn.id}`} className="hover:underline">
                          {fn.name}
                        </Link>
                      </h3>
                      <div className="ml-2 flex-shrink-0">
                        <StatusBadge status={fn.status} />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {fn.description || 'No description provided'}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <SourceBadge sourceType={fn.sourceType} />
                      <span className="flex items-center">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Last modified: {formatDate(fn.lastModified)}
                      </span>
                      {fn.lastDeployed && (
                        <span className="flex items-center">
                          <Download className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Last deployed: {formatDate(fn.lastDeployed)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-6 flex-shrink-0 flex items-center space-x-2">
                    {/* Test button */}
                    <button
                      onClick={() => handleTest(fn.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Test function"
                      disabled={fn.status !== 'active'}
                    >
                      <Play className="h-5 w-5" />
                    </button>
                    
                    {/* Deploy button */}
                    <button
                      onClick={() => handleDeploy(fn.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Deploy function"
                      disabled={fn.status === 'deploying' || fn.status === 'active'}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    
                    {/* Edit button */}
                    <Link
                      href={`/functions/${fn.id}`}
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Edit function"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(fn.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      title="Delete function"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
