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
import { Report } from "@/types/Report";
import { reportApi } from "@/lib/api/reportApi";
import { PagedResponse } from "@/types/PagedReponse";

type Props = {
  reports: PagedResponse<Report>;
  onPageChange: (page: number) => void;
  onEdit: (report: Report) => void;
  refreshReports: () => void;
};

export function ReportsTable({ reports, onPageChange, onEdit, refreshReports }: Props) {
  const { currentPage, totalPages } = reports;

  const [items, setItems] = useState<Report[]>(reports.items);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setItems(reports.items);
  }, [reports]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await reportApi.deleteReport(deleteId);

      if (res?.success || res?.status === 200) {
        toast.success("Xoá báo cáo thành công!");
        refreshReports();
        // update local table
        setItems((prev) => prev.filter((u) => u.id !== deleteId));
      } else {
        toast.error("Không thể xoá báo cáo!");
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
              <TableHead>Reporter email</TableHead>
              <TableHead>Target name</TableHead>
              <TableHead>Target type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((Report) => (
              <TableRow key={Report.id}>
                <TableCell>{Report.id}</TableCell>

                <TableCell className="font-medium">{Report.reporterEmail}</TableCell>

                <TableCell>{Report.targetName}</TableCell>

                <TableCell>{Report.targetType}</TableCell>

                <TableCell>{Report.reason}</TableCell>

                <TableCell>{Report.status}</TableCell>

                <TableCell>
                  {Report.createdAt
                    ? new Date(Report.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(Report)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(Report.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No Reports found
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
              Bạn có chắc chắn muốn xoá báo cáo này?
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
