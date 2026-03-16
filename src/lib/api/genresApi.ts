import axios from "axios";
import { Genre, GenreRequest, GetGenresResponse } from "@/types/Genre";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export const genresAPI = {
  getGenres: async (): Promise<GetGenresResponse> => {
    const response = await api.get("/genres/GetGenres");
    return response.data;
  },

  getAllGenres: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get("/genres/GetAllGenres", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data.data;
  },

    createGenre: async (data: GenreRequest) => {
      try {
        const formData = new FormData();
  
        formData.append("Name", data.name);
        formData.append("Slug", data.slug);
  
        const response = await api.post("/genres/CreateGenre", formData);
  
        return response.data;
      } catch (error) {
        console.error("CreateGenre error:", error);
  
        throw {
          success: false,
          message: "Không thể tạo genre",
        };
      }
    },
  
    // Cập nhật thông tin genre
    updateGenre: async (genreId: number, formData: FormData) => {
      const response = await api.put(`/genres/UpdateGenre/${genreId}`, formData);
      return response.data;
    },
  
    // api tìm kiếm genre
    searchGenres: async (
      keyword: string,
      page: number = 1,
      pageSize: number = 10,
    ) => {
      const response = await api.get(`/genres/SearchGenres`, {
        params: {
          keyword,
          page,
          pageSize,
        },
      });
      return response.data.data;
    },

    // api xoá genre
    deleteGenre: async (genreId: number) => {
      const response = await api.delete(`/genres/DeleteGenre/${genreId}`, {
        headers: {
          accept: "text/plain",
        },
      });
      return response.data;
    },
};
