import { umiRequest } from '@/utils/newtec';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return umiRequest('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return umiRequest(`/api/login/captcha?mobile=${mobile}`);
}
