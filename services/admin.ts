import type { User } from '@/types/user';

import { type ApiSuccessResponse, apiClient, parseApiError } from './api';

//  백엔드 실제 응답 타입 (snake_case) — 내부 전용
type AdminUserRaw = {
  id: number;
  username: string;
  is_admin: boolean;
  is_substitute: boolean;
  original_user_id: number | null;
  created_at: string;
};

// snake_case → camelCase 정규화 헬퍼
const normalizeUser = (u: AdminUserRaw): User => ({
  id: u.id,
  username: u.username,
  isAdmin: u.is_admin,
  isSubstitute: u.is_substitute,
  original_user_id: u.original_user_id,
});

//  요청/응답 타입
type CreateUserRequest = {
  username: string;
  password: string;
  isAdmin: boolean;
  isSubstitute: boolean;
  originalUserId: number | null;
};

// 응답 user는 AdminUserRaw 형태이므로 unknown으로 받아서 normalizeUser로 변환
type CreateUserResponse = ApiSuccessResponse<{
  user: unknown;
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

// 응답 users는 AdminUserRaw[] 형태이므로 unknown[]으로 받아서 map + normalizeUser
type UserListResponse = ApiSuccessResponse<{
  users: unknown[];
}>;

export const createUser = async (
  username: string,
  password: string,
  isAdmin: boolean,
  isSubstitute: boolean,
  originalUserId: number | null,
): Promise<User> => {
  try {
    const { data } = await apiClient.post<CreateUserResponse>(
      '/api/admin/create-user',
      {
        username,
        password,
        isAdmin,
        isSubstitute,
        originalUserId,
      } satisfies CreateUserRequest,
    );

    return normalizeUser(data.user as AdminUserRaw);
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

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await apiClient.get<UserListResponse>('/api/admin/users');

    return (data.users as AdminUserRaw[]).map(normalizeUser);
  } catch (error) {
    throw new Error(parseApiError(error).message);
  }
};
