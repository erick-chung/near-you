/**
 * Converts setTimeout into a Promise-based delay for use with async/await
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries an async operation with exponential backoff
 * @param functionToRetry - The async function to retry
 * @param maxAttempts - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds for exponential backoff (default: 1000ms)
 * @returns Promise resolving to the function's return value
 * @throws The last error encountered if all attempts fail
 */
export async function retryWithBackoff<T>(
  functionToRetry: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      const result = await functionToRetry();
      return result;
    } catch (err) {
      attempt++;
      
      if (attempt <= maxAttempts) {
        // Exponential backoff: delay increases with each attempt
        await delay(baseDelay * 2 ** (attempt - 1));
      } else {
        // All attempts exhausted, throw the last error
        throw err;
      }
    }
  }

  throw new Error("Max attempts exceeded");
}