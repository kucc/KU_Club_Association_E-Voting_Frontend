import { server } from '@/mocks/server';
import { createUser, deleteUser, editUser, getUsers } from '@/services/admin';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/admin', () => {
  // POST /api/admin/create-user
  test('createUser: 본계정 생성 시 유저를 반환한다 (originalUserId: null)', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, async ({ request }) => {
        const body = (await request.json()) as {
          username: string;
          password: string;
          isAdmin: boolean;
          isSubstitute: boolean;
          originalUserId: number | null;
        };

        return HttpResponse.json(
          {
            status: 'ok',
            user: {
              id: 1,
              username: body.username,
              is_admin: body.isAdmin,
              is_substitute: body.isSubstitute,
              original_user_id: body.originalUserId,
              created_at: '2026-04-19T13:17:08.862Z',
            },
          },
          { status: 201 },
        );
      }),
    );
    const user = await createUser(
      '신규동아리',
      'password123',
      false,
      false,
      null,
    );
    expect(user.username).toBe('신규동아리');
    expect(user.isAdmin).toBe(false);
    expect(user.original_user_id).toBeNull();
  });

  test('createUser: 대리인 생성 시 originalUserId를 전달한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, async ({ request }) => {
        const body = (await request.json()) as {
          username: string;
          password: string;
          isAdmin: boolean;
          isSubstitute: boolean;
          originalUserId: number | null;
        };

        return HttpResponse.json(
          {
            status: 'ok',
            user: {
              id: 2,
              username: body.username,
              is_admin: false,
              is_substitute: true,
              original_user_id: body.originalUserId,
              created_at: '2026-04-19T13:17:08.862Z',
            },
          },
          { status: 201 },
        );
      }),
    );
    const user = await createUser('kucc01', 'password123', false, true, 1);
    expect(user.isSubstitute).toBe(true);
    expect(user.original_user_id).toBe(1);
  });

  test('createUser: 비밀번호 8자 미만이면 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, () => {
        return HttpResponse.json(
          {
            status: 'error',
            message: '비밀번호는 최소 8자 이상이어야 합니다.',
          },
          { status: 400 },
        );
      }),
    );
    await expect(
      createUser('신규동아리', '1234', false, false, null),
    ).rejects.toThrow('비밀번호는 최소 8자 이상이어야 합니다.');
  });

  test('createUser: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(
      createUser('신규동아리', 'password123', false, false, null),
    ).rejects.toThrow('로그인이 필요합니다.');
  });

  test('createUser: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(
      createUser('신규동아리', 'password123', false, false, null),
    ).rejects.toThrow('Not an admin');
  });

  test('createUser: username 중복이면 409 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Username already exists' },
          { status: 409 },
        );
      }),
    );
    await expect(
      createUser('KUCC', 'password123', false, false, null),
    ).rejects.toThrow('Username already exists');
  });

  test('createUser: 해당 본계정에 대리인이 이미 존재하면 409 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, () => {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Substitute already exists for this user',
          },
          { status: 409 },
        );
      }),
    );
    await expect(
      createUser('kucc01', 'password123', false, true, 1),
    ).rejects.toThrow('Substitute already exists for this user');
  });

  // DELETE /api/admin/delete-user
  test('deleteUser: 정상 삭제 시 삭제된 유저를 반환한다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/admin/delete-user`, () => {
        return HttpResponse.json({
          status: 'ok',
          user: {
            id: 1,
            username: 'KUCC',
            password_hash: '$2b$10$examplehashedpassword',
          },
        });
      }),
    );

    const deleted = await deleteUser('KUCC');

    expect(deleted.username).toBe('KUCC');
    expect(deleted.password_hash).toContain('$2b$10');
  });

  test('deleteUser: 존재하지 않는 유저면 404 에러를 던진다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/admin/delete-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'User not found' },
          { status: 404 },
        );
      }),
    );
    await expect(deleteUser('없는동아리')).rejects.toThrow('User not found');
  });

  test('deleteUser: 서버 오류 시 500 에러를 던진다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/admin/delete-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Internal server error' },
          { status: 500 },
        );
      }),
    );
    await expect(deleteUser('KUCC')).rejects.toThrow('Internal server error');
  });

  // PUT /api/admin/edit-user
  test('editUser: username 수정 성공 시 수정된 유저를 반환한다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json({
          status: 'ok',
          user: { id: 1, username: 'KUCC_NEW' },
        });
      }),
    );
    const user = await editUser('KUCC', { changeName: 'KUCC_NEW' });
    expect(user.username).toBe('KUCC_NEW');
  });

  test('editUser: password만 수정 성공 시 유저를 반환한다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json({
          status: 'ok',
          user: { id: 1, username: 'KUCC' },
        });
      }),
    );
    const user = await editUser('KUCC', { changePw: 'newpassword123' });
    expect(user.username).toBe('KUCC');
  });

  test('editUser: changeName, changePw 모두 없으면 400 에러를 던진다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'No fields to update' },
          { status: 400 },
        );
      }),
    );
    await expect(editUser('KUCC', {})).rejects.toThrow('No fields to update');
  });

  test('editUser: 존재하지 않는 유저면 404 에러를 던진다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'User not found' },
          { status: 404 },
        );
      }),
    );
    await expect(editUser('없는동아리', { changeName: 'ABC' })).rejects.toThrow(
      'User not found',
    );
  });

  test('editUser: username 중복이면 409 에러를 던진다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Username already exists' },
          { status: 409 },
        );
      }),
    );

    await expect(editUser('KUCC', { changeName: 'YCC' })).rejects.toThrow(
      'Username already exists',
    );
  });

  test('editUser: 서버 오류 시 500 에러를 던진다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Internal server error' },
          { status: 500 },
        );
      }),
    );
    await expect(editUser('KUCC', { changeName: 'KUCC_NEW' })).rejects.toThrow(
      'Internal server error',
    );
  });

  //  GET /api/admin/users
  test('getUsers: 전체 유저 목록을 반환한다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/admin/users`, () => {
        return HttpResponse.json({
          status: 'ok',
          users: [
            {
              id: 1,
              username: 'KUCC',
              isAdmin: true,
              isSubstitute: false,
              original_user_id: null,
              created_at: '2026-04-19T13:17:08.862Z',
            },
          ],
        });
      }),
    );
    const users = await getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('KUCC');
  });

  test('getUsers: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/admin/users`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Unauthorized' },
          { status: 401 },
        );
      }),
    );
    await expect(getUsers()).rejects.toThrow('Unauthorized');
  });

  test('getUsers: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/admin/users`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Forbidden' },
          { status: 403 },
        );
      }),
    );
    await expect(getUsers()).rejects.toThrow('Forbidden');
  });
});
