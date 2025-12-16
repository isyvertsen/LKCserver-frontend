// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

// Norwegian error messages
export const norwegianErrorMessages = {
  generic: {
    somethingWentWrong: 'Noe gikk galt. Vennligst prøv igjen.',
    unknownError: 'En ukjent feil oppstod.'
  },
  network: {
    connectionFailed: 'Kunne ikke koble til serveren. Sjekk internettforbindelsen din.',
    timeout: 'Forespørselen tok for lang tid. Vennligst prøv igjen.',
    offline: 'Du er frakoblet. Sjekk internettforbindelsen din.'
  },
  server: {
    internal: 'En serverfeil oppstod. Vennligst prøv igjen senere.',
    unavailable: 'Tjenesten er ikke tilgjengelig. Vennligst prøv igjen senere.',
    maintenance: 'Systemet er under vedlikehold. Vennligst prøv igjen senere.'
  },
  authentication: {
    required: 'Du må logge inn for å fortsette.',
    invalid: 'Ugyldig brukernavn eller passord.',
    expired: 'Økten din har utløpt. Vennligst logg inn igjen.'
  },
  authorization: {
    forbidden: 'Du har ikke tilgang til denne ressursen.',
    insufficientPermissions: 'Du har ikke nødvendige tillatelser.'
  },
  notFound: {
    resource: 'Den forespurte ressursen ble ikke funnet.',
    page: 'Siden du leter etter finnes ikke.'
  },
  validation: {
    required: 'Dette feltet er påkrevd.',
    invalid: 'Ugyldig verdi.',
    tooShort: 'Verdien er for kort.',
    tooLong: 'Verdien er for lang.'
  }
}

// Get error type from error object
export function getErrorType(error: any): ErrorType {
  if (!error) return ErrorType.UNKNOWN

  // Check for network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return ErrorType.NETWORK
  }

  // Check for HTTP status codes
  if (error.response?.status || error.status) {
    const status = error.response?.status || error.status

    if (status === 401) return ErrorType.AUTHENTICATION
    if (status === 403) return ErrorType.AUTHORIZATION
    if (status === 404) return ErrorType.NOT_FOUND
    if (status >= 500) return ErrorType.SERVER
    if (status >= 400) return ErrorType.VALIDATION
  }

  return ErrorType.UNKNOWN
}

// Get error message from error object
export function getErrorMessage(error: any): string {
  if (!error) return norwegianErrorMessages.generic.somethingWentWrong

  // Check for custom error messages
  if (typeof error === 'string') return error
  if (error.message) return error.message
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.detail) return error.response.data.detail

  // Fallback to error type message
  const errorType = getErrorType(error)
  switch (errorType) {
    case ErrorType.NETWORK:
      return norwegianErrorMessages.network.connectionFailed
    case ErrorType.AUTHENTICATION:
      return norwegianErrorMessages.authentication.required
    case ErrorType.AUTHORIZATION:
      return norwegianErrorMessages.authorization.forbidden
    case ErrorType.NOT_FOUND:
      return norwegianErrorMessages.notFound.resource
    case ErrorType.SERVER:
      return norwegianErrorMessages.server.internal
    default:
      return norwegianErrorMessages.generic.somethingWentWrong
  }
}

// Get CRUD-specific error message
export function getCrudErrorMessage(
  operation: 'create' | 'update' | 'delete' | 'read',
  resource: string,
  error: any
): string {
  const errorType = getErrorType(error)
  const resourceNorwegian = resource // Could add translation mapping here

  const baseMessage = getErrorMessage(error)

  // Add operation context
  const operationMessages = {
    create: `Kunne ikke opprette ${resourceNorwegian}`,
    update: `Kunne ikke oppdatere ${resourceNorwegian}`,
    delete: `Kunne ikke slette ${resourceNorwegian}`,
    read: `Kunne ikke laste ${resourceNorwegian}`
  }

  const operationMessage = operationMessages[operation]

  // If we have a specific error message, combine them
  if (baseMessage && baseMessage !== norwegianErrorMessages.generic.somethingWentWrong) {
    return `${operationMessage}: ${baseMessage}`
  }

  return operationMessage
}

export function logError(error: Error, context?: string) {
  const timestamp = new Date().toISOString()
  const errorDetails = {
    timestamp,
    message: error.message,
    stack: error.stack,
    context,
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('[ERROR]', errorDetails)
  } else {
    console.error(`[${timestamp}] ${context || 'Error'}: ${error.message}`)
  }

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorDetails),
      }).catch((fetchError) => {
        console.error('Failed to log error to server:', fetchError)
      })
    } catch (e) {
      console.error('Failed to send error to server:', e)
    }
  }
}

export function formatError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  
  if (typeof error === 'string') {
    return new Error(error)
  }
  
  if (typeof error === 'object' && error !== null) {
    return new Error(JSON.stringify(error))
  }
  
  return new Error('An unknown error occurred')
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}