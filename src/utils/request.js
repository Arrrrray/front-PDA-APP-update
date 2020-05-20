import fetch from 'dva/fetch';
import { notification } from 'antd';
// import router from 'umi/router';
// import hash from 'hash.js';
// import { isAntdPro } from './utils';
// import { routerRedux } from 'dva/router';
import router from 'umi/router';
// import user from './user';
// import { getAuthority } from './authority';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  let optionCopy = Object.assign({}, option);
  const { fail, success } = optionCopy;

  // 把处理函数从options里面提取出来，和原来表示请求配置的options分开
  let handlers = {};
  if (fail) {
    if (typeof fail === 'function') {
      handlers.fail = optionCopy.fail;
    }
    delete optionCopy.fail;
  }
  if (success) {
    if (typeof success === 'function') {
      handlers.success = optionCopy.success;
    }
    delete optionCopy.success;
  }

  const options = {
    // expirys: isAntdPro(),
    ...optionCopy,
  };
  /**
   * Produce fingerprints based on url and parameters
   * 根据url和参数生成指纹
   * Maybe url has the same parameters
   * url可能有相同的参数
   */
  // const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  // const hashcode = hash
  //   .sha256()
  //   .update(fingerprint)
  //   .digest('hex');

  const defaultOptions = {
    // credentials: 'include',
    // 后台的请求地址是否需要 token
    hasToken: true,
  };

  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE' ||
    newOptions.method === 'PATCH'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  // 不存在headers则创建
  if (!newOptions.headers) {
    newOptions.headers = Object.create(null);
  }
  // 设置 access token
  if (newOptions.hasToken) {
    // const userInfo = user.getUserInfo();
    // const userInfo = getAuthority();

    if (!userInfo) {
      router.push('/user/login');
      return;
    }
    newOptions.headers['Authorization'] = 'Token ' + userInfo.accessToken;
  }

  // const expirys = options.expirys && 60;
  // // options.expirys !== false, return the cache,
  // if (options.expirys !== false) {
  //   const cached = sessionStorage.getItem(hashcode);
  //   const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
  //   if (cached !== null && whenCached !== null) {
  //     const age = (Date.now() - whenCached) / 1000;
  //     if (age < expirys) {
  //       const response = new Response(new Blob([cached]));
  //       return response.json();
  //     }
  //     sessionStorage.removeItem(hashcode);
  //     sessionStorage.removeItem(`${hashcode}:timestamp`);
  //   }
  // }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(handleSuccess.bind(null, handlers.success))
    .catch(handleError.bind(null, handlers.fail));
}

// 检查请求的状态码
async function checkStatus(response) {
  const { status } = response;
  if (!status) {
    let error = new Error('没有状态码');
    throw error; // 抛出错误
  }
  let responseData = {};
  if (status >= 200 && status < 300) {
    // 请求成功的情况
    let data = { status };
    if (status === 204) {
      return data;
    }
    responseData = await response.json();
    data.responseData = responseData;
    return data;
  } else {
    // 请求失败的情况
    const errorText = codeMessage[status] || response.statusText;
    const error = new Error(errorText);
    error.status = status;
    try {
      // 通过try/catch判断错误请求是否有正常的响应体，如果有，就拿到响应的json数据。
      error.responseData = await response.json();
    } catch (e) {
      error.responseData = {};
    }
    throw error; // 抛出错误
  }
}
// 处理正确的状态码
function handleSuccess(successHandler, data) {
  const { status, responseData } = data;
  if (status === 204) {
    // 状态码为204时的特殊处理
    return Promise.resolve({
      status: 204,
      message: '删除数据成功。',
    });
  }
  successHandler && successHandler(responseData);
  return responseData;
}

// 处理错误的状态码
function handleError(failHandler, error) {
  let status = error.status;
  let responseData = error.responseData;
  // 如果请求失败的函数存在，并且执行函数的结果的值是一个假值，那就不执行后续的操作了
  if (failHandler && !failHandler(responseData)) return;
  if (error.message === '没有状态码') {
    notification.error({
      message: '错误提示',
      description: '请求失败',
    });
    return;
  }
  switch (true) {
    case status === 401:
      const { dispatch } = window.g_app._store;
      dispatch({
        type: 'login/logout',
      });
      break;
    case status === 404:
      notification.error({
        message: '错误提示',
        description: '你请求的资源不存在',
      });
      break;
    case status >= 500:
      notification.error({
        message: '错误提示',
        description: codeMessage[status] || `服务器错误：${status}`,
      });
      break;
    default:
      if (responseData) {
        if (responseData.message) {
          notification.error({
            message: '错误提示',
            description: responseData.message,
          });
          break;
        }
        if (responseData.errors) {
          responseData.errors.forEach(item => {
            notification.error({
              message: '错误提示',
              description: item.message,
            });
          });
          break;
        }
      }
      notification.error({
        message: '错误提示',
        description: '服务器发生错误，请检查服务器',
      });
      break;
  }
  throw error; // 之前的逻辑中包含try catch 的逻辑，所以在这里再次将错误抛出
}
