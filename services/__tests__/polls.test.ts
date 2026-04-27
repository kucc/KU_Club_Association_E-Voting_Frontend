import { server } from '@/mocks/server';
import {
  createPoll,
  deletePoll,
  editPoll,
  endPoll,
  getPollResults,
  getPolls,
  getPollsByMonth,
  getPollsBySemester,
  getSelectableSemesters,
  startPoll,
} from '@/services/polls';
import { describe, expect, test } from '@jest/globals';
import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

describe('services/polls', () => {
  // GET /api/polls
  test('getPolls: 투표 목록을 반환한다', async () => {
    const polls = await getPolls();
    expect(polls).toHaveLength(1);
    expect(polls[0].question).toBe('회장 선출에 찬성하십니까?');
    expect(polls[0].status).toBe('pending');
  });

  test('getPolls: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getPolls()).rejects.toThrow('로그인이 필요합니다.');
  });

  // POST /api/polls/poll-results

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

  test('getPollResults: poll id 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/poll-results`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'poll id가 누락되었습니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(getPollResults(0)).rejects.toThrow(
      'poll id가 누락되었습니다.',
    );
  });

  test('getPollResults: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/poll-results`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll not found' },
          { status: 404 },
        );
      }),
    );
    await expect(getPollResults(999)).rejects.toThrow('Poll not found');
  });

  // POST /api/polls/create-poll
  test('createPoll: 생성된 poll을 반환한다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/create-poll`, async ({ request }) => {
        const body = (await request.json()) as {
          question: string;
          options: string[];
          sort_order: number;
          ended_at: string;
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
              ended_at: body.ended_at,
            },
          },
          { status: 201 },
        );
      }),
    );

    const poll = await createPoll(
      '신규 안건',
      ['찬성', '반대'],
      1,
      '2026-12-31T23:59:59Z',
    );

    expect(poll.question).toBe('신규 안건');
    expect(poll.options).toEqual(['찬성', '반대']);
    expect(poll.status).toBe('pending');
  });

  test('createPoll: 필드 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/create-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: '필수 필드가 누락되었습니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(createPoll('', [], 0, '')).rejects.toThrow(
      '필수 필드가 누락되었습니다.',
    );
  });

  test('createPoll: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.post(`${BASE_URL}/api/polls/create-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(
      createPoll('신규 안건', ['찬성', '반대'], 1, '2026-12-31T23:59:59Z'),
    ).rejects.toThrow('Not an admin');
  });

  // PATCH /api/polls/edit-poll
  test('editPoll: question 수정 성공 시 poll을 반환한다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/edit-poll`, () => {
        return HttpResponse.json({
          status: 'ok',
          poll: {},
        });
      }),
    );
    const result = await editPoll(1, { question: '수정된 안건' });
    expect(result).toEqual({});
  });

  test('editPoll: 변경할 필드 없으면 400 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/edit-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'No valid fields to update' },
          { status: 400 },
        );
      }),
    );
    await expect(editPoll(1, {})).rejects.toThrow('No valid fields to update');
  });

  test('editPoll: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/edit-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll not found' },
          { status: 404 },
        );
      }),
    );
    await expect(editPoll(999, { question: '수정' })).rejects.toThrow(
      'Poll not found',
    );
  });

  test('editPoll: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/edit-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(editPoll(1, { question: '수정' })).rejects.toThrow(
      'Not an admin',
    );
  });

  //  DELETE /api/polls/delete-poll

  test('deletePoll: 정상 삭제 시 resolve 된다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/polls/delete-poll`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
    );
    await expect(deletePoll(1)).resolves.toBeUndefined();
  });

  test('deletePoll: id 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/polls/delete-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'poll id가 누락되었습니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(deletePoll(0)).rejects.toThrow('poll id가 누락되었습니다.');
  });

  test('deletePoll: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/polls/delete-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(deletePoll(1)).rejects.toThrow('Not an admin');
  });

  test('deletePoll: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.delete(`${BASE_URL}/api/polls/delete-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'poll 없음' },
          { status: 404 },
        );
      }),
    );
    await expect(deletePoll(999)).rejects.toThrow('poll 없음');
  });

  // PATCH /api/polls/start-poll
  test('startPoll: 정상 호출 시 resolve 된다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/start-poll`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
    );

    await expect(startPoll(1)).resolves.toBeUndefined();
  });

  test('startPoll: 이미 시작된 투표면 400 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/start-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: '이미 시작된 투표입니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(startPoll(1)).rejects.toThrow('이미 시작된 투표입니다.');
  });

  test('startPoll: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/start-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(startPoll(1)).rejects.toThrow('Not an admin');
  });

  test('startPoll: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/start-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll not found' },
          { status: 404 },
        );
      }),
    );
    await expect(startPoll(999)).rejects.toThrow('Poll not found');
  });

  // PATCH /api/polls/end-poll
  test('endPoll: 정상 호출 시 resolve 된다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/end-poll`, () => {
        return HttpResponse.json({ status: 'ok' }, { status: 200 });
      }),
    );
    await expect(endPoll(1)).resolves.toBeUndefined();
  });

  test('endPoll: 이미 종료된 투표면 400 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/end-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: '이미 종료된 투표입니다.' },
          { status: 400 },
        );
      }),
    );
    await expect(endPoll(1)).rejects.toThrow('이미 종료된 투표입니다.');
  });

  test('endPoll: 어드민 권한 없으면 403 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/end-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Not an admin' },
          { status: 403 },
        );
      }),
    );
    await expect(endPoll(1)).rejects.toThrow('Not an admin');
  });

  test('endPoll: 존재하지 않는 poll이면 404 에러를 던진다', async () => {
    server.use(
      http.patch(`${BASE_URL}/api/polls/end-poll`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'Poll not found' },
          { status: 404 },
        );
      }),
    );
    await expect(endPoll(999)).rejects.toThrow('Poll not found');
  });

  // GET /api/polls/by-month
  test('getPollsByMonth: 해당 월의 투표 목록을 반환한다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-month`, () => {
        return HttpResponse.json({
          status: 'ok',
          polls: [{ results: [{ selected: '찬성', count: 10 }] }],
        });
      }),
    );
    const polls = await getPollsByMonth(2026, 4);
    expect(polls).toHaveLength(1);
    expect(polls[0].results[0]).toEqual({ selected: '찬성', count: 10 });
  });

  test('getPollsByMonth: year/month 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-month`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'year와 month를 입력해주세요.' },
          { status: 400 },
        );
      }),
    );
    await expect(getPollsByMonth(0, 0)).rejects.toThrow(
      'year와 month를 입력해주세요.',
    );
  });

  test('getPollsByMonth: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-month`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getPollsByMonth(2026, 4)).rejects.toThrow(
      '로그인이 필요합니다.',
    );
  });

  // GET /api/polls/selectable-semesters
  test('getSelectableSemesters: 선택 가능한 학기 목록을 반환한다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/selectable-semesters`, () => {
        return HttpResponse.json({
          status: 'ok',
          semesters: [
            { year: 2026, semester: 1 },
            { year: 2025, semester: 2 },
          ],
        });
      }),
    );
    const semesters = await getSelectableSemesters();
    expect(semesters).toHaveLength(2);
    expect(semesters[0]).toEqual({ year: 2026, semester: 1 });
  });

  test('getSelectableSemesters: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/selectable-semesters`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getSelectableSemesters()).rejects.toThrow(
      '로그인이 필요합니다.',
    );
  });

  // GET /api/polls/by-semester
  test('getPollsBySemester: 해당 학기의 투표 목록을 반환한다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-semester`, () => {
        return HttpResponse.json({
          status: 'ok',
          polls: [{ results: [{ selected: '반대', count: 5 }] }],
        });
      }),
    );
    const polls = await getPollsBySemester(2026, 1);
    expect(polls).toHaveLength(1);
    expect(polls[0].results[0]).toEqual({ selected: '반대', count: 5 });
  });

  test('getPollsBySemester: year/semester 누락 시 400 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-semester`, () => {
        return HttpResponse.json(
          { status: 'error', message: 'year와 semester를 입력해주세요.' },
          { status: 400 },
        );
      }),
    );
    await expect(getPollsBySemester(0, 0)).rejects.toThrow(
      'year와 semester를 입력해주세요.',
    );
  });

  test('getPollsBySemester: 미인증 상태면 401 에러를 던진다', async () => {
    server.use(
      http.get(`${BASE_URL}/api/polls/by-semester`, () => {
        return HttpResponse.json(
          { status: 'error', message: '로그인이 필요합니다.' },
          { status: 401 },
        );
      }),
    );
    await expect(getPollsBySemester(2026, 1)).rejects.toThrow(
      '로그인이 필요합니다.',
    );
  });
});
