"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { toast } from "sonner";
import { UserRequest, User } from "@/types/User";
import { userApi } from "@/lib/api/userApi";

type Props = {
  user?: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function UploadUserModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: Props) {

  const isEdit = !!user;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cover, setCover] = useState<File | null>(null);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [role, setRole] = useState("User");

  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Reset form
  ========================= */

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setCover(null);
    setCoverPreview(null);
    setIsActive(true);
    setRole("User");
  };

  /* =========================
     Prefill khi edit
  ========================= */
  const buildFullUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const baseUrl = "https://localhost:7114";
    return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
  };

  useEffect(() => {
    if (!open) return;

    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setCoverPreview(buildFullUrl(user.avatarUrl || ""));
      setPassword("");
      setIsActive(user.isActive || true);
      setRole(user.role || "User");
    } else {
      resetForm();
    }
  }, [open, user]);

  /* =========================
     File handlers
  ========================= */

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


    try {
      if (!user) {
        /* ===== CREATE ===== */

        const requestData: UserRequest = {
          username,
          email,
          password,
          avatarUrl: cover || undefined,
          isActive,
          role,
        };

        const res = await userApi.createUser(requestData);

        if (res?.success) toast.success("Upload thành công!");
      } else {
        /* ===== UPDATE ===== */

        const formData = new FormData();

        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("isActive", isActive.toString());
        formData.append("role", role);

        if (cover) formData.append("avatar", cover);

        const res = await userApi.updateUser(user!.id, formData);

        if (res?.success) toast.success("Cập nhật người dùng thành công!");
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
          <DialogTitle>{isEdit ? "Edit User" : "Upload User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          <div className="grid grid-cols-[220px_1fr] gap-6">
            {/* Cover */}

            <div className="flex flex-col items-center gap-3">
              <label
                htmlFor="cover"
                className="relative w-50 h-50 rounded-xl overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="new-user"
              />

              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!user} // Không cho edit email khi đang ở chế độ edit
              />

              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
              />

              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Admin">
                    <span className="text-red-500 font-medium">Admin</span>
                  </SelectItem>

                  <SelectItem value="User">
                    <span className="text-blue-500 font-medium">User</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                  <Label>Hoạt động</Label>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
