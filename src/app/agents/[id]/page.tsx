"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import VoiceSelector from '@/components/VoiceSelector';
import { ChevronLeft, Save, Info, BrainCircuit, Upload, Settings, MessageSquare, AlertCircle, Bot, Wrench, Key } from 'lucide-react';
import type { AgentDetailData, Voice, Credential } from '@/app/types';

// Mock Voices (replace with actual fetch)
const availableVoices: Voice[] = [
    { id: 'voice1', name: 'Rachel', description: 'Professional female voice' },
    { id: 'voice2', name: 'Michael', description: 'Professional male voice' },
    { id: 'voice3', name: 'Sarah', description: 'Friendly female voice' },
];

// Mock Credentials (replace with actual fetch)
const availableCredentials: Credential[] = [
    { id: 'cred1', name: 'OpenAI API Key', type: 'api_key', description: 'Used for agent completions and embeddings', createdAt: '2025-03-15T10:00:00Z' },
    { id: 'cred2', name: 'CRM API Token', type: 'bearer_token', description: 'For customer data lookup', createdAt: '2025-03-20T14:30:00Z' },
    { id: 'cred3', name: 'Database Credentials', type: 'basic_auth', description: 'Read-only access to analytics database', createdAt: '2025-03-25T11:15:00Z' },
];

// Props received by the page component in App Router
interface AgentConfigPageProps {
  params: {
    id: string; // The dynamic route parameter [id]
  };
}

