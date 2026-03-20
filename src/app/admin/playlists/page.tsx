"use client";

import { useEffect, useState } from "react";
import { PlaylistsTable } from "@/components/playlists/playlists-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { playlistApi } from "@/lib/api/playlistApi";
import { Playlist } from "@/types/Playlist";
import UploadPlaylistModal from "@/components/playlists/upload-playlist-modal";
import { PagedResponse } from "@/types/PagedReponse";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PagedResponse<Playlist> | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================
       Fetch songs
    ========================= */

  const fetchPlaylists = async (page: number) => {
    try {
      let res;

      if (debouncedSearch.trim() !== "") {
        res = await playlistApi.searchPlaylists(debouncedSearch, page, 7);
      } else {
        res = await playlistApi.getPlaylists(page, 7);
      }

      setPlaylists(res);
      setCurrentPage(page);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadPlaylists = async (page: number) => {
      try {
        let res;

        if (debouncedSearch.trim() !== "") {
          res = await playlistApi.searchPlaylists(debouncedSearch, page, 7);
        } else {
          res = await playlistApi.getPlaylists(page, 7);
        }
        setPlaylists(res);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadPlaylists(currentPage);
  }, [debouncedSearch, currentPage]);

  const handleAddPlaylist = () => {
    setSelectedPlaylist(null);
    setOpenModal(true);
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setOpenModal(true);
  };

  if (!playlists) return null;

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Playlists</h1>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search playlist ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} // reset to page 1 on search
            className="pl-9"
          />
        </div>
        <Button
          className="bg-gray-950 text-white border border-gray-300"
          onClick={() => handleAddPlaylist()}
        >
          + Thêm Playlist
        </Button>
      </div>

      {/* Table */}

      <PlaylistsTable
        playlists={playlists}
        onPageChange={fetchPlaylists}
        onEdit={handleEditPlaylist}
        refreshPlaylists={() => fetchPlaylists(currentPage)}
      />

      {/* EDIT SONG MODAL */}

      <UploadPlaylistModal
        playlist={selectedPlaylist}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => fetchPlaylists(currentPage)}
      />
    </div>
  );
}
