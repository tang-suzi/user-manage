import Mock from "mockjs";

const List = [];
const count = 10;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      title: "上海人民医院培训视频",
      coverUrl: "https://via.placeholder.com/300x200?text=Video+Cover",
      videoUrl: "",
      duration: "10:00",
      createTime: "@datetime",
    })
  );
}

export default {
  getTrainingVideoList: () => {
    return {
      code: 200,
      data: {
        total: List.length,
        items: List,
      },
    };
  },
};
