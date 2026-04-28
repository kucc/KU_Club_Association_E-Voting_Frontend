import {
  useCurrentUserQuery,
  useSignInMutation,
  useSignOutMutation,
} from '@/hooks/queries/useAuthQuery';
import * as authService from '@/services/auth';
import { createQueryWrapper } from '@/test/queryTestUtils';
import { describe, expect, jest, test } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@/services/auth');

const mockedAuthService = jest.mocked(authService);

describe('hooks/queries/useAuthQuery', () => {
  //  useCurrentUserQuery
  test('useCurrentUserQuery: 성공 시 user 데이터를 반환한다', async () => {
    mockedAuthService.getCurrentUser.mockResolvedValue({
      id: 1,
      username: 'KUCC',
      isAdmin: true,
      isSubstitute: false,
      original_user_id: null,
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCurrentUserQuery(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: 1,
      username: 'KUCC',
      isAdmin: true,
      isSubstitute: false,
      original_user_id: null,
    });
  });

  test('useCurrentUserQuery: 실패 시 error 상태가 된다', async () => {
    mockedAuthService.getCurrentUser.mockRejectedValue(
      new Error('로그인 필요'),
    );

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCurrentUserQuery(), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('로그인 필요');
  });

  //  useSignInMutation
  test('useSignInMutation: mutateAsync 성공 시 success 상태가 된다', async () => {
    mockedAuthService.signIn.mockResolvedValue({
      id: 1,
      username: 'KUCC',
      isAdmin: true,
      isSubstitute: false,
      original_user_id: null,
    });

    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSignInMutation(), {
      wrapper: Wrapper,
    });
    await result.current.mutateAsync({ username: 'KUCC', password: '1234' });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedAuthService.signIn).toHaveBeenCalledWith('KUCC', '1234');
  });

  test('useSignInMutation: 실패 시 error 상태가 된다', async () => {
    mockedAuthService.signIn.mockRejectedValue(new Error('인증 실패'));
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSignInMutation(), {
      wrapper: Wrapper,
    });
    await expect(
      result.current.mutateAsync({ username: 'KUCC', password: 'wrong' }),
    ).rejects.toThrow('인증 실패');
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  //  useSignOutMutation
  test('useSignOutMutation: 성공 시 success 상태가 된다', async () => {
    mockedAuthService.signOut.mockResolvedValue(undefined);
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSignOutMutation(), {
      wrapper: Wrapper,
    });
    await result.current.mutateAsync();
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(mockedAuthService.signOut).toHaveBeenCalled();
  });

  test('useSignOutMutation: 실패 시 error 상태가 된다', async () => {
    mockedAuthService.signOut.mockRejectedValue(
      new Error('세션 삭제에 실패했습니다.'),
    );
    const { Wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useSignOutMutation(), {
      wrapper: Wrapper,
    });
    await expect(result.current.mutateAsync()).rejects.toThrow(
      '세션 삭제에 실패했습니다.',
    );
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
