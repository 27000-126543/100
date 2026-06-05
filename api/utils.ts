import type { ApiResponse } from '../shared/types.js';

export const createResponse = <T>(data: T, message = 'success', code = 200): ApiResponse<T> => {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
    success: true,
  };
};

export const createError = (message: string, code = 400): ApiResponse<null> => {
  return {
    code,
    message,
    data: null,
    timestamp: Date.now(),
    success: false,
  };
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateId = () => Math.random().toString(36).substring(2, 11);

export const getUserId = (req: { headers?: Record<string, string> }): string => {
  return 'user_001';
};
