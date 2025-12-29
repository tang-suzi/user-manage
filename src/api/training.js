import request from "@/request";

export function getTrainingVideoList(params) {
  return request({
    url: "/training/video/list",
    method: "get",
    params,
  });
}
