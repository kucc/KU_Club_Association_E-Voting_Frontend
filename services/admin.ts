import type { User } from '@/types/user';

import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

type CreateUserRequest = {
  username: string;
  password: string;
  isAdmin: boolean;
};

type CreateUserResponse = ApiSuccessResponse<{
  user: User;
}>;

type DeleteUserRequest = {
  userName: string;
};

type DeletedUser = {
  id: number;
  username: string;
  password_hash: string;
};

type DeleteUserResponse = ApiSuccessResponse<{
  user: DeletedUser;
}>;

type EditUserRequest = {
  userName: string;
  changeName: string | null;
  changePw: string | null;
};

type EditedUser = {
  id: number;
  username: string;
};

type EditUserResponse = ApiSuccessResponse<{
  user: EditedUser;
}>;

export const createUser = async (
  username: string,
  password: string,
  isAdmin: boolean,
): Promise<User> => {
  try {
    const { data } = await apiClient.post<CreateUserResponse>(
      '/api/admin/create-user',
      {
        username,
        password,
        isAdmin,
      } satisfies CreateUserRequest,
    );

    return data.user;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const deleteUser = async (userName: string): Promise<DeletedUser> => {
  try {
    const { data } = await apiClient.delete<DeleteUserResponse>(
      '/api/admin/delete-user',
      {
        data: { userName } satisfies DeleteUserRequest,
      },
    );

    return data.user;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};

export const editUser = async (
  userName: string,
  updates: { changeName?: string; changePw?: string },
): Promise<EditedUser> => {
  try {
    const payload: EditUserRequest = {
      userName,
      changeName: updates.changeName ?? null,
      changePw: updates.changePw ?? null,
    };

    const { data } = await apiClient.put<EditUserResponse>(
      '/api/admin/edit-user',
      payload,
    );

    return data.user;
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};
