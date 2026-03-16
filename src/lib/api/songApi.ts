import { CreateSongRequest, GetSongsByIdResponse, GetSongsResponse, SongResponse } from "@/types/Song"
import axios from "axios";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

export const songApi = {
  getSongs: async () => {
    // Implementation for fetching songs
    return []
  },

  createSong: async (data: CreateSongRequest): Promise<SongResponse> => {
    const formData = new FormData();
    formData.append("Title", data.title);
    formData.append("ArtistId", data.artistId.toString());
    formData.append("Private", data.private.toString());
    formData.append("audioFile", data.audioFile);
    formData.append("coverImage", data.coverImage);

    // Append GenreIds (mảng)
    if (data.genreIds && data.genreIds.length > 0) {
      data.genreIds.forEach((genreId) => {
        formData.append("GenreIds", genreId.toString());
      });
    }

    const response = await api.post("/songs/CreateSong", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "text/plain",
      },
    });

    return response.data;
  },

  // api cập nhật bài hát
  updateSong: async (data: FormData): Promise<SongResponse> => {
    const response = await api.put(
      `/songs/UpdateSong/${data.get("songId")}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "text/plain",
        },
      },
    );
    return response.data;
  },

  getNewSongs: async (
    page: number = 1,
    pageSize: number = 10,
  ): Promise<GetSongsResponse> => {
    const response = await api.get("/songs/GetNewSongs", {
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

  // lấy bài hát theo ID
  getSongById: async (songId: number): Promise<GetSongsByIdResponse> => {
    const response = await api.get(`/songs/GetSong/${songId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // api xoá bài hát
  deleteSong: async (songId: number) => {
    const response = await api.delete(`/songs/DeleteSong/${songId}`, {
      headers: {
        accept: "text/plain",
      },
    });
    return response.data;
  },

  // api tìm kiếm bài hát
  searchSongs: async (
    keyword: string,
    page: number = 1,
    pageSize: number = 20,
  ) => {
    const response = await api.get(`/songs/SearchSongs/search`, {
      params: {
        keyword,
        page,
        pageSize,
      },
      
    });
    return response.data;
  },
}