export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

    // Proxy til backend health check
    const response = await fetch(`${backendUrl}/health/ready`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout på 5 sekunder
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      return Response.json(
        {
          status: 'error',
          message: 'Backend returnerte feilstatus',
          checks: {}
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Health check proxy error:', error)

    return Response.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Kunne ikke nå backend',
        checks: {}
      },
      { status: 503 }
    )
  }
}
