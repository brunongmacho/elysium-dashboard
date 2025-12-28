/**
 * Server-Sent Events (SSE) Endpoint
 * Provides real-time updates for boss timers, rotations, and leaderboards
 */

import { NextRequest } from 'next/server'
import { sseClients, formatSSEMessage } from '@/lib/sse-broadcast'

// Force dynamic rendering - prevents static generation
export const dynamic = 'force-dynamic'

/**
 * SSE GET endpoint - establishes connection
 */
export async function GET(request: NextRequest) {
  const clientId = crypto.randomUUID()
  const encoder = new TextEncoder()

  // Store the client connection
  let controller: ReadableStreamDefaultController

  const readable = new ReadableStream({
    start(ctrl) {
      controller = ctrl
      sseClients.set(clientId, controller)

      // Send initial connection event
      const connectMessage = formatSSEMessage('connected', {
        clientId,
        timestamp: new Date().toISOString(),
      })
      controller.enqueue(encoder.encode(connectMessage))

      // Send initial heartbeat
      const heartbeat = formatSSEMessage('heartbeat', {
        timestamp: new Date().toISOString(),
      })
      controller.enqueue(encoder.encode(heartbeat))
    },
    cancel() {
      // Clean up when client disconnects
      sseClients.delete(clientId)
      console.log(`SSE client disconnected: ${clientId}`)
    },
  })

  // Set up heartbeat to keep connection alive (every 30 seconds)
  const heartbeatInterval = setInterval(() => {
    if (controller && sseClients.has(clientId)) {
      try {
        const heartbeat = formatSSEMessage('heartbeat', {
          timestamp: new Date().toISOString(),
        })
        controller.enqueue(encoder.encode(heartbeat))
      } catch (error) {
        console.error('Heartbeat failed:', error)
        clearInterval(heartbeatInterval)
        sseClients.delete(clientId)
      }
    } else {
      clearInterval(heartbeatInterval)
    }
  }, 30000) // 30 seconds

  // Return SSE response
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in nginx
    },
  })
}
