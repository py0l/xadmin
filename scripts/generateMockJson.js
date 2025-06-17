const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 注册 ts-node 以便直接导入 TypeScript mock 文件
require('ts-node/register');

const MOCK_DIR = path.join(__dirname, '../mock');
const OUTPUT_DIR = path.join(__dirname, '../dist/mock');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 模拟 Express 的 Request 和 Response 对象
const mockRequest = (method, url, body = {}, query = {}, params = {}) => ({
  method,
  url,
  body,
  query,
  params, // 添加 params 属性
});

const mockResponse = () => {
  let data = null;
  let status = 200;
  let headers = {};

  const res = {
    status: (s) => {
      status = s;
      return res; // 返回 res 自身以支持链式调用
    },
    send: (d) => {
      data = d;
    },
    json: (d) => {
      data = d;
    },
    set: (key, value) => {
      headers[key] = value;
    },
    get: (key) => headers[key],
    _getData: () => data,
    _getStatus: () => status,
    _getHeaders: () => headers,
  };
  return res;
};

async function processMockFile(filePath) {
  console.log(`处理 mock 文件: ${filePath}`);

  let originalEnvValue;
  // 特殊处理 login.ts，模拟有权限状态
  if (filePath.includes('mock/user/login.ts')) {
    originalEnvValue = process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION;
    process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION = 'site';
  }

  const mockModule = require(filePath);
  const mockData = mockModule.default || mockModule;

  for (const route in mockData) {
    if (Object.prototype.hasOwnProperty.call(mockData, route)) {
      const handler = mockData[route];
      const [method, urlPath] = route.split(' ');

      if (!method || !urlPath) {
        console.warn(`跳过无效路由: ${route} 在文件: ${filePath}`);
        continue;
      }

      try {
        let reqBody = {};
        // 特殊处理 login.ts 的 POST /api/login/account 路由，模拟 admin 登录
        if (filePath.includes('mock/user/login.ts') && route === 'POST /api/login/account') {
          reqBody = { username: 'admin', password: 'ant.design' };
        }

        const req = mockRequest(method, urlPath, reqBody);
        const res = mockResponse();

        // 模拟异步处理
        await Promise.resolve(handler(req, res));

        const responseData = res._getData();
        if (responseData !== null) {
          // 将 URL 路径转换为文件名，替换斜杠为连字符，并移除开头的斜杠
          const fileName = urlPath.replace(/^\//, '').replace(/\//g, '-') + '.json';
          const outputPath = path.join(OUTPUT_DIR, fileName);

          fs.writeFileSync(outputPath, JSON.stringify(responseData, null, 2), 'utf8');
          console.log(`生成静态JSON: ${outputPath}`);
        } else {
          console.warn(`路由${route}未返回数据，跳过生成 JSON`);
        }
      } catch (error) {
        console.error(`处理路由 ${route} 时出错 (${filePath}):`, error);
      }
    }
  }

  // 恢复环境变量
  if (filePath.includes('mock/user/login.ts')) {
    process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION = originalEnvValue;
  }
}

async function generateMockJson() {
  const files = glob.sync('**/*.ts', { cwd: MOCK_DIR, absolute: true });

  for (const file of files) {
    await processMockFile(file);
  }
  console.log('所有 mock 数据已转换为静态 JSON。');
}

generateMockJson().catch(console.error);
