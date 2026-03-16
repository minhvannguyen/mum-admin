import { CreatePlaylistRequest, UpdatePlaylistRequest } from "@/types/Playlist";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export const playlistApi = {
  getPlaylists: async (page: number = 1,
    pageSize: number = 10,) => {
    const response = await api.get("/playlists/GetAll", {
      params: {
        pageNumber: page,
        pageSize,
      },

      headers: {
        accept: "text/plain",
      },
    });
    return response.data.data;

  },

  // Tạo playlist mới
  createPlaylist: async (data: CreatePlaylistRequest) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("IsPublic", data.isPublic ? "true" : "false");

    if (data.UserId) {
      formData.append("UserId", String(data.UserId));
    }

    if (data.coverImage) {
      formData.append("CoverImage", data.coverImage);
    }

    try {
      // Ghi chú: override header để browser/axios đính kèm boundary đúng
      const response = await api.post("/playlists/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "text/plain",
        },
      });
      return response.data; // Giữ nguyên để UI xử lý
    } catch (error: unknown) {
      console.error("CreatePlaylist error:", error);
      throw { success: false, message: "Lỗi khi tạo playlist" };
    }
  },

  // Cập nhật playlist
  updatePlaylist: async (data: UpdatePlaylistRequest) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("IsPublic", data.isPublic ? "true" : "false");

    if (data.coverImage) {
      formData.append("CoverImage", data.coverImage);
    }
    const response = await api.put(`/playlists/Update/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Thêm function mới để lấy playlist theo người dùng
  getPlaylistsByUser: async (userId: number) => {
    const response = await api.get(`/playlists/GetByUserId/${userId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // Thêm function mới để xóa playlist
  deletePlaylist: async (playlistId: number) => {
    const response = await api.delete(`/playlists/Delete/${playlistId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // Thêm function mới để thêm bài hát vào playlist
  addSongToPlaylist: async (playlistId: number, songId: number) => {
    const response = await api.post(`/playlists/AddSong`, {
      playlistId,
      songId,
    });
    return response.data;
  },

  // Thêm function mới để xóa bài hát khỏi playlist
  removeSongFromPlaylist: async (playlistId: number, songId: number) => {
    const response = await api.delete(`/playlists/RemoveSong`, {
      data: {
        playlistId,
        songId,
      },
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },

  // api lấy danh sách bài hát trong playlist
  getSongsInPlaylist: async (playlistId: number) => {
    const response = await api.get(`/playlists/GetSongs/${playlistId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // Lấy playlist theo ID
  getById: async (playlistId: number) => {
    const response = await api.get(`/playlists/GetById/${playlistId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // lấy top playlists
  getTopPlaylists: async (page: number = 1, pageSize: number = 20) => {
    const response = await api.get(`/playlists/GetTopPlaylists/top`, {
      params: {
        page,
        pageSize,
      },
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // api lưu playlist
  toggleSavePlaylist: async (playlistId: number) => {
    const response = await api.post(
      `/saved-playlists/ToggleSave/${playlistId}`,
      {
        headers: {
          accept: "text/plain",
        },
      },
    );
    return response.data;
  },

  // kiểm tra xem playlist đã được lưu chưa
  isPlaylistSaved: async (playlistId: number) => {
    const response = await api.get(`/saved-playlists/IsSaved/${playlistId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // api lấy về các playlist đã lưu của user
  getSavedPlaylists: async () => {
    const response = await api.get(`/saved-playlists/GetMySavedPlaylists`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // api tăng lượt nghe
  incrementView: async (playlistId: number) => {
    const response = await api.post(
      `/playlists/IncrementView?playlistId=${playlistId}`,
    );
    return response.data;
  },

  // api tìm kiếm playlist
  searchPlaylists: async (
    keyword: string,
    page: number = 1,
    pageSize: number = 10,
  ) => {
    const response = await api.get(`/playlists/SearchByName`, {
      params: {
        keyword,
        page,
        pageSize,
      },
      headers: {
        accept: "text/plain",
      },
    });
    return response.data.data;
  },
}