export default function AgentConfigPage({ params }: AgentConfigPageProps) {
  const { id } = params; // Get ID from params

  const [agentData, setAgentData] = useState<Partial<AgentDetailData>>({});
  const [initialAgentData, setInitialAgentData] = useState<AgentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('Rachel');
  const [selectedCredentialId, setSelectedCredentialId] = useState<string | undefined>();

  // --- Data Fetching ---
  const fetchAgentData = useCallback(async (agentId: string) => {
    console.log(`Fetching agent data for ID: ${agentId}`);
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API
      const mockAgents: AgentDetailData[] = [ // Same mock data as before...
            { id: 'agent1', name: 'Sales Demo Booker', description: 'Qualifies leads and books demos via webchat.', status: 'active', createdAt: '2025-04-01T10:00:00Z', voiceId: 'voice3', selectedVoiceName: 'Sarah', prompt: 'You are a friendly assistant helping users book demos...', knowledgeBaseIds: ['kb1'], toolCredentialIds: ['cred1'] },
            { id: 'agent2', name: 'Support Tier 1', description: 'Answers common questions from the knowledge base.', status: 'active', createdAt: '2025-03-25T14:30:00Z', voiceId: 'voice1', selectedVoiceName: 'Rachel', prompt: 'You are a helpful support agent...', knowledgeBaseIds: ['kb1', 'kb2'] },
            { id: 'agent3', name: 'Order Status Checker', description: 'Checks order status via API integration (Phone).', status: 'inactive', createdAt: '2025-04-05T09:15:00Z', voiceId: 'voice2', selectedVoiceName: 'Michael', prompt: 'You are an order status checker...', knowledgeBaseIds: [], toolCredentialIds: ['cred2'] },
            { id: 'agent4', name: 'Internal HR Helper', description: 'Answers policy questions for employees.', status: 'draft', createdAt: '2025-04-10T11:00:00Z', prompt: 'You are an HR assistant...' },
      ];

      const agent = mockAgents.find(a => a.id === agentId);
      if (agent) {
        console.log('Agent found:', agent);
        setAgentData(agent);
        setInitialAgentData(agent);
        setSelectedVoiceName(agent.selectedVoiceName || '');
        setSelectedCredentialId(agent.toolCredentialIds?.[0]);
      } else {
        console.log('Agent not found');
        setError('Agent not found');
      }
    } catch (err) {
      console.error('Error fetching agent:', err);
      setError('Failed to load agent data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchAgentData(id);
    }
  }, [id, fetchAgentData]);

  // --- Form Handling ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgentData(prev => ({ ...prev, [name]: value }));
  };

  const handleVoiceSelect = (voiceName: string, voiceId: string) => {
    setSelectedVoiceName(voiceName);
    setAgentData(prev => ({ ...prev, voiceId, selectedVoiceName: voiceName }));
  };

  const handleCredentialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const credentialId = e.target.value || undefined;
    setSelectedCredentialId(credentialId);
    setAgentData(prev => ({ 
      ...prev, 
      toolCredentialIds: credentialId ? [credentialId] : [] 
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call to save agent
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd make a POST/PUT request here
      console.log('Agent saved:', agentData);
      
      // Update the initialAgentData to reflect the saved state
      setInitialAgentData(agentData as AgentDetailData);
      
      // Show success message (in a real app)
      alert('Agent configuration saved successfully!');
    } catch (err) {
      console.error('Error saving agent:', err);
      setError('Failed to save agent configuration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

   // --- Render Logic ---
  if (isLoading) {
    // Use loading.tsx for a better experience
    return <div className="text-center p-10">Loading agent configuration...</div>;
  }

  if (error) {
    return (
        <>
         <div className="mb-6">
           <Link href="/" className="text-sm text-indigo-600 hover:underline flex items-center"><ChevronLeft size={16} className="mr-1"/> Back to Dashboard</Link>
         </div>
         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold mr-2">Error:</strong>
              <span className="block sm:inline">{error}</span>
          </div>
        </>
    );
  }

   if (!initialAgentData && !isLoading) { // Agent not found after loading attempt
        return (
            <>
                <div className="mb-6">
                    <Link href="/" className="text-sm text-indigo-600 hover:underline flex items-center"><ChevronLeft size={16} className="mr-1"/> Back to Dashboard</Link>
                </div>
                <div className="text-center p-10 bg-white rounded-lg shadow">
                    <AlertCircle size={40} className="mx-auto text-yellow-500 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
                    <p className="text-gray-600">Could not load configuration for the specified agent ID.</p>
                </div>
            </>
        );
    }


  // --- Render Form ---
  return (
    <form onSubmit={handleSave}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline flex items-center mb-1"><ChevronLeft size={16} className="mr-1"/> Back to Dashboard</Link>
          <h1 className="text-2xl font-semibold text-gray-800">
            Configure Agent: {initialAgentData?.name || agentData.name || ''}
          </h1>
          {agentData.id && <span className="text-xs text-gray-500 font-mono">ID: {agentData.id}</span>}
        </div>
        <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${isLoading ? 'cursor-wait' : ''}`}
        >
          <Save size={18} className="mr-2 -ml-1" />
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Configuration Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Core Config */}
           <div className="lg:col-span-2 space-y-6">
               {/* Basic Info Card */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Info size={20} /> Basic Information</h2>
                   <div className="space-y-4">
                       {/* Name Input */}
                       <div>
                           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                           <input type="text" name="name" id="name" value={agentData.name || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="e.g., Customer Support Bot"/>
                       </div>
                       {/* Description Textarea */}
                       <div>
                           <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Purpose</label>
                           <textarea name="description" id="description" rows={3} value={agentData.description || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Briefly describe what this agent does"></textarea>
                       </div>
                       {/* Status Select */}
                       <div>
                           <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                           <select name="status" id="status" value={agentData.status || 'draft'} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white">
                               <option value="draft">Draft</option>
                               <option value="active">Active</option>
                               <option value="inactive">Inactive</option>
                           </select>
                       </div>
                   </div>
               </div>

                {/* Behavior / Prompt Card */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><BrainCircuit size={20} /> Agent Behavior (Prompt)</h2>
                   <div>
                       <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">System Prompt / Instructions</label>
                       <textarea name="prompt" id="prompt" rows={10} value={agentData.prompt || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono" placeholder="Enter the core instructions, personality, and guidelines for the AI agent..."></textarea>
                       <p className="text-xs text-gray-500 mt-1">Define how the agent should behave, its goals, and any constraints.</p>
                   </div>
               </div>

               {/* Tools / API Integration Card */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Wrench size={20} /> Agent Tools / API Calls</h2>
                   <div className="space-y-4">
                       {/* CRM Integration Example */}
                       <div>
                           <h3 className="text-sm font-medium text-gray-700 mb-2">External API Integration</h3>
                           <div>
                               <label htmlFor="credential" className="block text-xs font-medium text-gray-600 mb-1">
                                   API Authentication Credential
                               </label>
                               <div className="flex items-center gap-2">
                                   <select
                                       id="credential"
                                       name="toolCredentialId"
                                       value={selectedCredentialId || ''}
                                       onChange={handleCredentialSelect}
                                       className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                   >
                                       <option value="">-- Select Saved Credential --</option>
                                       {availableCredentials.map(cred => (
                                           <option key={cred.id} value={cred.id}>
                                               {cred.name} ({cred.type.replace('_', ' ')})
                                           </option>
                                       ))}
                                   </select>
                                   <Link 
                                       href="/settings/credentials/new"
                                       className="text-sm text-indigo-600 hover:underline whitespace-nowrap"
                                       title="Add New Credential"
                                       target="_blank"
                                   >
                                       + Add New
                                   </Link>
                               </div>
                               {selectedCredentialId && (
                                   <p className="text-xs text-gray-500 mt-1">
                                       Using saved credential: <span className="font-mono">••••••••••</span>
                                   </p>
                               )}
                           </div>
                           {/* API Endpoint Configuration */}
                           <div className="mt-4">
                               <label htmlFor="apiEndpoint" className="block text-xs font-medium text-gray-600 mb-1">
                                   API Endpoint URL (Optional)
                               </label>
                               <input
                                   type="url"
                                   id="apiEndpoint"
                                   name="apiEndpoint"
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                   placeholder="https://api.example.com/v1/resource"
                               />
                               <p className="text-xs text-gray-500 mt-1">
                                   The endpoint your agent will call to retrieve or send data
                               </p>
                           </div>
                       </div>
                       
                       {/* Security Notice */}
                       <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-4">
                           <div className="flex items-start">
                               <Key size={16} className="text-yellow-600 mr-2 mt-0.5" />
                               <p className="text-xs text-yellow-700">
                                   <strong>Security Note:</strong> API keys and credentials are securely stored and never exposed in client-side code. Your agent will only have access to the credentials you explicitly grant.
                               </p>
                           </div>
                       </div>
                   </div>
               </div>

                {/* Knowledge Base Card (Placeholder) */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Upload size={20} /> Knowledge Base</h2>
                   <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-4 text-center">
                       <p className="mb-2">Connect data sources or upload documents.</p>
                       <button type="button" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Upload Documents</button>
                       <span className="mx-2 text-gray-300">or</span>
                       <button type="button" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Connect Data Source</button>
                       <p className="text-xs mt-2">(Feature Placeholder)</p>
                   </div>
               </div>
           </div>

           {/* Right Column: Voice, Integrations, Testing */}
           <div className="lg:col-span-1 space-y-6">
                {/* Voice Selection Card */}
                <div className="bg-white rounded-xl shadow-md p-0 border border-gray-100 overflow-hidden">
                   <div className="p-6 border-b border-gray-100"> {/* Add padding and border */}
                        <h2 className="text-lg font-semibold text-gray-800 mb-0 flex items-center gap-2"><Bot size={20}/> Agent Voice</h2>
                    </div>
                   {/* VoiceSelector component will have its own internal padding */}
                   <VoiceSelector
                       voices={availableVoices}
                       selectedVoice={selectedVoiceName}
                       onSelectVoice={handleVoiceSelect}
                   />
               </div>

               {/* Integrations Card (Placeholder) */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Settings size={20} /> Integrations</h2>
                   <div className="text-sm text-gray-500">
                       <p>Connect this agent to channels like Phone, Web Chat, etc.</p>
                       <button type="button" className="mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Configure Integrations</button>
                       <p className="text-xs mt-1">(Feature Placeholder)</p>
                   </div>
               </div>

               {/* Testing Card (Placeholder) */}
               <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                   <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><MessageSquare size={20} /> Test Agent</h2>
                   <div className="text-sm text-gray-500">
                       <p>Try out your agent&apos;s responses.</p>
                       <input type="text" placeholder="Enter test message..." className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"/>
                       <button type="button" className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200">Send</button>
                       <p className="text-xs mt-1">(Feature Placeholder)</p>
                   </div>
               </div>
           </div>
      </div>
    </form>
  );
}
