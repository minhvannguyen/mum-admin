"use client";

import { useEffect, useState } from "react";

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

import { toast } from "sonner";
import { PagedResponse } from "@/types/PagedReponse";
import { Genre } from "@/types/Genre";
import { genresAPI } from "@/lib/api/genresApi";

type Props = {
  genres: PagedResponse<Genre>;
  onPageChange: (page: number) => void;
  onEdit: (genre: Genre) => void;
  refreshGenres: () => void;
};

export function GenresTable({ genres, onPageChange, onEdit, refreshGenres }: Props) {
  const { currentPage, totalPages } = genres;

  const [items, setItems] = useState<Genre[]>(genres.items);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setItems(genres.items);
  }, [genres]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await genresAPI.deleteGenre(deleteId);

      if (res?.success || res?.status === 200) {
        toast.success("Xoá genre thành công!");
        refreshGenres();
        // update local table
        setItems((prev) => prev.filter((u) => u.id !== deleteId));
      } else {
        toast.error("Không thể xoá genre!");
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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.id}</TableCell>

                <TableCell className="font-medium">{genre.name}</TableCell>

                <TableCell>{genre.slug}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(genre)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(genre.id || 0)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No genres found
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
              Bạn có chắc chắn muốn xoá genre này?
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
