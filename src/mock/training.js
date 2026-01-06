import Mock from "mockjs";

const VideoList = [];
const count = 100;

for (let i = 0; i < count; i++) {
  VideoList.push(
    Mock.mock({
      id: "@increment",
      title: "上海人民医院培训视频",
      coverUrl: "https://via.placeholder.com/300x200?text=Video+Cover",
      videoUrl:
        "https://vdept3.bdstatic.com/mda-pds7y2fikc3dk1ez/cae_h264/1682609693880284617/mda-pds7y2fikc3dk1ez.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1766987359-0-0-f6ee65efa3988f496abc340da7e9b1cc&bcevod_channel=searchbox_feed&pd=1&cr=0&cd=0&pt=3&logid=2959781807&vid=5707209893603857644&klogid=2959781807&abtest=",
      duration: "10:00",
      createTime: "@datetime",
    })
  );
}

const PracticeList = [];
const practiceCount = 5;

for (let i = 0; i < practiceCount; i++) {
  PracticeList.push(
    Mock.mock({
      id: "@increment",
      content:
        "2025" +
        i +
        " (202500-" +
        String.fromCharCode(65 + i) +
        ", 202500-" +
        String.fromCharCode(66 + i) +
        "): 请结合临床信息和核型图像判断染色体核型。",
      imageUrl: "https://via.placeholder.com/800x200?text=Karyotype+Image",
      correctAnswer: "46,XY",
      type: "input",
    })
  );
}

const EvaluationList = [];
const evalCount = 20;

for (let i = 0; i < evalCount; i++) {
  EvaluationList.push(
    Mock.mock({
      id: "@increment",
      centerName: "上海第一人民医院",
      startTime: "2023-01-12 00:00:00",
      endTime: "2023-01-20 00:00:00",
      score: "12.00",
    })
  );
}

// const EvaluationDetails = {};

export default {
  getTrainingVideoList: (config) => {
    const { page = 1, size = 10 } = JSON.parse(
      JSON.stringify(
        config.url.split("?")[1]
          ? Object.fromEntries(new URLSearchParams(config.url.split("?")[1]))
          : {}
      )
    );
    const p = Number(page) || 1;
    const s = Number(size) || 10;
    const pageList = VideoList.filter(
      (item, index) => index < s * p && index >= s * (p - 1)
    );
    return {
      code: 200,
      data: {
        total: VideoList.length,
        items: pageList,
      },
    };
  },
  getPracticeList: () => {
    return {
      code: 200,
      data: {
        total: PracticeList.length,
        items: PracticeList,
      },
    };
  },
  getEvaluationList: (config) => {
    const { page = 1, limit = 20 } = JSON.parse(
      JSON.stringify(
        config.url.split("?")[1]
          ? Object.fromEntries(new URLSearchParams(config.url.split("?")[1]))
          : {}
      )
    );

    const pageList = EvaluationList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    );

    return {
      code: 200,
      data: {
        total: EvaluationList.length,
        items: pageList,
      },
    };
  },
  getEvaluationDetail: (config) => {
    const { id } = JSON.parse(
      JSON.stringify(
        config.url.split("?")[1]
          ? Object.fromEntries(new URLSearchParams(config.url.split("?")[1]))
          : {}
      )
    );

    // Generate details based on ID (or just random)
    const details = [];
    for (let i = 0; i < 5; i++) {
      const isCorrect = i === 4 ? false : true; // Make 5th item wrong for demo
      details.push({
        id: id + 1,
        content: `20250${i + 6} (20250${i + 6}-A、20250${i + 6}-B、20250${
          i + 6
        }-C、20250${i + 6}-D、20250${
          i + 6
        }-E): 来自外周血染色体异常的29岁孕妇，胚胎移植术后孕17周的胎儿羊水细胞染色体。`,
        imageUrl:
          "https://img.zcool.cn/community/01f57e5d1ac64fa8012155291b5c03.png@1280w_1l_2o_100sh.png", // Use a placeholder that looks like karyotype if possible, or just a wide image
        correctAnswer: "46,XY",
        userAnswer: isCorrect ? "46,XY" : "46,XX",
        isCorrect: isCorrect,
        score: isCorrect ? 20 : 0,
      });
    }

    return {
      code: 200,
      data: {
        items: details,
      },
    };
  },
};
