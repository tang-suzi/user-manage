import Mock from "mockjs";

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.mock("@increment"),
      account: "@word(5, 8)",
      name: "@cname",
      orgName: "上海新华医院",
      roleName: "管理员",
      creator: "@cname",
      "status|1": [0, 1], // 0: 禁用, 1: 启用
      createTime: "@datetime",
    })
  );
}

export default {
  // 获取列表
  getUserList: (config) => {
    const {
      keyword,
      page = 1,
      limit = 20,
    } = JSON.parse(
      JSON.stringify(
        config.url.split("?")[1]
          ? Object.fromEntries(new URLSearchParams(config.url.split("?")[1]))
          : {}
      )
    );

    const mockList = List.filter((item) => {
      if (
        keyword &&
        item.name.indexOf(keyword) < 0 &&
        item.account.indexOf(keyword) < 0
      )
        return false;
      return true;
    });

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    );

    return {
      code: 200,
      data: {
        total: mockList.length,
        items: pageList,
      },
    };
  },
  // 增加
  createUser: (config) => {
    const { account, name, status } = JSON.parse(config.body);
    List.unshift({
      id: Mock.mock("@increment"),
      account,
      name,
      orgName: "上海新华医院", // 默认
      roleName: "管理员", // 简化，实际应根据roleId查
      creator: "Admin",
      status,
      createTime: Mock.mock("@datetime"),
    });
    return {
      code: 200,
      message: "添加成功",
    };
  },
  // 修改
  updateUser: (config) => {
    const { id, account, name, status } = JSON.parse(config.body);
    const item = List.find((item) => item.id === id);
    if (item) {
      item.account = account;
      item.name = name;
      // item.roleId = roleId;
      item.status = status;
      return {
        code: 200,
        message: "编辑成功",
      };
    }
    return {
      code: 500,
      message: "编辑失败",
    };
  },
  // 删除
  deleteUser: (config) => {
    const { id } = JSON.parse(config.body);
    const index = List.findIndex((item) => item.id === id);
    if (index !== -1) {
      List.splice(index, 1);
      return {
        code: 200,
        message: "删除成功",
      };
    }
    return {
      code: 500,
      message: "删除失败",
    };
  },
};
