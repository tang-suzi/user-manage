import request from "@/request";

export function getConsultationList(params) {
  return request({
    url: "/api/consultation/list",
    method: "get",
    params,
  });
}

export function createConsultation(data) {
  return request({
    url: "/api/consultation/create",
    method: "post",
    data,
  });
}

export function updateConsultation(data) {
  return request({
    url: "/api/consultation/update",
    method: "post",
    data,
  });
}

export function deleteConsultation(id) {
  return request({
    url: "/api/consultation/delete",
    method: "post",
    params: { id },
  });
}

export function withdrawConsultation(id) {
  return request({
    url: "/api/consultation/withdraw",
    method: "post",
    params: { id },
  });
}
