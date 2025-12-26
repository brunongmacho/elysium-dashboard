/**
 * Next.js Instrumentation
 * Runs once when the server starts
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate environment variables on server startup
    const { validateEnv } = await import('./lib/env-validation');
    try {
      validateEnv();
      console.log('✅ Environment variables validated successfully');
    } catch (error) {
      console.error('❌ Environment validation failed:');
      console.error(error);
      // Don't throw in production to allow build to succeed
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    }
  }
}
