import Mock from "mockjs";
const param2Obj = function (url) {
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
};

const List = [];
const count = 50;

const baseContent =
  '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri =
  "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3";

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      orderNumber: /ORD[0-9]{8}/,
      sampleNumber: /SAM[0-9]{8}/,
      "analysisMode|1": ["自动分析", "手动分析"],
      "urgency|1": ["普通", "紧急"],
      "remainingTime|1": ["24h", "12h", "4h", "超时"],
      "aiResult|1": ["阳性", "阴性", "可疑"],
      confirmDoctor: "@cname",
      "reviewResult|1": ["通过", "不通过", "待复核"],
      createTime: "@datetime",
      finishTime: "@datetime",

      // Existing fields mapped or kept
      caseNumber: /CN[0-9]{8}/, // Maybe map to orderNumber or sampleNumber in UI? user asked for orderNumber and sampleNumber
      patientName: "@cname",
      "age|1-100": 1,
      "gender|1": ["男", "女"],
      "consultationType|1": [
        "case_analysis",
        "difficult_consultation",
        "report_review",
      ],
      "status|1": ["pending", "processing", "completed", "rejected"], // 对应：待咨询, 咨询中, 已完成, 已拒绝. User used Chinese in prompt select but English keys are fine if mapped.
      applyDate: "@datetime",
      applicant: "@cname",
      expert: "@cname", // Receiving Expert
      description: "@csentence(10, 30)",
      content: baseContent,
      image_uri,
    })
  );
}

export default {
  getConsultationList: (config) => {
    const {
      type,
      keyword,
      page = 1,
      limit = 20,
      analysisMode,
      remainingTime,
      orderStatus,
    } = param2Obj(config.url);

    const mockList = List.filter((item) => {
      if (type && item.consultationType !== type) return false;
      if (
        keyword &&
        item.patientName.indexOf(keyword) < 0 &&
        item.orderNumber.indexOf(keyword) < 0 &&
        item.sampleNumber.indexOf(keyword) < 0
      )
        return false;
      if (analysisMode && item.analysisMode !== analysisMode) return false;
      if (remainingTime && item.remainingTime !== remainingTime) return false;
      // Map status if needed, simplified for mock
      if (orderStatus && item.status !== orderStatus) return false;

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
  createConsultation: () => ({
    code: 200,
    data: "success",
  }),
  updateConsultation: () => ({
    code: 200,
    data: "success",
  }),
  deleteConsultation: () => ({
    code: 200,
    data: "success",
  }),
  withdrawConsultation: () => ({
    code: 200,
    data: "success",
  }),
};
