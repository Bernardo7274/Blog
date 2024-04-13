//util formated internal error or external api error

export const errorMessage = (
   error: any,
   path: string,
   method: string
): { error: string; status: number } => ({
   error: `Error ${path} (method: ${method}): ${error?.response?.data?.message || error}`,
   status: error.response?.data?.statusCode || 500,
});
