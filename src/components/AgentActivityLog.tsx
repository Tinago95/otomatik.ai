"use client"; // Needs state for filtering

import React from 'react';
import Link from 'next/link';
import type { Interaction, InteractionOutcome } from '@/app/types';

interface AgentActivityLogProps {
  interactions: Interaction[];
}

export default function AgentActivityLog({ interactions }: AgentActivityLogProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
      {interactions.length === 0 ? (
        <p className="text-gray-500">No activity recorded yet</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interactions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(interaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/agents/${interaction.agentId}`} className="text-indigo-600 hover:underline">
                      {interaction.agentName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {interaction.channel.charAt(0).toUpperCase() + interaction.channel.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(interaction.outcome)}`}>
                      {interaction.outcome.charAt(0).toUpperCase() + interaction.outcome.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{interaction.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getOutcomeColor(outcome: InteractionOutcome): string {
  switch (outcome) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'failure': return 'bg-red-100 text-red-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'escalated': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
