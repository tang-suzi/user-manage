import request from "@/request";

export function login(data) {
  return request({
    url: "/train/auth/login",
    method: "post",
    data,
  });
}
