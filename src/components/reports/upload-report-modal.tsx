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


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { reportApi } from "@/lib/api/reportApi";
import { Report } from "@/types/Report";

type Props = {
  report?: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function UploadReportModal({
  report,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [Status, setStatus] = useState(report?.status);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus(report?.status)
  }, [open, report]);

  /* =========================
     Submit
  ========================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      /* ===== UPDATE ===== */

      const res = await reportApi.updateReportStatus(report?.id || 0, Status || "Pending");

      if (res?.success || res)
        toast.success("Cập nhật trạng thái báo cáo thành công!");

      onSuccess?.();
      setIsLoading(false);
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
    <DialogContent className="w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Report</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

        <div className="space-y-4">

          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Reporter
            </span>
            <Input value={report?.reporterEmail ?? ""} disabled />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Target
            </span>
            <Input
              value={
                report ? `${report.targetName} (#${report.targetId})` : ""
              }
              disabled
            />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Type
            </span>
            <Input value={report?.targetType ?? ""} disabled />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Reason
            </span>
            <Input value={report?.reason ?? ""} disabled />
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>

            <Select
              value={Status}
              onValueChange={(value) =>
                setStatus(value as "Pending" | "Solved")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Pending">
                  <span className="text-orange-500 font-medium">
                    Pending
                  </span>
                </SelectItem>

                <SelectItem value="Solved">
                  <span className="text-green-600 font-medium">
                    Solved
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>

      </form>
    </DialogContent>
  </Dialog>
);
}
