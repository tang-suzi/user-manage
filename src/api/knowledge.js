import request from "@/request";

export function getKnowledgeList(params) {
  return request({
    url: "/train/train/search/knowlege/search",
    method: "get",
    params,
  });
}

// /train/upload/mgr/download/pdf/{id}
export function downloadKnowledgePdf({ id }) {
  return request({
    url: `/train/train/upload/mgr/download/pdf/${id}`,
    method: "get",
    responseType: "blob",
  });
}
