import axios from 'axios';

// export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ApiErrorPayload = {
  status: 'error';
  message: string;
};

export type ApiSuccessResponse<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  status: 'ok';
} & T;

export const isApiErrorPayload = (value: unknown): value is ApiErrorPayload => {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).status === 'error' &&
    typeof (value as Record<string, unknown>).message === 'string'
  );
};

export const parseApiError = (error: unknown): ApiErrorPayload => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return {
        status: 'error',
        message:
          '요청 시간이 초과되었습니다. 네트워크 상태를 확인한 뒤 다시 시도해주세요.',
      };
    }

    const responseData = error.response?.data;

    if (isApiErrorPayload(responseData)) {
      return responseData;
    }

    const message =
      typeof responseData === 'string'
        ? responseData
        : error.message || '서버 통신 중 오류가 발생했습니다.';

    return {
      status: 'error',
      message,
    };
  }

  if (error instanceof Error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'error',
    message: '알 수 없는 오류가 발생했습니다.',
  };
};
