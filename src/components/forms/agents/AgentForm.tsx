"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { ChevronLeft, Save, Info, BrainCircuit, Upload, Bot, Wrench, Key } from 'lucide-react';
import VoiceSelector from '@/components/VoiceSelector';
import type { AgentDetailData, Voice, Credential } from '@/app/types';

interface AgentFormProps {
  onSubmit: SubmitHandler<Partial<AgentDetailData>>;
  defaultValues?: Partial<AgentDetailData>;
  isLoading?: boolean;
  availableVoices: Voice[];
  availableCredentials: Credential[];
  isNewAgent?: boolean;
}

export default function AgentForm({
  onSubmit,
  defaultValues = {},
  isLoading = false,
  availableVoices,
  availableCredentials,
  isNewAgent = false
}: AgentFormProps) {
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(defaultValues.selectedVoiceName || 'Rachel');
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<AgentDetailData>>({
    defaultValues: {
      name: '',
      description: '',
      status: 'draft',
      prompt: '',
      knowledgeBaseIds: [],
      toolCredentialIds: [],
      ...defaultValues
    }
  });
  
  const selectedCredentialId = watch('toolCredentialIds')?.[0] || '';
  
  const handleVoiceSelect = (voiceName: string, voiceId: string) => {
    setSelectedVoiceName(voiceName);
    setValue('voiceId', voiceId);
    setValue('selectedVoiceName', voiceName);
  };
  
  const handleCredentialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const credentialId = e.target.value;
    setValue('toolCredentialIds', credentialId ? [credentialId] : []);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <Link href="/" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
            <ChevronLeft size={16} className="mr-1"/> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">
            {isNewAgent ? 'Create New Agent' : 'Edit Agent'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${isLoading ? 'cursor-wait' : ''}`}
        >
          <Save size={18} className="mr-2 -ml-1" />
          {isLoading ? (isNewAgent ? 'Creating...' : 'Saving...') : (isNewAgent ? 'Create Agent' : 'Save Changes')}
        </button>
      </div>

      {/* Configuration Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info size={20} /> Basic Information
            </h2>
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <input 
                  id="name"
                  {...register('name', { required: 'Agent name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
                  placeholder="e.g., Customer Support Bot"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              {/* Description Textarea */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / Purpose</label>
                <textarea 
                  id="description"
                  {...register('description')}
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
                  placeholder="Briefly describe what this agent does"
                ></textarea>
              </div>
              
              {/* Status Select */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  id="status"
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Behavior / Prompt Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BrainCircuit size={20} /> Agent Behavior (Prompt)
            </h2>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">System Prompt / Instructions</label>
              <textarea 
                id="prompt"
                {...register('prompt')}
                rows={10} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono" 
                placeholder="Enter the core instructions, personality, and guidelines for the AI agent..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Define how the agent should behave, its goals, and any constraints.</p>
            </div>
          </div>

          {/* Tools / API Integration Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench size={20} /> Agent Tools / API Calls
            </h2>
            <div className="space-y-4">
              {/* API Integration */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">External API Integration</h3>
                <div>
                  <label htmlFor="credential" className="block text-xs font-medium text-gray-600 mb-1">
                    API Authentication Credential
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="credential"
                      value={selectedCredentialId}
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
                    {...register('apiEndpoint')}
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
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload size={20} /> Knowledge Base
            </h2>
            <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-4 text-center">
              <p className="mb-2">Connect data sources or upload documents.</p>
              <button type="button" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Upload Documents</button>
              <span className="mx-2 text-gray-300">or</span>
              <button type="button" className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">Connect Data Source</button>
              <p className="text-xs mt-2">(Feature Placeholder)</p>
            </div>
          </div>
        </div>

        {/* Right Column: Voice, Integrations */}
        <div className="lg:col-span-1 space-y-6">
          {/* Voice Selection Card */}
          <div className="bg-white rounded-xl shadow-md p-0 border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-0 flex items-center gap-2">
                <Bot size={20}/> Agent Voice
              </h2>
            </div>
            <VoiceSelector
              voices={availableVoices}
              selectedVoice={selectedVoiceName}
              onSelectVoice={handleVoiceSelect}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
