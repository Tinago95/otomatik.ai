// File: types/index.ts

export interface Voice {
  id: string;
  name: string;
  description: string;
  preview?: string; // URL to audio preview file
}

export type AgentStatus = 'active' | 'inactive' | 'draft';
export type InteractionOutcome = 'success' | 'failure' | 'in-progress' | 'escalated'; // Example outcomes
export type InteractionChannel = 'phone' | 'webchat' | 'email' | 'api'; // Example channels
export type CredentialType = 'api_key' | 'bearer_token' | 'basic_auth' | 'oauth2' | 'custom';

// Represents an AI Agent configuration
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  createdAt: string; // ISO 8601 date string
  voiceId?: string; // Link to the selected voice
  prompt?: string; // Core instructions for the agent
  knowledgeBaseIds?: string[]; // IDs of linked knowledge sources
  toolCredentialIds?: string[]; // IDs of linked credentials for tools/integrations
  // Add other config fields like goals, integrations, etc.
}

// Represents a log entry of an agent interaction
export interface Interaction {
  id: string;
  timestamp: string; // ISO 8601 date string
  agentId: string;
  agentName: string; // Denormalized for easy display
  channel: InteractionChannel;
  outcome: InteractionOutcome;
  summary?: string; // Brief summary of the interaction
  userId?: string; // Identifier for the end-user if available
  durationSeconds?: number; // Duration if applicable (e.g., for calls)
}

// Used for the agent detail/configuration page
export interface AgentDetailData extends Agent {
  // Include more detailed fields needed for configuration
  selectedVoiceName?: string; // Example: pre-fetch voice name
  // Add fields for integrations, knowledge base details etc.
}

// Represents a securely stored credential
export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  description?: string;
  createdAt: string; // ISO 8601 date string
  lastUsed?: string; // ISO 8601 date string
  // The actual secret value is never stored in the frontend
  // Only a masked representation might be shown
}

// Form data for creating/editing a credential
export interface CredentialFormData {
  name: string;
  type: CredentialType;
  description?: string;
  value?: string; // For API keys, bearer tokens
  username?: string; // For basic auth
  password?: string; // For basic auth
  clientId?: string; // For OAuth2
  clientSecret?: string; // For OAuth2
  authorizationUrl?: string; // For OAuth2
  tokenUrl?: string; // For OAuth2
  scopes?: string[]; // For OAuth2
}