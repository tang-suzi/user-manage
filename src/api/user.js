import request from "@/request";

// 获取用户列表
export function getUserList(params) {
  return request({
    url: "/train/train/sys/user/page",
    method: "get",
    params,
  });
}

// 新建用户
export function addUser(data) {
  return request({
    url: "/train/train/sys/user/add",
    method: "post",
    data,
  });
}

// 编辑用户
export function updateUser(data) {
  return request({
    url: "/train/train/sys/user/edit",
    method: "put",
    data,
  });
}

// 删除用户
export function deleteUser({ userId }) {
  return request({
    url: `/api/user/delete/${userId}`,
    method: "delete",
  });
}

export function getMenuTree(data) {
  return request({
    url: "/train/train/sys/menu/tree",
    method: "get",
    data,
  });
}
export function getCurrentUserPermTree(data) {
  return request({
    url: "/train/train/sys/menu/currentUserPermTree",
    method: "get",
    data,
  });
}

export function getRoleListByOrg({ orgId }) {
  return request({
    url: `/train/train/sys/role/listByOrg/${orgId}`,
    method: "get",
  });
}

// /train/sys/user/detail/{userId}
export function getUserDetail({ userId }) {
  return request({
    url: `/train/train/sys/user/detail/${userId}`,
    method: "get",
  });
}
