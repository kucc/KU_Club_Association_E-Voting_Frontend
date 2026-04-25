import { server } from '@/mocks/server';
import { createUser, deleteUser, editUser } from '@/services/admin';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/admin', () => {
  test('createUser: 생성된 유저를 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/admin/create-user`, async ({ request }) => {
        const body = (await request.json()) as {
          username: string;
          password: string;
          isAdmin: boolean;
          isSubstitute: boolean;
        };

        return HttpResponse.json(
          {
            status: 'ok',
            user: {
              id: 1,
              username: body.username,
              isAdmin: body.isAdmin,
              isSubstitute: body.isSubstitute,
              created_at: '2026-04-19T13:17:08.862Z',
            },
          },
          { status: 201 },
        );
      }),
    );

    const user = await createUser('신규동아리', 'password123', false, false);

    expect(user.username).toBe('신규동아리');
    expect(user.isAdmin).toBe(false);
  });

  test('editUser: 수정된 유저를 반환한다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json({
          status: 'ok',
          user: {
            id: 1,
            username: 'KUCC_NEW',
          },
        });
      }),
    );

    const user = await editUser('KUCC', { changeName: 'KUCC_NEW' });

    expect(user.username).toBe('KUCC_NEW');
  });

  test('deleteUser: 삭제된 유저를 반환한다', async () => {
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

  test('editUser: 중복 이름이면 409 메시지를 던진다', async () => {
    server.use(
      http.put(`${BASE_URL}/api/admin/edit-user`, () => {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Username already exists',
          },
          { status: 409 },
        );
      }),
    );

    await expect(editUser('KUCC', { changeName: 'YCC' })).rejects.toThrow(
      'Username already exists',
    );
  });
});
