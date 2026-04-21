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
  test('castVote: 정상 투표 시 resolve 된다', async () => {
    await expect(castVote(1, '찬성')).resolves.toBeUndefined();
  });

  test('castVote: 중복 투표 시 409 메시지를 전달한다', async () => {
    await expect(castVote(1, '중복')).rejects.toThrow('이미 투표함');
  });

  test('editVote: 수정 성공 시 resolve 된다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/votes/edit-vote`, () => {
        return HttpResponse.json(
          {
            status: 'ok',
          },
          { status: 200 },
        );
      }),
    );

    await expect(editVote(1, '반대')).resolves.toBeUndefined();
  });

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

  test('getMyVote: 미투표면 null 반환', async () => {
    server.use(
      http.post(`${BASE_URL}/api/votes/my-vote`, () => {
        return HttpResponse.json({
          status: 'ok',
          vote: null,
        });
      }),
    );

    const vote = await getMyVote(1);

    expect(vote).toBeNull();
  });
});
