import request from "@/request";

export function getTrainingVideoList(params) {
  console.log(params, "params");
  return request({
    url: "/train/train/training/video/list",
    method: "get",
    params,
  });
}

export function getPracticeList(params) {
  return request({
    url: "/train/train/training/question/randomQuestions",
    method: "get",
    params,
  });
}

export function getReRandomQuestions(params) {
  return request({
    url: "/train/train/training/question/reRandomQuestions",
    method: "get",
    params,
  });
}

export function getQualityList(params) {
  return request({
    url: "/train/train/training/quality/list",
    method: "get",
    params,
  });
}

export function getQualityDetail({ qualityId }) {
  return request({
    url: `/train/train/training/quality/${qualityId}`,
    method: "get",
  });
}

export function judgePractice(data) {
  return request({
    url: "/train/train/training/question/judge",
    method: "post",
    data,
  });
}

export function getRandomQuality(params) {
  return request({
    url: "/train/train/training/quality/randomQuality",
    method: "get",
    params,
  });
}

export function getReRandomQuality(params) {
  return request({
    url: "/train/train/training/quality/reRandomQuality",
    method: "get",
    params,
  });
}

export function judgeQuality(data) {
  return request({
    url: "/train/train/training/question/judgeQuality",
    method: "post",
    data,
  });
}
