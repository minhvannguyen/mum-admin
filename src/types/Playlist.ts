
export interface Playlist{
  id?: number;
  name?: string;
  userId?: number;
  creator?: string;
  coverUrl?: string | null;
  totalViews?: number;
  songCount?: number;
  saveCount?: number;
  isPublic?: boolean;
  isSaved?: boolean; // Trạng thái đã lưu hay chưa
  createdAt?: string;
}

// Request types cho playlist API create
export interface CreatePlaylistRequest {
  name: string;
  UserId: number;
  isPublic: boolean;
  coverImage?: File;
}

//Request types cho playlist API update
export interface UpdatePlaylistRequest {
  id: number;
  name: string;
  isPublic: boolean;
  coverImage?: File;
}