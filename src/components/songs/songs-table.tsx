"use client";

import { useEffect, useState } from "react";
import { GetSongsResponse, SongApiResponse } from "@/types/Song";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { songApi } from "@/lib/api/songApi";
import { toast } from "sonner";

type Props = {
  songs: GetSongsResponse;
  onPageChange: (page: number) => void;
  onEdit: (song: SongApiResponse) => void;
  refreshSongs: () => void;
};

export function SongsTable({ songs, onPageChange, onEdit, refreshSongs }: Props) {
  const { currentPage, totalPages } = songs.data;

  const [items, setItems] = useState<SongApiResponse[]>(songs.data.items);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setItems(songs.data.items);
  }, [songs]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await songApi.deleteSong(deleteId);

      if (res?.success || res?.status === 200) {
        toast.success("Xoá bài hát thành công!");
        refreshSongs();
        // update local table
        setItems((prev) => prev.filter((s) => s.id !== deleteId));
      } else {
        toast.error("Không thể xoá bài hát!");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi xoá!");
    } finally {
      setDeleteId(null);
    }
  };
  

  return (
    <div className="space-y-4">
      <div className="border rounded-xl w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {songs?.data?.items?.map((song) => (
              <TableRow key={song.id}>
                <TableCell>{song.id}</TableCell>

                <TableCell className="font-medium">{song.title}</TableCell>

                <TableCell>{song.artistName}</TableCell>

                <TableCell>{song.genreNames?.join(", ") || "-"}</TableCell>

                <TableCell>{song.views ?? 0}</TableCell>

                <TableCell>
                  {song.uploadedAt
                    ? new Date(song.uploadedAt).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(song)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(song.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {songs?.data?.items?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No songs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} / {totalPages}
        </p>

        <div className="space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}

      <AlertDialog open={deleteId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn xoá bài hát này?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Huỷ
            </AlertDialogCancel>

            <AlertDialogAction onClick={confirmDelete}>Xoá</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
