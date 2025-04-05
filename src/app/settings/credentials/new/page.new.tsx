"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import type { CredentialFormData } from '@/app/types';
import CredentialForm from '@/components/forms/credentials/CredentialForm';

export default function NewCredentialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: SubmitHandler<CredentialFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Saving credential:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to credentials list
      router.push('/settings/credentials');
    } catch (err) {
      console.error('Error saving credential:', err);
      setError('Failed to save credential. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-bold mr-2">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <CredentialForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}
