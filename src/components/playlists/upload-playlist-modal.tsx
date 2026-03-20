"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { useAuthContext } from "@/context/authContext";
import { playlistApi } from "@/lib/api/playlistApi";

import { Playlist } from "@/types/Playlist";

type Props = {
  playlist?: Playlist | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function UploadPlaylistModal({
  playlist,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { user } = useAuthContext();

  const isEdit = !!playlist;

  const [playlistName, setPlaylistName] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Reset form
  ========================= */

  const resetForm = () => {
    setPlaylistName("");
    setCover(null);
    setCoverPreview(null);
    setIsPublic(true);
  };

  /* =========================
     Build full url
  ========================= */

  const buildFullUrl = (path: string): string => {
    if (!path) return "";

    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    return path.startsWith("/")
      ? `${baseUrl}${path}`
      : `${baseUrl}/${path}`;
  };

  /* =========================
     Prefill khi edit
  ========================= */

  useEffect(() => {
    if (!open) return;

    if (playlist) {
      setPlaylistName(playlist.name || "");
      setCoverPreview(buildFullUrl(playlist.coverUrl || ""));
      setIsPublic(playlist.isPublic ?? true);
    } else {
      resetForm();
    }
  }, [open, playlist]);

  /* =========================
     Handle cover
  ========================= */

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!validTypes.includes(selected.type)) {
      toast.error("Ảnh chỉ chấp nhận JPG, PNG hoặc WEBP");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Ảnh phải nhỏ hơn 5MB");
      return;
    }

    setCover(selected);
    setCoverPreview(URL.createObjectURL(selected));
  };

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!playlistName.trim()) {
      toast.error("Vui lòng nhập tên playlist");
      return;
    }

    setIsLoading(true);

    try {
      if (!isEdit) {
        /* ===== CREATE ===== */

        const data = {
          name: playlistName.trim(),
          UserId: 1,
          isPublic,
          coverImage: cover || undefined,
        };

        const res = await playlistApi.createPlaylist(data);

        if (res?.success) {
          toast.success("Tạo playlist thành công!");
        }
      } else {
        /* ===== UPDATE ===== */

        const data = {
          id: playlist.id || 0,
          name: playlistName.trim(),
          isPublic,
          coverImage: cover || undefined,
        };

        const res = await playlistApi.updatePlaylist(data);

        if (res.status === 200 || res?.success) {
          toast.success("Cập nhật playlist thành công!");
        }
      }

      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">

        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa Playlist" : "Thêm Playlist"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Cover */}

          <div className="flex flex-col items-center gap-3">

            <label
              htmlFor="cover"
              className="relative w-[200px] h-[200px] rounded-xl overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
            >
              {coverPreview ? (
                <img
                  src={coverPreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Chọn ảnh bìa
                </span>
              )}
            </label>

            <Input
              id="cover"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />

          </div>

          {/* Playlist name */}

          <Input
            placeholder="Playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />

          {/* Public switch */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label>Công khai</Label>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Create"}
            </Button>

          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}