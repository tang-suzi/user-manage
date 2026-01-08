import request from "@/request";

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: `/train/train/sys/role/page`,
    method: "get",
    params,
  });
}

// 新建角色
export function addRole(data) {
  return request({
    url: "/train/train/sys/role/add",
    method: "post",
    data,
  });
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: "/train/train/sys/role/edit",
    method: "post",
    data,
  });
}

// 删除角色
export function deleteRole({ roleId }) {
  return request({
    url: `/train/train/sys/role/delete/${roleId}`,
    method: "delete",
  });
}

// 角色详情
export function getRoleDetail({ roleId }) {
  return request({
    url: `/train/train/sys/role/queryRoleById/${roleId}`,
    method: "get",
  });
}

export function getCurrentOrgMenuTree() {
  return request({
    url: "/train/train/sys/menu/currentOrgMenuTree",
    method: "get",
  });
}
