import request from "@/request";

// 获取机构列表
export function getOrgList(params) {
  return request({
    url: "/api/org/list",
    method: "get",
    params,
  });
}

// 新建机构
export function addOrg(data) {
  return request({
    url: "/api/org/add",
    method: "post",
    data,
  });
}

// 编辑机构
export function updateOrg(data) {
  return request({
    url: "/api/org/update",
    method: "post",
    data,
  });
}

// 删除机构
export function deleteOrg(data) {
  return request({
    url: "/api/org/delete",
    method: "post",
    data,
  });
}
