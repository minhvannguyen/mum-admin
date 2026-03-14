import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7114/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export const reportApi = {
  getAllReport: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get("/reports/GetAll", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data.data;
  },

  // Cập nhật thông tin report
  updateReportStatus: async (reportId: number, status: string) => {
    const response = await api.put(`/reports/UpdateStatus/${reportId}`, {
      status,
    });

    return response.data;
  },

  // api tìm kiếm genre
  searchReports: async (
    keyword: string,
    page: number = 1,
    pageSize: number = 25
  ) => {
    const response = await api.get("/reports/Search", {
      params: {
        keyword,
        page,
        pageSize,
      },
    });

    return response.data.data;
  },

  // api xoá genre
  deleteReport: async (reportId: number) => {
    const response = await api.delete(`/reports/Delete/${reportId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },
};
