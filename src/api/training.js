import request from "@/request";

export function getTrainingVideoList(params) {
  return request({
    url: "/training/video/list",
    method: "get",
    params,
  });
}

export function getPracticeList(params) {
  return request({
    url: "/training/practice/list",
    method: "get",
    params,
  });
}

export function getEvaluationList(params) {
  return request({
    url: "/training/evaluation/list",
    method: "get",
    params,
  });
}

export function getEvaluationDetail(params) {
  return request({
    url: "/training/evaluation/detail",
    method: "get",
    params,
  });
}
