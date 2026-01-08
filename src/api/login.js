import request from "@/request";

export function login(params) {
  return request({
    url: "/train/train/auth/login",
    method: "post",
    params,
  });
}

export function getAllEnableOrg() {
  return request({
    url: "/train/train/sys/org/allEnable",
    method: "get",
  });
}
