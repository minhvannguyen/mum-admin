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
import { User } from "@/types/User";
import { userApi } from "@/lib/api/userApi";
import { PagedResponse } from "@/types/PagedReponse";

type Props = {
  users: PagedResponse<User>;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  refreshUsers: () => void;
};

export function UsersTable({ users, onPageChange, onEdit, refreshUsers }: Props) {
  const { currentPage, totalPages } = users;

  const [items, setItems] = useState<User[]>(users.items);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setItems(users.items);
  }, [users]);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await userApi.deleteUser(deleteId);

      if (res?.success || res?.status === 200) {
        toast.success("Xoá người dùng thành công!");
        refreshUsers();
        // update local table
        setItems((prev) => prev.filter((u) => u.id !== deleteId));
      } else {
        toast.error("Không thể xoá người dùng!");
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
              <TableHead>User name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>IsActive</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>

                <TableCell className="font-medium">{user.username}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.role}</TableCell>

                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>{user.isActive ? "Yes" : "No"}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(user.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No users found
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
              Bạn có chắc chắn muốn xoá người dùng này?
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
