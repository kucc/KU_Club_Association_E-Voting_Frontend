import { server } from '@/mocks/server';
import { getCurrentUser, signIn, signOut } from '@/services/auth';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/auth', () => {
  test('signIn: 로그인 성공 시 user를 반환한다', async () => {
    const user = await signIn('KUCC', '1234');

    expect(user).toEqual({
      id: 1,
      username: 'KUCC',
      isAdmin: true,
      isSubstitute: false,
    });
  });

  test('signIn: 로그인 실패 시 에러 메시지를 throw 한다', async () => {
    await expect(signIn('KUCC', 'wrong-password')).rejects.toThrow('인증 실패');
  });

  test('getCurrentUser: 현재 사용자 정보를 반환한다', async () => {
    const user = await getCurrentUser();

    expect(user.username).toBe('KUCC');
    expect(user.isAdmin).toBe(true);
    expect(user.isSubstitute).toBe(false);
  });

  test('signOut: 로그아웃 성공 시 에러 없이 종료된다', async () => {
    await expect(signOut()).resolves.toBeUndefined();
  });

  test('timeout 발생 시 parseApiError 메시지로 변환된다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/auth/me`, () => {
        return HttpResponse.error();
      }),
    );
  });
});
