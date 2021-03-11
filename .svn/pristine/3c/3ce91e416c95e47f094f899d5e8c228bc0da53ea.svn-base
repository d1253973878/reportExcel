import { Request, Response } from 'express';
import {getSuccessResponse, getFailedResponse} from '../src/utils/result'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * 获取验证码
 * @param req 
 * @param res 
 */
async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json(getSuccessResponse('captcha-xxx'));
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': getSuccessResponse({
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁集团－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888'
  }),
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, userName, type } = req.body;
    await waitTime(2000);
    if (password === 'ant.design' && userName === 'admin') {
      res.send(getSuccessResponse({
        type,
        currentAuthority: 'admin',
      }));
      return;
    }
    if (password === 'ant.design' && userName === 'user') {
      res.send(getSuccessResponse({
        type,
        currentAuthority: 'user',
      }));
      return;
    }
    if (type === 'mobile') {
      res.send(getSuccessResponse({
        type,
        currentAuthority: 'admin',
      }));
      return;
    }

    res.send(getFailedResponse(6001, {
      type,
      currentAuthority: 'guest',
    }));
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send(getFailedResponse(500, {
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    }));
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send(getFailedResponse(404, {
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    }));
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send(getFailedResponse(403, {
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    }));
  },
  'GET /api/login/captcha': getFakeCaptcha,
};
