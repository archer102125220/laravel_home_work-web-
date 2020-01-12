import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';

const SERVER_PREFIX = process.env.SERVER_PREFIX || 'api',
  SERVER_PORT = process.env.SERVER_PORT || 80,
  SERVER_HOST = process.env.SERVER_HOST || 'localhost',
  SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';

const baseURL =
  SERVER_PROTOCOL +
  '://' +
  SERVER_HOST +
  ':' +
  SERVER_PORT +
  '/' +
  SERVER_PREFIX;
//透過axios向API請求資料

const ax = axios.create({ baseURL }); //建立與API跟目錄連線與操作的物件

function fetch(_method = 'GET', url, _params = {}, _extendOption = {}) {
  const method = _.toUpper(_method);
  let params = {};
  // method.match(/GET/)  //match比對完的結果會回傳一個OBJ，而屬性input則為method的值，故 字串.match(正規表示).input 可用於switch-case裡面
  switch (method) {
    case (method.match(/POST|PUT|PATCH|DELETE/i) || {}).input:
      params.data = _params;
      break;
    case (method.match(/GET/i) || {}).input:
      params.params = _params;
      break;
    default:
      params = {};
      break;
  }
  return ax.request({//透過連線操作物件，向API請求與傳送資料
    url,
    method,
    paramsSerializer: (params) => {//預防瀏覽器不支援做轉換
      return qs.stringify(params, { encodeValuesOnly: true });
    },
    ...params,
    ..._extendOption,
    // withCredentials: true,
  }).then((response) => response.data);
}

export default fetch;
