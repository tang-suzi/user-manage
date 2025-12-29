import Mock from "mockjs";

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      name: "@ctitle(5, 10)医院",
      code: /\d{10}/,
      adminAccount: "@word(5, 8)",
      adminName: "@cname",
      "status|1": [0, 1], // 0: 禁用, 1: 启用
      createTime: "@datetime",
    })
  );
}

export default {
  // 获取列表
  getOrgList: (config) => {
    const {
      name,
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
      if (name && item.name.indexOf(name) < 0) return false;
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
  createOrg: (config) => {
    const { name, code, adminAccount, adminName, status } = JSON.parse(
      config.body
    );
    List.unshift({
      id: Mock.mock("@increment"),
      name,
      code,
      adminAccount,
      adminName,
      status,
      createTime: Mock.mock("@datetime"),
    });
    return {
      code: 200,
      message: "添加成功",
    };
  },
  // 修改
  updateOrg: (config) => {
    const { id, name, code, adminAccount, adminName, status } = JSON.parse(
      config.body
    );
    const item = List.find((item) => item.id === id);
    if (item) {
      item.name = name;
      item.code = code;
      item.adminAccount = adminAccount;
      item.adminName = adminName;
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
  deleteOrg: (config) => {
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
