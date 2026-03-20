"use client";

import { useEffect, useState } from "react";
import { SongsTable } from "@/components/songs/songs-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { songApi } from "@/lib/api/songApi";
import UploadSongModal from "@/components/songs/upload-song-modal";

import { GetSongsResponse, SongApiResponse } from "@/types/Song";
import { Button } from "@/components/ui/button";

export default function SongsPage() {
  const [songs, setSongs] = useState<GetSongsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [selectedSong, setSelectedSong] = useState<SongApiResponse | null>(
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

  const fetchSongs = async (page: number) => {
  try {
    let res;

    if (debouncedSearch.trim() !== "") {
      res = await songApi.searchSongs(debouncedSearch, page, 7);
    } else {
      res = await songApi.getNewSongs(page, 7);
    }

    setSongs(res);
    setCurrentPage(page);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadSongs = async (page: number) => {
      try {
        let res;

        if (debouncedSearch.trim() !== "") {
          res = await songApi.searchSongs(debouncedSearch, page, 7);
        } else {
          res = await songApi.getNewSongs(page, 7);
        }
        setSongs(res);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadSongs(currentPage);
  }, [debouncedSearch, currentPage]);

  const handleAddSong = () => {
    setSelectedSong(null);
    setOpenModal(true);
  };

  const handleEditSong = (song: SongApiResponse) => {
    setSelectedSong(song);
    setOpenModal(true);
  };

  if (!songs) return null;

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý bài hát</h1>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search song..."
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
          onClick={() => handleAddSong()}
        >
          + Thêm bài hát
        </Button>
      </div>

      {/* Table */}

      <SongsTable
        songs={songs}
        onPageChange={fetchSongs}
        onEdit={handleEditSong}
        refreshSongs={() => fetchSongs(currentPage)}
      />

      {/* EDIT SONG MODAL */}

      <UploadSongModal
        song={selectedSong}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => fetchSongs(currentPage)}
      />
    </div>
  );
}
