/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import reportConfig from '../../../config/reportConfig';

export interface RequestBody {
  operServiceId: string; // 服务Id
  operId: string; // 操作Id，以上两个配置与平台的异步请求参数中的 operServiceId，operId一致
  data?: any, // 请求参数
  operType?: string, // "fetch",
  clientType?: string // 'web'
  [key: string]: any
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置 request 请求时的默认参数
 */
export const umiRequest = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

/**
 * request 拦截器, 统一配置 url 或 options.
 */
umiRequest.interceptors.request.use((url, options) => {
  return {
    url: url,
    options: { ...options },
  };
})

/**
 * response拦截器, 处理response
 */
umiRequest.interceptors.response.use((response, options) => {
  let token = response.headers.get("x-auth-token");
  if (token) {
    localStorage.setItem("x-auth-token", token);
  }
  return response;
});

/**
 * 请求工具
 * @param params 请求参数 
 * @param url 请求地址，默认为 /reportRouterServlet
 */
export const request = (params: RequestBody, url: string = reportConfig.reportServlet) => {
  params.token = "e3f20cc5d3d544a38a4d84d5d668b511"; // 测试 token，暂时不会产生影响
  return umiRequest(url, {
    method: 'POST',
    requestType: 'form', // 以 application/x-www-form-urlencoded;charset=UTF-8 格式提交
    data: {params: JSON.stringify(params)}
  });
};

export default request;