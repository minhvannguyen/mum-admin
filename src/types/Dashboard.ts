export type DashboardData = {
  totalSongs: number
  totalUsers: number
  totalPlaylists: number
  totalReports: number

  recentSongs: RecentSong[]
  recentUsers: RecentUser[]
}

export type RecentSong = {
  id: number
  title: string
  createdAt: string
}

export type RecentUser = {
  id: number
  email: string
  createdAt: string
}