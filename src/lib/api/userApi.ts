import { UserRequest } from "@/types/User";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7114/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export const userApi = {
  getUsers: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get("/users/GetUsers", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data.data;
  },

  // Tạo user mới
  createUser: async (data: UserRequest) => {
    try {
      const formData = new FormData();

      formData.append("Username", data.username);
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("Role", data.role || "User");
      formData.append("IsActive", data.isActive ? "true" : "false");

      if (data.avatarUrl) {
        formData.append("avatar", data.avatarUrl);
      }

      const response = await api.post("/users/CreateUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("CreateUser error:", error);

      throw {
        success: false,
        message: "Không thể tạo user",
      };
    }
  },

  // Cập nhật thông tin user
  updateUser: async (userId: number, formData: FormData) => {
    const response = await api.put(`/users/UpdateUser/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // api tìm kiếm người dùng
  searchUsers: async (
    keyword: string,
    page: number = 1,
    pageSize: number = 10,
  ) => {
    const response = await api.get(`/users/SearchUsersByName`, {
      params: {
        keyword,
        page,
        pageSize,
      },
    });
    return response.data.data.data;
  },

  // Lấy thông tin user theo ID
  getUserById: async (userId: number) => {
    const response = await api.get(`/users/GetUser/${userId}`);
    return response.data;
  },

  // api xoá người dùng
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/users/DeleteUser/${userId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

};
