import Mock from "mockjs";

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "123456789" + "@increment",
      account: "Admin",
      username: "管理员",
      menu: "@pick(['角色管理', '用户管理', '机构管理', '日志管理'])",
      type: "@pick(['新增', '修改', '删除', '查询'])",
      time: "@datetime('yyyy/MM/dd HH:mm')",
      status: "@pick(['成功', '失败'])",
      description: "@pick(['查询', '成功', '失败'])",
    })
  );
}

export default {
  getLogList: (config) => {
    const {
      page = 1,
      limit = 20,
      account,
      menu,
      startTime,
      endTime,
    } = JSON.parse(
      JSON.stringify(
        config.url.split("?")[1]
          ? Object.fromEntries(new URLSearchParams(config.url.split("?")[1]))
          : {}
      )
    );

    const mockList = List.filter((item) => {
      if (account && item.account.indexOf(account) < 0) return false;
      if (menu && menu !== "全部" && item.menu !== menu) return false;
      // Simple date range check (string comparison for mock)
      if (startTime && item.time < startTime) return false;
      if (endTime && item.time > endTime) return false;
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
};
