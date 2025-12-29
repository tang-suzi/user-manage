import request from "@/request";

// 获取用户列表
export function getUserList(params) {
  return request({
    url: "/api/user/list",
    method: "get",
    params,
  });
}

// 新建用户
export function addUser(data) {
  return request({
    url: "/api/user/add",
    method: "post",
    data,
  });
}

// 编辑用户
export function updateUser(data) {
  return request({
    url: "/api/user/update",
    method: "post",
    data,
  });
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: "/api/user/delete",
    method: "post",
    data,
  });
}
