import { stringify } from 'qs';
import request from '../utils/request';

// 添加赠品
export async function updateAPK(params) {
  return request('localhost:3001/updateAPK', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
