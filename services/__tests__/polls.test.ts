import { server } from '@/mocks/server';
import {
  createPoll,
  deletePoll,
  endPoll,
  getPollResults,
  getPolls,
  startPoll,
} from '@/services/polls';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/polls', () => {
  test('getPolls: 투표 목록을 반환한다', async () => {
    const polls = await getPolls();

    expect(polls).toHaveLength(1);
    expect(polls[0].question).toBe('회장 선출에 찬성하십니까?');
    expect(polls[0].status).toBe('pending');
  });

  test('getPollResults: poll과 results를 함께 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/poll-results`, () => {
        return HttpResponse.json({
          status: 'ok',
          poll: {
            id: 1,
            created_by: 1,
            question: '회장 선출에 찬성하십니까?',
            options: ['찬성', '반대', '기권'],
            status: 'completed',
            started_at: '2026-04-19T13:17:08.897Z',
            ended_at: '2026-04-19T13:17:08.897Z',
            sort_order: 0,
          },
          results: [
            { selected: '찬성', count: 15 },
            { selected: '반대', count: 8 },
            { selected: '기권', count: 3 },
          ],
        });
      }),
    );

    const result = await getPollResults(1);

    expect(result.poll.id).toBe(1);
    expect(result.results[0]).toEqual({ selected: '찬성', count: 15 });
  });

  test('createPoll: 생성된 poll을 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/create-poll`, async ({ request }) => {
        const body = (await request.json()) as {
          question: string;
          options: string[];
          sort_order: number;
        };

        return HttpResponse.json(
          {
            status: 'ok',
            poll: {
              id: 10,
              created_by: 1,
              question: body.question,
              options: body.options,
              status: 'pending',
              sort_order: body.sort_order,
            },
          },
          { status: 201 },
        );
      }),
    );

    const poll = await createPoll('신규 안건', ['찬성', '반대'], 1);

    expect(poll.question).toBe('신규 안건');
    expect(poll.options).toEqual(['찬성', '반대']);
    expect(poll.status).toBe('pending');
  });

  test('startPoll / endPoll: 정상 호출 시 resolve 된다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/start-poll`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
      http.patch(`${BASE_URL}/api/polls/end-poll`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
    );

    await expect(startPoll(1)).resolves.toBeUndefined();
    await expect(endPoll(1)).resolves.toBeUndefined();
  });

  test('deletePoll: 404 에러를 메시지로 전달한다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/polls/delete-poll`, () => {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'poll 없음',
          },
          { status: 404 },
        );
      }),
    );

    await expect(deletePoll(999)).rejects.toThrow('poll 없음');
  });
});
