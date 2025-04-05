"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { CredentialFormData } from '@/app/types';

interface CredentialFormProps {
  onSubmit: SubmitHandler<CredentialFormData>;
  defaultValues?: Partial<CredentialFormData>;
  isLoading?: boolean;
}

export default function CredentialForm({ onSubmit, defaultValues = {}, isLoading = false }: CredentialFormProps) {
  const router = useRouter();
  const [showSecret, setShowSecret] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CredentialFormData>({
    defaultValues: {
      name: '',
      type: 'api_key',
      description: '',
      value: '',
      ...defaultValues
    }
  });
  
  const credentialType = watch('type');
  
  const toggleSecretVisibility = () => {
    setShowSecret(!showSecret);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/settings/credentials" className="text-sm text-indigo-600 hover:underline flex items-center mb-1">
            <ArrowLeft size={16} className="mr-1"/> Back to Credentials
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Add New Credential</h1>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${isLoading ? 'cursor-wait' : ''}`}
        >
          {isLoading ? 'Saving...' : 'Save Credential'}
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mr-4">
            <Key className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">Credential Details</h2>
            <p className="text-sm text-gray-500">Add a new API key or authentication credential</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Credential Name
            </label>
            <input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., OpenAI API Key"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Type Select */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Credential Type
            </label>
            <select
              id="type"
              {...register('type', { required: 'Type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            >
              <option value="api_key">API Key</option>
              <option value="bearer_token">Bearer Token</option>
              <option value="basic_auth">Basic Auth</option>
              <option value="oauth2">OAuth2</option>
              <option value="custom">Custom</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="What this credential is used for"
            ></textarea>
          </div>

          {/* Value Input with Toggle Visibility */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              {credentialType === 'api_key' ? 'API Key' : 
               credentialType === 'bearer_token' ? 'Token' : 
               credentialType === 'basic_auth' ? 'Username:Password' : 
               credentialType === 'oauth2' ? 'Access Token' : 
               'Value'}
            </label>
            <div className="relative">
              <input
                id="value"
                type={showSecret ? 'text' : 'password'}
                {...register('value', { required: 'Value is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                placeholder={credentialType === 'api_key' ? 'sk-...' : 
                           credentialType === 'bearer_token' ? 'Bearer token value' : 
                           credentialType === 'basic_auth' ? 'username:password' : 
                           credentialType === 'oauth2' ? 'OAuth2 token' : 
                           'Enter credential value'}
              />
              <button
                type="button"
                onClick={toggleSecretVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This value will be securely stored and never exposed in client-side code.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
