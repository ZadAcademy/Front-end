/**
 * Helper to unwrap server action responses that return { serverError: any }
 * This prevents Next.js from throwing generic digest errors when a server action fails.
 */
export const unwrap = async <T>(promise: Promise<T | { serverError: any }>): Promise<T> => {
  const res = await promise;
  if (res && typeof res === 'object' && 'serverError' in res) {
    throw new Error(res.serverError as string);
  }
  return res as T;
};
