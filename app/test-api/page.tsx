'use client';

import { Sans } from '@/app/ui/sans';
import { createUser, deleteUser, editUser, getUsers } from '@/services/admin';
import { getCurrentUser, signIn, signOut } from '@/services/auth';
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
import {
  castVote,
  editVote,
  getMyVote,
  getVoteResults,
} from '@/services/votes';

import { useState } from 'react';

type JsonValue = unknown;

type SmokeResult = {
  label: string;
  status: 'pass' | 'fail';
  detail: string;
};

export default function Page() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [pollId, setPollId] = useState('');
  const [selected, setSelected] = useState('');
  const [question, setQuestion] = useState('');
  const [optionsText, setOptionsText] = useState('');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminIsAdmin, setAdminIsAdmin] = useState(false);
  const [adminIsSubstitute, setAdminIsSubstitute] = useState(false);
  const [adminOriginalUserId, setAdminOriginalUserId] = useState('');
  const [targetUserName, setTargetUserName] = useState('');
  const [changeName, setChangeName] = useState('');
  const [changePw, setChangePw] = useState('');

  const [endedAt, setEndedAt] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [semester, setSemester] = useState('');

  const [resultTitle, setResultTitle] = useState('결과');
  const [resultData, setResultData] = useState<JsonValue | undefined>(
    undefined,
  );
  const [resultError, setResultError] = useState<string>('');
  const [isPending, setIsPending] = useState(false);

  const [smokeResults, setSmokeResults] = useState<SmokeResult[]>([]);
  const [isSmokePending, setIsSmokePending] = useState(false);

  const parsedPollId = Number(pollId);
  const parsedOptions = optionsText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  // 빈 문자열 → null(본계정), 숫자 문자열 → number(대리인)
  const parsedOriginalUserId =
    adminOriginalUserId.trim() === ''
      ? null
      : Number(adminOriginalUserId.trim());

  const run = async (title: string, action: () => Promise<unknown>) => {
    setIsPending(true);
    setResultTitle(title);
    setResultError('');
    setResultData(null);

    try {
      const data = await action();
      setResultData(data ?? { status: 'ok' });
    } catch (error) {
      setResultError(
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setIsPending(false);
    }
  };

  //  Smoke Tests
  // 1차 완료 조건 검증:
  //   (a) createUser — originalUserId: null 포함 본계정 생성
  //   (b) getUsers   — 배열 반환 확인 + 본계정 id 보완
  //   (c) substitute — 대리인 생성 흐름 확인
  //
  // ⚠️ 실제 백엔드 연결 상태에서만 의미 있음.
  //    smoke용 계정은 테스트 후 Admin 섹션 "유저 삭제"로 직접 정리해주세요.
  const runSmokeTests = async () => {
    if (adminUsername.trim() === '' || adminPassword.trim() === '') {
      alert(
        'Admin 섹션의 "생성할 username"과 "생성할 password"를 입력한 뒤 실행해주세요.',
      );
      return;
    }

    setIsSmokePending(true);
    setSmokeResults([]);

    const results: SmokeResult[] = [];

    const check = async (label: string, fn: () => Promise<void>) => {
      try {
        await fn();
        results.push({ label, status: 'pass', detail: 'ok' });
      } catch (e) {
        results.push({
          label,
          status: 'fail',
          detail: e instanceof Error ? e.message : String(e),
        });
      }
    };

    const smokeUsername = `${adminUsername}_smoke_${Date.now()}`;
    let createdUserId: number | null = null;

    // (a) createUser — originalUserId: null 본계정 생성
    await check('(a) createUser (originalUserId: null)', async () => {
      const user = await createUser(
        smokeUsername,
        adminPassword,
        false,
        false,
        null,
      );
      if (!user.username) throw new Error('응답에 username 없음');
      if (user.isSubstitute) throw new Error('본계정인데 isSubstitute가 true');
      if (user.original_user_id !== null)
        throw new Error('본계정인데 original_user_id가 null이 아님');
      createdUserId = user.id ?? null;
    });

    // (b) getUsers — 배열 반환 + 본계정 id 보완
    await check('(b) getUsers', async () => {
      const users = await getUsers();
      if (!Array.isArray(users)) throw new Error('응답이 배열이 아님');
      if (users.length === 0) throw new Error('유저 목록이 비어 있음');
      if (createdUserId === null) {
        const found = users.find((u) => u.username === smokeUsername);
        createdUserId = found?.id ?? null;
      }
    });

    // (c) substitute createUser — 대리인 생성 흐름
    const substituteUsername = `${smokeUsername}_sub`;

    await check(
      '(c) substitute createUser (originalUserId: 본계정 id)',
      async () => {
        if (createdUserId === null) {
          throw new Error(
            '본계정 id를 알 수 없음 — (a) 또는 (b) 단계가 실패했을 수 있음',
          );
        }
        const sub = await createUser(
          substituteUsername,
          adminPassword,
          false,
          true,
          createdUserId,
        );
        if (!sub.username) throw new Error('대리인 응답에 username 없음');
        // normalizeUser 이후이므로 camelCase로 참조
        if (!sub.isSubstitute)
          throw new Error('대리인 응답에 isSubstitute가 true가 아님');
        if (sub.original_user_id !== createdUserId)
          throw new Error(
            `original_user_id 불일치: 기대 ${createdUserId}, 실제 ${sub.original_user_id}`,
          );
      },
    );

    setSmokeResults(results);
    setIsSmokePending(false);
  };

  return (
    <div className="min-h-screen p-5">
      <Sans.T240 as="h1">API 연동 테스트 페이지</Sans.T240>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-6">
          {/*  1. Auth  */}
          <section className="rounded-xl border p-4">
            <Sans.T200 as="h2">1. Auth</Sans.T200>

            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() =>
                  run('POST /api/auth/login', () => signIn(username, password))
                }
              >
                로그인
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() => run('GET /api/auth/me', () => getCurrentUser())}
              >
                현재 사용자 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() =>
                  run('POST /api/auth/logout', async () => {
                    await signOut();
                    return { status: 'ok' };
                  })
                }
              >
                로그아웃
              </button>
            </div>
          </section>

          {/*  2. Polls  */}
          <section className="rounded-xl border p-4">
            <Sans.T200 as="h2">2. Polls</Sans.T200>

            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="poll id"
                autoComplete="off"
                value={pollId}
                onChange={(e) => setPollId(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="selected option"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="new poll question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <textarea
                className="min-h-[120px] rounded-lg border px-3 py-2"
                placeholder={'options (한 줄에 하나씩)\n찬성\n반대\n기권'}
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="ended_at (ISO 8601, e.g. 2026-12-31T23:59:59Z)"
                value={endedAt}
                onChange={(e) => setEndedAt(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="year (for monthly/semesterly queries)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="month (1-12, for monthly queries)"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="semester (1 or 2, for semester queries)"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() => run('GET /api/polls', () => getPolls())}
              >
                투표 목록 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('POST /api/polls/poll-results', () =>
                    getPollResults(parsedPollId),
                  )
                }
              >
                특정 poll 결과 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  question.trim() === '' ||
                  parsedOptions.length === 0
                }
                onClick={() =>
                  run('POST /api/polls/create-poll', () =>
                    createPoll(
                      question,
                      '',
                      parsedOptions,
                      1,
                      endedAt || '2026-12-31T23:59:59Z',
                    ),
                  )
                }
              >
                poll 생성
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('PATCH /api/polls/edit-poll', () =>
                    editPoll(parsedPollId, {
                      question: question || undefined,
                      options:
                        parsedOptions.length > 0 ? parsedOptions : undefined,
                    }),
                  )
                }
              >
                poll 수정
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('PATCH /api/polls/start-poll', async () => {
                    await startPoll(parsedPollId);
                    return { status: 'ok' };
                  })
                }
              >
                poll 시작
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('PATCH /api/polls/end-poll', async () => {
                    await endPoll(parsedPollId);
                    return { status: 'ok' };
                  })
                }
              >
                poll 종료
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('DELETE /api/polls/delete-poll', async () => {
                    await deletePoll(parsedPollId);
                    return { status: 'ok' };
                  })
                }
              >
                poll 삭제
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  !Number.isFinite(Number(year)) ||
                  !Number.isFinite(Number(month))
                }
                onClick={() =>
                  run('GET /api/polls/by-month', () =>
                    getPollsByMonth(Number(year), Number(month)),
                  )
                }
              >
                월별 투표 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() =>
                  run('GET /api/polls/selectable-semesters', () =>
                    getSelectableSemesters(),
                  )
                }
              >
                선택 가능 학기 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  !Number.isFinite(Number(year)) ||
                  !Number.isFinite(Number(semester))
                }
                onClick={() =>
                  run('GET /api/polls/by-semester', () =>
                    getPollsBySemester(Number(year), Number(semester)),
                  )
                }
              >
                학기별 투표 조회
              </button>
            </div>
          </section>

          {/*  3. Votes  */}
          <section className="rounded-xl border p-4">
            <Sans.T200 as="h2">3. Votes</Sans.T200>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('POST /api/votes/my-vote', () => getMyVote(parsedPollId))
                }
              >
                내 투표 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || !Number.isFinite(parsedPollId)}
                onClick={() =>
                  run('POST /api/votes/results', () =>
                    getVoteResults(parsedPollId),
                  )
                }
              >
                투표 결과 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  !Number.isFinite(parsedPollId) ||
                  selected.trim() === ''
                }
                onClick={() =>
                  run('POST /api/votes/vote', async () => {
                    await castVote(parsedPollId, selected);
                    return { status: 'ok' };
                  })
                }
              >
                투표하기
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  !Number.isFinite(parsedPollId) ||
                  selected.trim() === ''
                }
                onClick={() =>
                  run('PATCH /api/votes/edit-vote', async () => {
                    await editVote(parsedPollId, selected);
                    return { status: 'ok' };
                  })
                }
              >
                투표 수정
              </button>
              <p className="mt-2 text-sm text-gray-500">
                * 투표하기 / 수정은 API 명세상 PATCH이지만, 프론트엔드 편의상
                POST로 구현되어 있습니다. * vote 버튼은 현재 로그인한 계정의
                vote만 조회합니다. 대표자-대리인 통합 이력 조회가 아닙니다.
              </p>
            </div>
          </section>

          {/*  4. Admin  */}
          <section className="rounded-xl border p-4">
            <Sans.T200 as="h2">4. Admin</Sans.T200>

            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="생성할 username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="생성할 password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={adminIsAdmin}
                  onChange={(e) => setAdminIsAdmin(e.target.checked)}
                />
                <Sans.T160 as="span">isAdmin</Sans.T160>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={adminIsSubstitute}
                  onChange={(e) => {
                    setAdminIsSubstitute(e.target.checked);
                    if (!e.target.checked) setAdminOriginalUserId('');
                  }}
                />
                <Sans.T160 as="span">isSubstitute</Sans.T160>
              </label>
              <input
                className="rounded-lg border px-3 py-2 disabled:opacity-40"
                placeholder="originalUserId (대리인인 경우 본계정 id, 본계정이면 빈칸)"
                value={adminOriginalUserId}
                disabled={!adminIsSubstitute}
                onChange={(e) => setAdminOriginalUserId(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="대상 userName (수정·삭제 시)"
                value={targetUserName}
                onChange={(e) => setTargetUserName(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="changeName (수정 시)"
                value={changeName}
                onChange={(e) => setChangeName(e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2"
                placeholder="changePw (수정 시)"
                value={changePw}
                onChange={(e) => setChangePw(e.target.value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending}
                onClick={() => run('GET /api/admin/users', () => getUsers())}
              >
                유저 목록 조회
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={
                  isPending ||
                  adminUsername.trim() === '' ||
                  adminPassword.trim() === '' ||
                  (adminIsSubstitute &&
                    !Number.isFinite(Number(adminOriginalUserId.trim())))
                }
                onClick={() =>
                  run('POST /api/admin/create-user', () =>
                    createUser(
                      adminUsername,
                      adminPassword,
                      adminIsAdmin,
                      adminIsSubstitute,
                      parsedOriginalUserId,
                    ),
                  )
                }
              >
                유저 생성
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || targetUserName.trim() === ''}
                onClick={() =>
                  run('PUT /api/admin/edit-user', () =>
                    editUser(targetUserName, {
                      changeName: changeName || undefined,
                      changePw: changePw || undefined,
                    }),
                  )
                }
              >
                유저 수정
              </button>

              <button
                className="rounded-lg border px-4 py-2"
                disabled={isPending || targetUserName.trim() === ''}
                onClick={() =>
                  run('DELETE /api/admin/delete-user', () =>
                    deleteUser(targetUserName),
                  )
                }
              >
                유저 삭제
              </button>
            </div>
          </section>

          {/*  5. Admin Smoke Tests  */}
          <section className="rounded-xl border p-4">
            <Sans.T200 as="h2">5. Admin Smoke Tests</Sans.T200>
            <Sans.T140
              as="p"
              className="mt-2"
              color="title-label"
            >
              실제 백엔드 연결 상태에서 1차 완료 조건을 자동 검증합니다. Admin
              섹션의 &quot;생성할 username / password&quot;를 입력한 뒤
              실행하세요. smoke용 계정은 테스트 후 직접 삭제해주세요.
            </Sans.T140>

            <div className="mt-4">
              <button
                className="rounded-lg border px-4 py-2 font-medium disabled:opacity-40"
                disabled={isSmokePending || isPending}
                onClick={runSmokeTests}
              >
                {isSmokePending ? '실행 중...' : '🧪 Smoke Test 실행'}
              </button>
            </div>

            {smokeResults.length > 0 && (
              <div className="mt-4 grid gap-2">
                {smokeResults.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start gap-3 rounded-lg border px-4 py-3"
                  >
                    <span className="mt-0.5 text-base">
                      {r.status === 'pass' ? '✅' : '❌'}
                    </span>
                    <div>
                      <Sans.T140
                        as="p"
                        weight="semi-bold"
                      >
                        {r.label}
                      </Sans.T140>
                      {r.status === 'fail' && (
                        <Sans.T140
                          as="p"
                          className="mt-1 text-red-500"
                        >
                          {r.detail}
                        </Sans.T140>
                      )}
                    </div>
                  </div>
                ))}

                <Sans.T140
                  as="p"
                  className="mt-1"
                  color="title-subvalue"
                >
                  {smokeResults.filter((r) => r.status === 'pass').length} /{' '}
                  {smokeResults.length} 통과
                </Sans.T140>
              </div>
            )}
          </section>
        </div>

        {/*  결과 패널  */}
        <section className="rounded-xl border p-4">
          <Sans.T200 as="h2">{resultTitle}</Sans.T200>

          {isPending && (
            <Sans.T160
              as="p"
              className="mt-3"
            >
              요청 중...
            </Sans.T160>
          )}

          {!!resultError && (
            <Sans.T160
              as="p"
              className="mt-3 text-red-500"
            >
              {resultError}
            </Sans.T160>
          )}

          {!isPending && !resultError && resultData !== undefined && (
            <pre className="mt-3 overflow-x-auto rounded-lg border p-4 text-sm">
              {JSON.stringify(resultData, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
