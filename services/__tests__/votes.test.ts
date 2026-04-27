import { server } from '@/mocks/server';
import {
  castVote,
  editVote,
  getMyVote,
  getVoteResults,
} from '@/services/votes';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/votes', () => {
  // POST /api/votes/vote
  test('castVote: 정상 투표 시 resolve 된다', async () => {
    await expect(castVote(1, '찬성')).resolves.toBeUndefined();
  });

  test('castVote: 필드 누락 또는 유효하지 않은 옵션이면 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: '유효하지 않은 옵션입니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(castVote(1, '무효옵션')).rejects.toThrow(
      '유효하지 않은 옵션입니다.',
    );
  });

  test('castVote: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(castVote(1, '찬성')).rejects.toThrow('로그인이 필요합니다.');
  });

  test('castVote: 중복 투표 시 409 에러를 던진다', async () => {
    await expect(castVote(1, '중복')).rejects.toThrow('이미 투표함');
  });

  test('castVote: 본계정/대리인 상대방이 이미 투표한 경우 409 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/vote`, () => {
        return HttpResponse.json(
          {
            status: 'error',
            message: '본계정 또는 대리인 계정이 이미 투표했습니다.',
          },
          { status: 409 },
        );
      }),
    );
    await expect(castVote(1, '찬성')).rejects.toThrow(
      '본계정 또는 대리인 계정이 이미 투표했습니다.',
    );
  });

  // PATCH /api/votes/edit-vote
  test('editVote: 수정 성공 시 resolve 된다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/votes/edit-vote`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
    );
    await expect(editVote(1, '반대')).resolves.toBeUndefined();
  });

  test('editVote: 유효하지 않은 옵션이면 400 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/votes/edit-vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: '유효하지 않은 옵션입니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(editVote(1, '무효옵션')).rejects.toThrow(
      '유효하지 않은 옵션입니다.',
    );
  });

  test('editVote: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/votes/edit-vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(editVote(1, '반대')).rejects.toThrow('로그인이 필요합니다.');
  });

  test('editVote: poll 또는 vote가 없으면 404 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/votes/edit-vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll or vote not found' },
          { status: 404 },
        );
      }),
    );
    await expect(editVote(999, '반대')).rejects.toThrow(
      'Poll or vote not found',
    );
  });

  // POST /api/votes/results
  test('getVoteResults: 결과 배열을 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/results`, () => {
        return HttpResponse.json({
          status: 'ok',
          poll_id: 1,
          results: [
            { selected: '찬성', count: 10 },
            { selected: '반대', count: 2 },
          ],
        });
      }),
    );

    const result = await getVoteResults(1);

    expect(result.poll_id).toBe(1);
    expect(result.results).toEqual([
      { selected: '찬성', count: 10 },
      { selected: '반대', count: 2 },
    ]);
  });

  test('getVoteResults: poll_id 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/results`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'poll_id가 누락되었습니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(getVoteResults(0)).rejects.toThrow(
      'poll_id가 누락되었습니다.',
    );
  });

  test('getVoteResults: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/results`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getVoteResults(1)).rejects.toThrow('로그인이 필요합니다.');
  });

  test('getVoteResults: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/results`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll not found' },
          { status: 404 },
        );
      }),
    );
    await expect(getVoteResults(999)).rejects.toThrow('Poll not found');
  });

  // POST /api/votes/my-vote
  test('getMyVote: 투표한 경우 vote 객체를 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/my-vote`, () => {
        return HttpResponse.json({
          status: 'ok',
          vote: {
            id: 1,
            poll_id: 1,
            user_id: 1,
            selected: '찬성',
            cast_at: '2026-04-27T06:21:55.452Z',
          },
        });
      }),
    );
    const vote = await getMyVote(1);
    expect(vote).not.toBeNull();
    expect(vote?.selected).toBe('찬성');
    expect(vote?.poll_id).toBe(1);
  });

  test('getMyVote: 미투표면 null을 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/my-vote`, () => {
        return HttpResponse.json({ status: 'ok', vote: null });
      }),
    );
    const vote = await getMyVote(1);
    expect(vote).toBeNull();
  });

  test('getMyVote: poll_id 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/my-vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'poll_id가 누락되었습니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(getMyVote(0)).rejects.toThrow('poll_id가 누락되었습니다.');
  });

  test('getMyVote: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/my-vote`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getMyVote(1)).rejects.toThrow('로그인이 필요합니다.');
  });
});
