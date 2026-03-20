"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { userApi } from "@/lib/api/userApi";
import { UsersTable } from "@/components/users/users-table";
import UploadUserModal from "@/components/users/upload-user-modal";
import { PagedResponse } from "@/types/PagedReponse";

export default function UsersPage() {
  const [users, setUsers] = useState<PagedResponse<User> | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(
    null,
  );

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================
     Fetch songs
  ========================= */

  const fetchUsers = async (page: number) => {
  try {
    let res;

    if (debouncedSearch.trim() !== "") {
      res = await userApi.searchUsers(debouncedSearch, page, 7);
    } else {
      res = await userApi.getUsers(page, 7);
    }

    setUsers(res);
    setCurrentPage(page);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadUsers = async (page: number) => {
      try {
        let res;

        if (debouncedSearch.trim() !== "") {
          res = await userApi.searchUsers(debouncedSearch, page, 7);
        } else {
          res = await userApi.getUsers(page, 7);
        }
        setUsers(res);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers(currentPage);
  }, [debouncedSearch, currentPage]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  if (!users) return null;

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search user..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} // reset to page 1 on search
            className="pl-9"
          />
        </div>
        <Button
          className="bg-gray-950 text-white border border-gray-300"
          onClick={() => handleAddUser()}
        >
          + Thêm người dùng
        </Button>
      </div>

      {/* Table */}

      <UsersTable
        users={users}
        onPageChange={fetchUsers}
        onEdit={handleEditUser}
        refreshUsers={() => fetchUsers(currentPage)}
      />

      {/* EDIT USER MODAL */}

      <UploadUserModal
        user={selectedUser}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => fetchUsers(currentPage)}
      />
    </div>
  );
}
