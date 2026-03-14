export interface User {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  followers?: number;
  following?: number;
  avatarUrl?: string;
  createdAt?: string;
  isActive?: boolean;
  totalSongs?: number,
  totalPlaylists?: number,
  isFollowing?: boolean,
  bio?: string | null;
  role?: string;
  totalFollowers?: number;
  totalFollowing?: number;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string;
  avatarUrl?: File;
  bio?: string;
  isActive?: boolean;
  role?: string;
}

