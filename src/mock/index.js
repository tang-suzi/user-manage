import Mock from "mockjs";
import orgAPI from "./org";
import roleAPI from "./role";
import userAPI from "./user";

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

// 用户管理相关
Mock.mock(/\/api\/user\/list/, "get", userAPI.getUserList);
Mock.mock(/\/api\/user\/add/, "post", userAPI.createUser);
Mock.mock(/\/api\/user\/update/, "post", userAPI.updateUser);
Mock.mock(/\/api\/user\/delete/, "post", userAPI.deleteUser);

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

export default Mock;
