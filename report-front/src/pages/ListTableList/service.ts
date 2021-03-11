import { umiRequest } from '@/utils/newtec';
import { TableListParams, TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return umiRequest('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return umiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return umiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return umiRequest('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
