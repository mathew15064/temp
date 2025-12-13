import { ZodError } from 'zod';
import { DefaultErrorShape } from '@trpc/server';

export const errorFormatter = ({ shape, error }): DefaultErrorShape => {
  // Handle Zod validation errors
  if (error.cause instanceof ZodError) {
    const zodError = error.cause;
    const fieldErrors = zodError.flatten().fieldErrors;

    return {
      ...shape,
      message:
        fieldErrors && Object.keys(fieldErrors).length > 0
          ? Object.entries(fieldErrors).map(([field, messages]) => ({
              field,
              message: messages?.[0],
            }))
          : [],
      data: {
        ...shape.data,
        httpStatus: 400,
        code: 'VALIDATION_ERROR',
        fields: fieldErrors,
      },
    };
  }

  // Map TRPC error codes to HTTP status codes
  const getHTTPStatusCode = (code: string): number => {
    const statusCodes = {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      TIMEOUT: 408,
      CONFLICT: 409,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      METHOD_NOT_SUPPORTED: 405,
      UNPROCESSABLE_CONTENT: 422,
      TOO_MANY_REQUESTS: 429,
      CLIENT_CLOSED_REQUEST: 499,
      INTERNAL_SERVER_ERROR: 500,
    };
    return statusCodes[code] || 500;
  };


  return {
    ...shape,
    message: shape.message,
    data: {
      ...shape.data,
      httpStatus: getHTTPStatusCode(error.code),
      code: error.code,
    },
  };
};
