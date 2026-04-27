import { server } from '@/mocks/server';
import { getCurrentUser, signIn, signOut } from '@/services/auth';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/auth', () => {
  // POST /api/auth/login
  test('signIn: 로그인 성공 시 user를 반환한다', async () => {
    const user = await signIn('KUCC', '1234');
    expect(user).toEqual({
      id: 1,
      username: 'KUCC',
      isAdmin: true,
      isSubstitute: false,
    });
  });

  test('signIn: username 또는 password 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/auth/login`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'username과 password를 입력해주세요.' },
          { status: 400 },
        );
      }),
    );
    await expect(signIn('', '')).rejects.toThrow(
      'username과 password를 입력해주세요.',
    );
  });

  test('signIn: 로그인 실패 시 401 에러 메시지를 던진다', async () => {
    await expect(signIn('KUCC', 'wrong-password')).rejects.toThrow('인증 실패');
  });

  // POST /api/auth/logout
  test('signOut: 로그아웃 성공 시 에러 없이 종료된다', async () => {
    await expect(signOut()).resolves.toBeUndefined();
  });

  test('signOut: 세션 삭제 실패 시 500 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/auth/logout`, () => {
        return HttpResponse.json(
          { status: 'error', message: '세션 삭제에 실패했습니다.' },
          { status: 500 },
        );
      }),
    );
    await expect(signOut()).rejects.toThrow('세션 삭제에 실패했습니다.');
  });

  // GET /api/auth/me
  test('getCurrentUser: 현재 사용자 정보를 반환한다', async () => {
    const user = await getCurrentUser();
    expect(user.username).toBe('KUCC');
    expect(user.isAdmin).toBe(true);
    expect(user.isSubstitute).toBe(false);
  });

  test('getCurrentUser: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/auth/me`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getCurrentUser()).rejects.toThrow('로그인이 필요합니다.');
  });

  test('getCurrentUser: 네트워크 오류 시 parseApiError 메시지로 변환된다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/auth/me`, () => {
        return HttpResponse.error();
      }),
    );
    await expect(getCurrentUser()).rejects.toThrow();
  });
});
