"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Key, Plus, Trash2, Edit } from 'lucide-react';
import type { Credential } from '@/app/types';

// Sample data - in a real app, this would be fetched from an API
const sampleCredentials: Credential[] = [
  { 
    id: 'cred1', 
    name: 'OpenAI API Key', 
    type: 'api_key', 
    description: 'Used for agent completions and embeddings', 
    createdAt: '2025-03-15T10:00:00Z',
    lastUsed: '2025-04-04T15:30:00Z'
  },
  { 
    id: 'cred2', 
    name: 'CRM API Token', 
    type: 'bearer_token', 
    description: 'For customer data lookup', 
    createdAt: '2025-03-20T14:30:00Z',
    lastUsed: '2025-04-03T09:45:00Z'
  },
  { 
    id: 'cred3', 
    name: 'Database Credentials', 
    type: 'basic_auth', 
    description: 'Read-only access to analytics database', 
    createdAt: '2025-03-25T11:15:00Z'
  },
];

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchCredentials = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        setCredentials(sampleCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      // In a real app, this would be an API call
      setCredentials(credentials.filter(cred => cred.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const getCredentialTypeLabel = (type: string): string => {
    switch (type) {
      case 'api_key': return 'API Key';
      case 'bearer_token': return 'Bearer Token';
      case 'basic_auth': return 'Basic Auth';
      case 'oauth2': return 'OAuth 2.0';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Credentials</h1>
          <p className="text-sm text-gray-600 mt-1">
            Securely manage API keys and authentication credentials for your agents
          </p>
        </div>
        <Link href="/settings/credentials/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Plus size={18} className="mr-2 -ml-1" />
          Add New Credential
        </Link>
      </div>

      {credentials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <Key size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Credentials Found</h2>
          <p className="text-gray-500 mb-6">
            You haven&apos;t added any API keys or authentication credentials yet.
          </p>
          <Link href="/settings/credentials/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Plus size={18} className="mr-2 -ml-1" />
            Add Your First Credential
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {credentials.map((credential) => (
                <tr key={credential.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{credential.name}</div>
                    <div className="text-xs text-gray-500 font-mono">••••••••••••</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCredentialTypeLabel(credential.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{credential.description || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(credential.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {credential.lastUsed 
                      ? new Date(credential.lastUsed).toLocaleDateString() 
                      : 'Never used'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/settings/credentials/${credential.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(credential.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete this credential? This action cannot be undone and may affect agents using this credential.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
