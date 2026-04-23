'use client';

import { Sans } from '@/app/ui/sans';
import { createUser, deleteUser, editUser } from '@/services/admin';
import { getCurrentUser, signIn, signOut } from '@/services/auth';
import {
  createPoll,
  deletePoll,
  editPoll,
  endPoll,
  getPollResults,
  getPolls,
  startPoll,
} from '@/services/polls';
import {
  castVote,
  editVote,
  getMyVote,
  getVoteResults,
} from '@/services/votes';

import { useState } from 'react';

/* eslint-disable @typescript-eslint/no-empty-object-type */
type Props = Readonly<{}>;

type JsonValue = unknown;

export default function Page({}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [pollId, setPollId] = useState('');
  const [selected, setSelected] = useState('');
  const [question, setQuestion] = useState('');
  const [optionsText, setOptionsText] = useState('');

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminIsAdmin, setAdminIsAdmin] = useState(false);
  const [targetUserName, setTargetUserName] = useState('');
  const [changeName, setChangeName] = useState('');
  const [changePw, setChangePw] = useState('');

  const [resultTitle, setResultTitle] = useState('결과');
  const [resultData, setResultData] = useState<JsonValue>(null);
  const [resultError, setResultError] = useState<string>('');
  const [isPending, setIsPending] = useState(false);

  const parsedPollId = Number(pollId);
  const parsedOptions = optionsText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

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

  return (
    <div className="min-h-screen p-5">
      <Sans.T240 as="h1">API 연동 테스트 페이지</Sans.T240>

      <div className="mt-6 grid gap-6">
        <section className="rounded-xl border p-4">
          <Sans.T200 as="h2">1. Auth</Sans.T200>

          <div className="mt-4 grid gap-3">
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending}
              onClick={() =>
                run('POST /api/auth/login', async () =>
                  signIn(username, password),
                )
              }
            >
              로그인
            </button>

            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending}
              onClick={() =>
                run('GET /api/auth/me', async () => getCurrentUser())
              }
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

        <section className="rounded-xl border p-4">
          <Sans.T200 as="h2">2. Polls</Sans.T200>

          <div className="mt-4 grid gap-3">
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="poll id"
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
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending}
              onClick={() => run('GET /api/polls', async () => getPolls())}
            >
              투표 목록 조회
            </button>

            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending || !Number.isFinite(parsedPollId)}
              onClick={() =>
                run('POST /api/polls/poll-results', async () =>
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
                run('POST /api/polls/create-poll', async () =>
                  createPoll(question, parsedOptions, 1),
                )
              }
            >
              poll 생성
            </button>

            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending || !Number.isFinite(parsedPollId)}
              onClick={() =>
                run('PATCH /api/polls/edit-poll', async () =>
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
          </div>
        </section>

        <section className="rounded-xl border p-4">
          <Sans.T200 as="h2">3. Votes</Sans.T200>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending || !Number.isFinite(parsedPollId)}
              onClick={() =>
                run('POST /api/votes/my-vote', async () =>
                  getMyVote(parsedPollId),
                )
              }
            >
              내 투표 조회
            </button>

            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending || !Number.isFinite(parsedPollId)}
              onClick={() =>
                run('POST /api/votes/results', async () =>
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
          </div>
        </section>

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

            <input
              className="rounded-lg border px-3 py-2"
              placeholder="대상 userName"
              value={targetUserName}
              onChange={(e) => setTargetUserName(e.target.value)}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="changeName"
              value={changeName}
              onChange={(e) => setChangeName(e.target.value)}
            />
            <input
              className="rounded-lg border px-3 py-2"
              placeholder="changePw"
              value={changePw}
              onChange={(e) => setChangePw(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg border px-4 py-2"
              disabled={
                isPending ||
                adminUsername.trim() === '' ||
                adminPassword.trim() === ''
              }
              onClick={() =>
                run('POST /api/admin/create-user', async () =>
                  createUser(adminUsername, adminPassword, adminIsAdmin),
                )
              }
            >
              유저 생성
            </button>

            <button
              className="rounded-lg border px-4 py-2"
              disabled={isPending || targetUserName.trim() === ''}
              onClick={() =>
                run('PUT /api/admin/edit-user', async () =>
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
                run('DELETE /api/admin/delete-user', async () =>
                  deleteUser(targetUserName),
                )
              }
            >
              유저 삭제
            </button>
          </div>
        </section>

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

          {!isPending && !resultError && resultData !== null && (
            <pre className="mt-3 overflow-x-auto rounded-lg border p-4 text-sm">
              {JSON.stringify(resultData, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
