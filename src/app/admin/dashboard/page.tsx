"use client"

import { useEffect, useState } from "react"
import { Music, Users, ListMusic, Flag } from "lucide-react"

import { DashboardData, RecentSong, RecentUser } from "@/types/dashboard"
import { dashboard } from "@/lib/api/adminAuthApi"

type Stats = {
  songs: number
  users: number
  playlists: number
  reports: number
}

export default function DashboardPage() {

  const [stats, setStats] = useState<Stats>({
    songs: 0,
    users: 0,
    playlists: 0,
    reports: 0
  })

  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([])
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])

  useEffect(() => {

  const fetchDashboard = async () => {

    try {

      const data = await dashboard()

      setStats({
        songs: data.totalSongs,
        users: data.totalUsers,
        playlists: data.totalPlaylists,
        reports: data.totalReports
      })

      setRecentSongs(data.recentSongs.slice(0,5))
      setRecentUsers(data.recentUsers.slice(0,5))

    } catch (error) {
      console.error("Dashboard load error:", error)
    }

  }

  fetchDashboard()

}, [])

  return (

    <div className="w-full space-y-8">

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Overview of your music platform
        </p>
      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard title="Songs" value={stats.songs} icon={<Music size={20}/>}/>
        <StatCard title="Users" value={stats.users} icon={<Users size={20}/>}/>
        <StatCard title="Playlists" value={stats.playlists} icon={<ListMusic size={20}/>}/>
        <StatCard title="Reports" value={stats.reports} icon={<Flag size={20}/>}/>

      </div>


      {/* TABLES */}

      <div className="grid md:grid-cols-2 gap-6">

        <Box title="Recent Songs">

          {recentSongs.map(song => (

            <div
              key={song.id}
              className="flex justify-between py-2 border-b last:border-none"
            >
              <span className="font-medium">
                {song.title}
              </span>

              <span className="text-gray-500 text-sm">
                {new Date(song.createdAt).toLocaleDateString()}
              </span>

            </div>

          ))}

        </Box>


        <Box title="Recent Users">

          {recentUsers.map(user => (

            <div
              key={user.id}
              className="flex justify-between py-2 border-b last:border-none"
            >
              <span className="font-medium">
                {user.email}
              </span>

              <span className="text-gray-500 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>

            </div>

          ))}

        </Box>

      </div>

    </div>

  )
}



function StatCard({
  title,
  value,
  icon
}:{
  title:string
  value:number
  icon:React.ReactNode
}){

  return(

    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-3">

        <span className="text-sm text-gray-500">
          {title}
        </span>

        {icon}

      </div>

      <p className="text-3xl font-bold">
        {value}
      </p>

    </div>

  )

}


function Box({
  title,
  children
}:{
  title:string
  children:React.ReactNode
}){

  return(

    <div className="bg-white border rounded-xl p-6 shadow-sm">

      <h3 className="font-semibold mb-4">
        {title}
      </h3>

      {children}

    </div>

  )

}