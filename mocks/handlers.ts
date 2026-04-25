import { HttpResponse, http } from 'msw';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const handlers = [
  http.post(`${BASE_URL}/api/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'username 또는 password 누락',
        },
        { status: 400 },
      );
    }

    if (body.username !== 'KUCC' || body.password !== '1234') {
      return HttpResponse.json(
        {
          status: 'error',
          message: '인증 실패',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      user: {
        id: 1,
        username: 'KUCC',
        isAdmin: true,
        isSubstitute: false,
      },
    });
  }),

  http.get(`${BASE_URL}/api/auth/me`, () => {
    return HttpResponse.json({
      status: 'ok',
      user: {
        id: 1,
        username: 'KUCC',
        isAdmin: true,
        isSubstitute: false,
      },
    });
  }),

  http.post(`${BASE_URL}/api/auth/logout`, () => {
    return HttpResponse.json({
      status: 'ok',
    });
  }),

  http.get(`${BASE_URL}/api/polls`, () => {
    return HttpResponse.json({
      status: 'ok',
      polls: [
        {
          id: 1,
          created_by: 1,
          question: '회장 선출에 찬성하십니까?',
          options: ['찬성', '반대', '기권'],
          status: 'pending',
          started_at: null,
          ended_at: null,
          sort_order: 0,
        },
      ],
    });
  }),

  http.post(`${BASE_URL}/api/polls/poll-results`, async ({ request }) => {
    const body = (await request.json()) as { id?: number };

    if (!body.id) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'poll id 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      poll: {
        id: body.id,
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

  http.patch(`${BASE_URL}/api/polls/start-poll`, async ({ request }) => {
    const body = (await request.json()) as { id?: number };

    if (!body.id) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'id 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: 'ok',
      },
      { status: 200 },
    );
  }),

  http.patch(`${BASE_URL}/api/polls/end-poll`, async ({ request }) => {
    const body = (await request.json()) as { id?: number };

    if (!body.id) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'id 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: 'ok',
      },
      { status: 200 },
    );
  }),

  http.delete(`${BASE_URL}/api/polls/delete-poll`, async ({ request }) => {
    const body = (await request.json()) as { id?: number };

    if (body.id === 999) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'poll 없음',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(
      {
        status: 'ok',
      },
      { status: 200 },
    );
  }),

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
          is_admin: body.isAdmin,
          is_substitute: body.isSubstitute,
          created_at: '2026-04-19T13:17:08.862Z',
        },
      },
      { status: 201 },
    );
  }),

  http.put(`${BASE_URL}/api/admin/edit-user`, async ({ request }) => {
    const body = (await request.json()) as {
      userName: string;
      changeName: string | null;
      changePw: string | null;
    };

    if (body.changeName === 'YCC') {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Username already exists',
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      user: {
        id: 1,
        username: body.changeName ?? body.userName,
      },
    });
  }),

  http.delete(`${BASE_URL}/api/admin/delete-user`, async ({ request }) => {
    const body = (await request.json()) as { userName?: string };

    return HttpResponse.json({
      status: 'ok',
      user: {
        id: 1,
        username: body.userName ?? 'KUCC',
        password_hash: '$2b$10$examplehashedpassword',
      },
    });
  }),

  http.post(`${BASE_URL}/api/votes/vote`, async ({ request }) => {
    const body = (await request.json()) as {
      poll_id?: number;
      selected?: string;
    };

    if (!body.poll_id || !body.selected) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '필드 누락',
        },
        { status: 400 },
      );
    }

    if (body.selected === '중복') {
      return HttpResponse.json(
        {
          status: 'error',
          message: '이미 투표함',
        },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      {
        status: 'ok',
      },
      { status: 201 },
    );
  }),

  http.patch(`${BASE_URL}/api/votes/edit-vote`, async ({ request }) => {
    const body = (await request.json()) as {
      poll_id?: number;
      selected?: string;
    };

    if (!body.poll_id || !body.selected) {
      return HttpResponse.json(
        {
          status: 'error',
          message: '필드 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: 'ok',
      },
      { status: 200 },
    );
  }),

  http.post(`${BASE_URL}/api/votes/results`, async ({ request }) => {
    const body = (await request.json()) as { poll_id?: number };

    if (!body.poll_id) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'poll_id 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      poll_id: body.poll_id,
      results: [
        { selected: '찬성', count: 10 },
        { selected: '반대', count: 2 },
      ],
    });
  }),

  http.post(`${BASE_URL}/api/votes/my-vote`, async ({ request }) => {
    const body = (await request.json()) as { poll_id?: number };

    if (body.poll_id === 1) {
      return HttpResponse.json({
        status: 'ok',
        vote: null,
      });
    }

    return HttpResponse.json({
      status: 'ok',
      vote: {
        id: 1,
        poll_id: body.poll_id ?? 0,
        user_id: 1,
        selected: '찬성',
        cast_at: '2026-04-19T13:17:08.939Z',
      },
    });
  }),

  http.get(`${BASE_URL}/api/polls/by-month`, ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');

    if (!year || !month) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'year 또는 month 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      polls: [
        {
          results: [
            { selected: '찬성', count: 15 },
            { selected: '반대', count: 8 },
          ],
        },
      ],
    });
  }),

  http.get(`${BASE_URL}/api/polls/selectable-semesters`, () => {
    return HttpResponse.json({
      status: 'ok',
      semesters: [
        { year: 2026, semester: 1 },
        { year: 2025, semester: 2 },
      ],
    });
  }),

  http.get(`${BASE_URL}/api/polls/by-semester`, ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const semester = url.searchParams.get('semester');

    if (!year || !semester) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'year 또는 semester 누락',
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 'ok',
      polls: [
        {
          results: [
            { selected: '찬성', count: 15 },
            { selected: '반대', count: 8 },
          ],
        },
      ],
    });
  }),
];
