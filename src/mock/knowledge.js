import Mock from "mockjs";

const List = [];
const count = 50;

// 模拟 50 条知识库数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      karyotype: /4[5-7],[XY]{2},[+-][0-9]{1,2}/, // 模拟核型
      disease: "@ctitle(5, 10)综合征",
      gene: /[A-Z]{3,5}[0-9]{1,2}/,
      sourceFunction: "@cparagraph(1, 3)",
      clinicalFeatures: "@cparagraph(2, 4)",
      prognosis: "@cparagraph(2, 4)",
      literature: "@ctitle(5, 15)",
      referenceFile: "http://www.example.com/file.pdf",
    })
  );
}

export default {
  getKnowledgeList: (config) => {
    const { keyword, page = 1, limit = 20 } = param2Obj(config.url);

    const mockList = List.filter((item) => {
      if (
        keyword &&
        item.karyotype.indexOf(keyword) < 0 &&
        item.disease.indexOf(keyword) < 0
      )
        return false;
      return true;
    });

    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    );

    return {
      code: 200,
      message: "success",
      data: {
        total: mockList.length,
        items: pageList,
      },
    };
  },
};

// 解析 URL 参数
function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}
