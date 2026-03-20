"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PagedResponse } from "@/types/PagedReponse";
import { Genre } from "@/types/Genre";
import { genresAPI } from "@/lib/api/genresApi";
import { GenresTable } from "@/components/genres/genres-table";
import UploadGenreModal from "@/components/genres/upload-genre-modal";

export default function GenresPage() {
  const [genres, setGenres] = useState<PagedResponse<Genre> | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(
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

  const fetchGenres = async (page: number) => {
  try {
    let res;

    if (debouncedSearch.trim() !== "") {
      res = await genresAPI.searchGenres(debouncedSearch, page, 7);
    } else {
      res = await genresAPI.getAllGenres(page, 7);
    }

    setGenres(res);
    setCurrentPage(page);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadGenres = async (page: number) => {
      try {
        let res;

        if (debouncedSearch.trim() !== "") {
          res = await genresAPI.searchGenres(debouncedSearch, page, 7);
        } else {
          res = await genresAPI.getAllGenres(page, 7);
        }
        setGenres(res);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadGenres(currentPage);
  }, [debouncedSearch, currentPage]);

  const handleAddGenre = () => {
    setSelectedGenre(null);
    setOpenModal(true);
  };

  const handleEditGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setOpenModal(true);
  };

  if (!genres) return null;

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý thể loại bài hát</h1>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search genre..."
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
          onClick={() => handleAddGenre()}
        >
          + Thêm thể loại
        </Button>
      </div>

      {/* Table */}

      <GenresTable
        genres={genres}
        onPageChange={fetchGenres}
        onEdit={handleEditGenre}
        refreshGenres={() => fetchGenres(currentPage)}
      />

      {/* EDIT GENRE MODAL */}

      <UploadGenreModal
        genre={selectedGenre}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => fetchGenres(currentPage)}
      />
    </div>
  );
}
