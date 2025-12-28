/**
 * SSE Broadcasting Utility
 * Shared utility for broadcasting SSE events to all connected clients
 */

import type { SSEEventType } from '@/types/sse'

// Keep track of connected clients
// Note: This works per serverless instance. For multi-instance deployments,
// consider using Redis/Vercel KV for pub/sub
export const sseClients = new Map<string, ReadableStreamDefaultController>()

let eventId = 0

/**
 * Format SSE message according to spec
 */
export function formatSSEMessage(eventType: SSEEventType, data: unknown): string {
  const id = ++eventId
  const jsonData = JSON.stringify({
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
  })

  return `id: ${id}\nevent: ${eventType}\ndata: ${jsonData}\n\n`
}

/**
 * Broadcast event to all connected SSE clients
 */
export function broadcastSSE(eventType: SSEEventType, data: unknown) {
  const message = formatSSEMessage(eventType, data)

  sseClients.forEach((controller, clientId) => {
    try {
      controller.enqueue(message)
    } catch (error) {
      console.error(`Failed to send to client ${clientId}:`, error)
      // Remove disconnected clients
      sseClients.delete(clientId)
    }
  })
}
