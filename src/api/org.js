import request from "@/request";

// 获取机构列表
export function getOrgList(params) {
  return request({
    url: "/train/train/sys/org/page",
    method: "get",
    params,
  });
}

// 新建机构
export function addOrg(data) {
  return request({
    url: "/train/train/sys/org/add",
    method: "post",
    data,
  });
}

// 编辑机构
export function updateOrg(data) {
  return request({
    url: "/train/train/sys/org/edit",
    method: "put",
    data,
  });
}

// 删除机构
export function deleteOrg({ orgId }) {
  return request({
    url: "/train/train/sys/org/delete/" + orgId,
    method: "delete",
  });
}
