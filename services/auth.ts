import type { User } from '@/types/user';

import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

type SignInRequest = {
  username: string;
  password: string;
};

type AuthUserResponse = ApiSuccessResponse<{
  user: User;
}>;

type LogoutResponse = ApiSuccessResponse<Record<string, never>>;

const normalizeUser = (user: User): User => ({
  ...user,
  isAdmin: user.isAdmin ?? user.is_admin ?? false,
  isSubstitute: user.isSubstitute ?? user.is_substitute ?? false,
});

export const signIn = async (
  username: string,
  password: string,
): Promise<User> => {
  try {
    const { data } = await apiClient.post<AuthUserResponse>('/api/auth/login', {
      username,
      password,
    } satisfies SignInRequest);

    return normalizeUser(data.user);
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

export const getCurrentUser = async (): Promise<User> => {
  try {
    const { data } = await apiClient.get<AuthUserResponse>('/api/auth/me');

    return normalizeUser(data.user);
  } catch (error) {
    const apiError = parseApiError(error);
    throw new Error(apiError.message);
  }
};
