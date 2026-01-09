import request from "@/request";

export function getLogList(params) {
  return request({
    url: "/train/train/sys/operLog/list",
    method: "post",
    params,
  });
}
