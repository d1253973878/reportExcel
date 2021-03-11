import { request } from '@/utils/newtec';
import { Datasource } from '../DatasourceUpdateModal';

/**
 * 获取一个数据源
 */
export async function queryOneDb(params: Datasource) {
  return request({
    operServiceId: 'connectionService',
    operId: 'getOneConnction',
    data: params,
  });
}

export async function deleteConnection(id: string) {
  return request({
    operServiceId: 'connectionService',
    operId: 'deleteConnection',
    data: id,
  });
}

/**
 * 测试数据源连接
 * @param connection
 */
export async function testConnection(connection: Datasource) {
  return request({
    operServiceId: 'connectionService',
    operId: 'testConnection',
    data: connection,
  });
}

/**
 * 新增数据源
 * @param connection
 */
export async function addConnection(connection: Datasource) {
  return request({
    operServiceId: 'connectionService',
    operId: 'addConnection',
    data: connection,
  });
}

/**
 *更新数据源
 * @param connection
 */
export async function updateConnection(connection: Datasource) {
  return request({
    operServiceId: 'connectionService',
    operId: 'updateConnection',
    data: connection,
  });
}