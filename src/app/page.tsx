"use client"; 

import { useState } from 'react';
import Link from 'next/link';
import AgentActivityLog from '@/components/AgentActivityLog';
import { Bot, PlusSquare } from 'lucide-react';
import type { Agent, Interaction, AgentStatus } from '@/app/types'; 

// Sample Data (replace with actual data fetching, possibly in a Server Component parent or via useEffect)
const sampleAgents: Agent[] = [
    { id: 'agent1', name: 'Sales Demo Booker', description: 'Qualifies leads and books demos via webchat.', status: 'active', createdAt: '2025-04-01T10:00:00Z', voiceId: 'voice3' },
    { id: 'agent2', name: 'Support Tier 1', description: 'Answers common questions from the knowledge base.', status: 'active', createdAt: '2025-03-25T14:30:00Z', voiceId: 'voice1' },
    { id: 'agent3', name: 'Order Status Checker', description: 'Checks order status via API integration (Phone).', status: 'inactive', createdAt: '2025-04-05T09:15:00Z', voiceId: 'voice2' },
    { id: 'agent4', name: 'Internal HR Helper', description: 'Answers policy questions for employees.', status: 'draft', createdAt: '2025-04-10T11:00:00Z' },
];

const sampleInteractions: Interaction[] = [
    { id: 'int1', timestamp: '2025-04-10T14:35:00Z', agentId: 'agent1', agentName: 'Sales Demo Booker', channel: 'webchat', outcome: 'success', summary: 'Booked demo for user@example.com' },
    { id: 'int2', timestamp: '2025-04-10T14:32:00Z', agentId: 'agent2', agentName: 'Support Tier 1', channel: 'webchat', outcome: 'success', summary: 'Answered question about pricing.' },
    { id: 'int3', timestamp: '2025-04-10T13:15:00Z', agentId: 'agent1', agentName: 'Sales Demo Booker', channel: 'webchat', outcome: 'failure', summary: 'User asked question outside scope.' },
    { id: 'int4', timestamp: '2025-04-09T16:01:00Z', agentId: 'agent2', agentName: 'Support Tier 1', channel: 'webchat', outcome: 'escalated', summary: 'User requested human agent.' },
];


export default function DashboardPage() {
  // In a real app, you'd fetch this data, possibly using useEffect or
  // a data fetching library compatible with Client Components, or pass
  // it down from a Server Component parent.
  const [agents] = useState<Agent[]>(sampleAgents);
  const [recentInteractions] = useState<Interaction[]>(sampleInteractions);

  const getStatusColor = (status: AgentStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Header Section (inside main content area now) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Agents</h1>
        {/* Link uses app router convention */}
        <Link href="/agents/new" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusSquare size={18} className="mr-2 -ml-1" />
          Create New Agent
        </Link>
      </div>

      {/* Agent List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                  <Bot size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{agent.name}</h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Created: {new Date(agent.createdAt).toLocaleDateString()}</span>
              {/* Link uses app router convention */}
              <Link href={`/agents/${agent.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                  Configure →
              </Link>
            </div>
          </div>
        ))}
        {/* "Create Agent" card */}
        <Link href="/agents/new" className="bg-white rounded-xl shadow-md p-5 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors duration-200 flex flex-col items-center justify-center text-center text-gray-500 hover:text-indigo-600">
          <PlusSquare size={32} className="mb-2" />
          <span className="font-medium">Create New Agent</span>
          <span className="text-xs mt-1">Define a new AI assistant for your tasks</span>
        </Link>
      </div>

      {/* Recent Activity Log */}
      <AgentActivityLog interactions={recentInteractions} />
    </>
  );
}
