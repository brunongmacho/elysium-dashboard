/**
 * Server-Sent Events (SSE) Endpoint
 * Provides real-time updates for boss timers, rotations, and leaderboards
 */

import { NextRequest } from 'next/server'
import { sseClients, formatSSEMessage } from '@/lib/sse-broadcast'

/**
 * SSE GET endpoint - establishes connection
 */
export async function GET(request: NextRequest) {
  const clientId = crypto.randomUUID()

  // Create a TransformStream for SSE
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Send initial connection event
  const connectMessage = formatSSEMessage('connected', {
    clientId,
    timestamp: new Date().toISOString(),
  })
  writer.write(encoder.encode(connectMessage))

  // Store the client connection
  // Note: We can't directly store the writer, so we'll use a custom controller
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
      controller.enqueue(connectMessage)

      // Send initial heartbeat
      const heartbeat = formatSSEMessage('heartbeat', {
        timestamp: new Date().toISOString(),
      })
      controller.enqueue(heartbeat)
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
        controller.enqueue(heartbeat)
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
