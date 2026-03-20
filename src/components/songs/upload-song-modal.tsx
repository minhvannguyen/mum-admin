"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { songApi } from "@/lib/api/songApi";
import { genresAPI } from "@/lib/api/genresApi";
import { useAuthContext } from "@/context/authContext";

import { Genre } from "@/types/Genre";
import { SongApiResponse, CreateSongRequest } from "@/types/Song";

import { toast } from "sonner";

type Props = {
  song?: SongApiResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function UploadSongModal({ song, open, onOpenChange, onSuccess }: Props) {
  const { user } = useAuthContext();

  const isEdit = !!song;

  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [genreId, setGenreId] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [genres, setGenres] = useState<Genre[]>([]);

  /* =========================
     Reset form
  ========================= */

  const resetForm = () => {
    setSongTitle("");
    setArtistName("");
    setGenreId("");
    setFile(null);
    setCover(null);
    setAudioPreview(null);
    setCoverPreview(null);
    setIsPublic(true);
  };

  /* =========================
     Prefill khi edit
  ========================= */
  const buildFullUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
  };

  useEffect(() => {
    if (!open) return;

    if (song) {
      setSongTitle(song.title);
      setArtistName(song.artistName);
      setGenreId(song.genreIds?.[0]?.toString() || "");
      setIsPublic(!song.private);
      setAudioPreview(buildFullUrl(song.fileUrl));
      setCoverPreview(buildFullUrl(song.coverUrl));
    } else {
      resetForm();
    }
  }, [open, song]);

  /* =========================
     Fetch genres
  ========================= */

  useEffect(() => {
    if (!open) return;

    const fetchGenres = async () => {
      try {
        const res = await genresAPI.getGenres();
        if (res?.success) setGenres(res.data);
      } catch {
        toast.error("Không tải được genres");
      }
    };

    fetchGenres();
  }, [open]);

  /* =========================
     File handlers
  ========================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setAudioPreview(URL.createObjectURL(selected));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setCover(selected);
    setCoverPreview(URL.createObjectURL(selected));
  };

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsLoading(true);

    try {
      if (!isEdit) {
        /* ===== CREATE ===== */

        if (!file || !cover || !genreId) {
          toast.error("Vui lòng nhập đầy đủ thông tin");
          return;
        }

        const requestData: CreateSongRequest = {
          title: songTitle,
          artistId: 1, 
          artistName,
          private: !isPublic,
          audioFile: file,
          coverImage: cover,
          genreIds: [parseInt(genreId)],
        };

        const res = await songApi.createSong(requestData);

        if (res?.success) toast.success("Upload thành công!");
      } else {
        /* ===== UPDATE ===== */

        const formData = new FormData();

        formData.append("songId", song!.id.toString());
        formData.append("title", songTitle);
        formData.append("artistId", "1"); 
        formData.append("artistName", artistName);
        formData.append("private", (!isPublic).toString());
        formData.append("genreIds", genreId);

        if (file) formData.append("audioFile", file);
        if (cover) formData.append("coverImage", cover);

        const res = await songApi.updateSong(formData);

        if (res?.success) toast.success("Cập nhật bài hát thành công!");
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
      
      <DialogContent className="max-w-xl w-full">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Chỉnh sửa bài hát" : "Thêm bài hát"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-[220px_1fr] gap-6">

            {/* Cover */}

            <div className="flex flex-col items-center gap-3">

              <label
                htmlFor="cover"
                className="relative w-[200px] h-[200px] rounded-xl overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
              >

                {coverPreview ? (
                  <Image
                    src={coverPreview}
                    alt="cover"
                    fill
                    unoptimized
                    className="object-cover"
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

            {/* Form */}

            <div className="flex flex-col gap-4">

              <Input
                placeholder="Song title"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
              />

              <Input
                placeholder="Artist"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />

              <Select value={genreId} onValueChange={setGenreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>

                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input type="file" accept="audio/*" onChange={handleFileChange} />

              <div className="flex items-center justify-between pt-2">

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
                      : "Uploading..."
                    : isEdit
                    ? "Update"
                    : "Upload"}
                </Button>

              </div>

            </div>
          </div>

          {audioPreview && (
            <audio controls className="w-full">
              <source src={audioPreview} />
            </audio>
          )}

        </form>
      </DialogContent>
    </Dialog>
  );
}