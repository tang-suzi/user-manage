import request from "@/request";

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: "/api/role/list",
    method: "get",
    params,
  });
}

// 新建角色
export function addRole(data) {
  return request({
    url: "/api/role/add",
    method: "post",
    data,
  });
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: "/api/role/update",
    method: "post",
    data,
  });
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: "/api/role/delete",
    method: "post",
    data,
  });
}
