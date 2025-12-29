import Mock from "mockjs";
import orgAPI from "./org";
import roleAPI from "./role";

// 设置延时，模拟网络请求延时
Mock.setup({
  timeout: "200-600",
});

// 机构管理相关
Mock.mock(/\/api\/org\/list/, "get", orgAPI.getOrgList);
Mock.mock(/\/api\/org\/add/, "post", orgAPI.createOrg);
Mock.mock(/\/api\/org\/update/, "post", orgAPI.updateOrg);
Mock.mock(/\/api\/org\/delete/, "post", orgAPI.deleteOrg);

// 角色管理相关
Mock.mock(/\/api\/role\/list/, "get", roleAPI.getRoleList);
Mock.mock(/\/api\/role\/add/, "post", roleAPI.createRole);
Mock.mock(/\/api\/role\/update/, "post", roleAPI.updateRole);
Mock.mock(/\/api\/role\/delete/, "post", roleAPI.deleteRole);

// 模拟接口
Mock.mock(/\/api\/user\/login/, "post", {
  code: 200,
  message: "登录成功",
  data: {
    token: "mock-token-123456",
    userInfo: {
      name: "Mock User",
      avatar: "https://wpimg.wallstcn.com/f.gif",
    },
  },
});

// 模拟获取用户列表
Mock.mock(/\/api\/user\/list/, "get", {
  code: 200,
  message: "获取成功",
  "data|10": [
    {
      "id|+1": 1,
      name: "@cname",
      "age|18-60": 1,
      address: "@county(true)",
      date: "@date('YYYY-MM-dd')",
    },
  ],
});

export default Mock;
