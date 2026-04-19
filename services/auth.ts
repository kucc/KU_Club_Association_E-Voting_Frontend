import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

type SignInRequest = {
  username: string;
  password: string;
};

type AuthUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type AuthUserResponse = ApiSuccessResponse<{
  user: AuthUser;
}>;

type LogoutResponse = ApiSuccessResponse<Record<string, never>>;

export const signIn = async (
  username: string,
  password: string,
): Promise<AuthUser> => {
  try {
    const { data } = await apiClient.post<AuthUserResponse>('/api/auth/login', {
      username,
      password,
    } satisfies SignInRequest);

    return data.user;
  } catch (error) {
    const apiError = parseApiError(error);
    throw new Error(apiError.message);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post<LogoutResponse>('/api/auth/logout');
  } catch (error) {
    const apiError = parseApiError(error);
    throw new Error(apiError.message);
  }
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const { data } = await apiClient.get<AuthUserResponse>('/api/auth/me');

    return data.user;
  } catch (error) {
    const apiError = parseApiError(error);
    throw new Error(apiError.message);
  }
};
