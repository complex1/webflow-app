export const isDebugEnabled = () => process.env.DEBUG_LOGS === 'true';

export const logDebug = (...args: unknown[]) => {
  if (isDebugEnabled()) {
    console.log(...args);
  }
};
