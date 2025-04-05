"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { CredentialFormData } from '@/app/types';

export default function NewCredentialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CredentialFormData>({
    name: '',
    type: 'api_key',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate based on credential type
    switch (formData.type) {
      case 'api_key':
      case 'bearer_token':
        if (!formData.value?.trim()) {
          newErrors.value = 'Value is required';
        }
        break;
      case 'basic_auth':
        if (!formData.username?.trim()) {
          newErrors.username = 'Username is required';
        }
        if (!formData.password?.trim()) {
          newErrors.password = 'Password is required';
        }
        break;
      case 'oauth2':
        if (!formData.clientId?.trim()) {
          newErrors.clientId = 'Client ID is required';
        }
        if (!formData.clientSecret?.trim()) {
          newErrors.clientSecret = 'Client Secret is required';
        }
        if (!formData.authorizationUrl?.trim()) {
          newErrors.authorizationUrl = 'Authorization URL is required';
        }
        if (!formData.tokenUrl?.trim()) {
          newErrors.tokenUrl = 'Token URL is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Mock successful creation
      console.log('Credential created:', formData);
      
      // Navigate back to credentials list
      router.push('/settings/credentials');
    } catch (error) {
      console.error('Error creating credential:', error);
      setErrors({ form: 'Failed to create credential. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (formData.type) {
      case 'api_key':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="value"
                name="value"
                value={formData.value || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.value ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your API key"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
            </div>
          </div>
        );
        
      case 'bearer_token':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Bearer Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="value"
                name="value"
                value={formData.value || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.value ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your bearer token"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
            </div>
          </div>
        );
        
      case 'basic_auth':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>
        );
        
      case 'oauth2':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                Client ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={formData.clientId || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.clientId ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter client ID"
              />
              {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
            </div>
            
            <div>
              <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-1">
                Client Secret <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showClientSecret ? "text" : "password"}
                  id="clientSecret"
                  name="clientSecret"
                  value={formData.clientSecret || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.clientSecret ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter client secret"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowClientSecret(!showClientSecret)}
                >
                  {showClientSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.clientSecret && <p className="mt-1 text-sm text-red-600">{errors.clientSecret}</p>}
            </div>
            
            <div>
              <label htmlFor="authorizationUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Authorization URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="authorizationUrl"
                name="authorizationUrl"
                value={formData.authorizationUrl || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.authorizationUrl ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="https://example.com/oauth/authorize"
              />
              {errors.authorizationUrl && <p className="mt-1 text-sm text-red-600">{errors.authorizationUrl}</p>}
            </div>
            
            <div>
              <label htmlFor="tokenUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Token URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="tokenUrl"
                name="tokenUrl"
                value={formData.tokenUrl || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.tokenUrl ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="https://example.com/oauth/token"
              />
              {errors.tokenUrl && <p className="mt-1 text-sm text-red-600">{errors.tokenUrl}</p>}
            </div>
          </div>
        );
        
      case 'custom':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Value <span className="text-red-500">*</span>
              </label>
              <textarea
                id="value"
                name="value"
                value={formData.value || ''}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border ${errors.value ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter your custom credential value (JSON, connection string, etc.)"
              />
              {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/settings/credentials" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Credentials
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg mr-4">
            <Key size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Add New Credential</h1>
            <p className="text-sm text-gray-600">Securely store API keys and authentication details</p>
          </div>
        </div>
        
        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Credential Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., OpenAI API Key, CRM Access Token"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Credential Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="api_key">API Key</option>
                  <option value="bearer_token">Bearer Token</option>
                  <option value="basic_auth">Basic Auth (Username/Password)</option>
                  <option value="oauth2">OAuth 2.0</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What is this credential used for?"
                />
              </div>
            </div>
            
            {/* Type-specific fields */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-700 mb-4">Credential Details</h3>
              {renderFormFields()}
            </div>
            
            {/* Security Notice */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                <strong>Security Note:</strong> Credentials are securely stored and encrypted. They are never exposed in client-side code or logs.
              </p>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/settings/credentials"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
              >
                {isSubmitting ? 'Saving...' : 'Save Credential'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
