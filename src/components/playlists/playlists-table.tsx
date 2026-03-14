"use client"

import { useEffect, useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { playlistApi } from "@/lib/api/playlistApi"
import { toast } from "sonner"
import { Playlist } from "@/types/Playlist"
import { PagedResponse } from "@/types/PagedReponse";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

type Props = {
  playlists: PagedResponse<Playlist>;
  onPageChange: (page: number) => void
  onEdit: (playlist: Playlist) => void
  refreshPlaylists: () => void
}

export function PlaylistsTable({ playlists, onPageChange, onEdit, refreshPlaylists }: Props) {

  const { currentPage, totalPages } = playlists;
  
    const [items, setItems] = useState<Playlist[]>(playlists.items);
  
    const [deleteId, setDeleteId] = useState<number | null>(null);
  
    useEffect(() => {
      setItems(playlists.items);
    }, [playlists]);
  
    const confirmDelete = async () => {
      if (!deleteId) return;
  
      try {
        const res = await playlistApi.deletePlaylist(deleteId);
  
        if (res?.success || res?.status === 200) {
          toast.success("Xoá playlist thành công!");
          refreshPlaylists();
  
          // update local table
          setItems((prev) => prev.filter((s) => s.id !== deleteId));
        } else {
          toast.error("Không thể xoá playlist!");
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
                <TableHead>Total Songs</TableHead>
                <TableHead>Total views</TableHead>
                <TableHead>Total Saves</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
  
            <TableBody>
              {items.map((playlist) => (
                <TableRow key={playlist.id}>
                  <TableCell>{playlist.id}</TableCell>
  
                  <TableCell className="font-medium">{playlist.name}</TableCell>
  
                  <TableCell>{playlist.creator}</TableCell>
  
                  <TableCell>{playlist.songCount ?? 0}</TableCell>
  
                  <TableCell>{playlist.totalViews ?? 0}</TableCell>
                  <TableCell>{playlist.saveCount ?? 0}</TableCell>
  
                  <TableCell>
                    {playlist.createdAt
                      ? new Date(playlist.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
  
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(playlist)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
  
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setDeleteId(playlist.id!)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
  
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No playlists found
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
                Bạn có chắc chắn muốn xoá playlist này?
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