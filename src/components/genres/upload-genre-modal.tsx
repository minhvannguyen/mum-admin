"use client";

import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Genre, GenreRequest } from "@/types/Genre";
import { genresAPI } from "@/lib/api/genresApi";

type Props = {
  genre?: Genre | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function UploadGenreModal({
  genre,
  open,
  onOpenChange,
  onSuccess,
}: Props) {

  const isEdit = !!genre;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Reset form
  ========================= */

  const resetForm = () => {
    setName("");
    setSlug("");
  };

  /* =========================
     Prefill khi edit
  ========================= */

  useEffect(() => {
    if (!open) return;

    if (genre) {
      setName(genre.name || "");
      setSlug(genre.slug || "");
    } else {
      resetForm();
    }
  }, [open, genre]);

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      if (!genre) {
        /* ===== CREATE ===== */

        const requestData: GenreRequest = {
          name,
          slug
        };

        const res = await genresAPI.createGenre(requestData);

        if (res?.success) toast.success("Upload thành công!");
      } else {
        /* ===== UPDATE ===== */

        const formData = new FormData();

        formData.append("name", name);
        formData.append("slug", slug);

        const res = await genresAPI.updateGenre(genre.id || 0, formData);

        if (res?.success) toast.success("Cập nhật genre thành công!");
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
      <DialogContent className="max-w-52">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa thể loại" : "Thêm thể loại"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          <div className="grid grid-cols-[220px_1fr] gap-6">

            {/* Form */}

            <div className="flex flex-col gap-4">
              <Input
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="new-user"
              />

              <Input
                placeholder="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />

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
        </form>
      </DialogContent>
    </Dialog>
  );
}
