import request from "@/request";

export function getKnowledgeList(params) {
  return request({
    url: "/api/knowledge/list",
    method: "get",
    params,
  });
}
