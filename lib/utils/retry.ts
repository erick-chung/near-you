// This function converts setTimeout into a Promise-based delay that works with async/await
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms)); // We wrap setTimeout in a promise so that it actually waits for the delay to finish before trying again
}

// This is a generic function that can retry any async operation
export async function retryWithBackoff<T>( // <T> is a generic type parameter, placeholder for any return type
  functionToRetry: () => Promise<T>, // Takes a funcion that returns a Promise of type T
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  // Returns the same type as the input function
  // First, we need to track how many attempts we've made
  let attempt = 1;

  // We need a loop that keeps trying
  while (attempt <= maxAttempts) {
    // While loop will keep re-running the entire try/catch block until either the while condition is no longer met or we early return because result was successful
    try {
      // Try the function here
      const result = await functionToRetry();

      // If it works, return result
      return result; // If successful, return immediately (exists function)

      // If it fails, wait and try again
    } catch (err) {
      attempt++;

      // Check if we have more attemps lefts BEFORE DELAYING
      if (attempt <= maxAttempts) {
        // We have more attempts, so delay and continue
        await delay(baseDelay * 2 ** (attempt - 1)); // Exponential increase
      } else {
        // No more attempts, give up and throw error
        throw err;
      }
    }
  }
  // Add this line because Typescript sees that your function promises to return Promise<T> but theoretically the while loop could exit without hitting a return statement. So, we add a fallback return/throw after the while loop
  throw new Error("Max attempts exceeded");
}
