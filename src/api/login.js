import request from "@/request";

export function login(data) {
  return request({
    url: "/train/train/auth/login",
    method: "post",
    params: { ...data },
  });
}
