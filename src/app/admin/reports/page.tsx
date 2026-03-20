"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PagedResponse } from "@/types/PagedReponse";
import { Report } from "@/types/Report";
import { reportApi } from "@/lib/api/reportApi";
import { ReportsTable } from "@/components/reports/reports-table";
import UploadReportModal from "@/components/reports/upload-report-modal";

export default function ReportsPage() {
  const [reports, setReports] = useState<PagedResponse<Report> | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState<Report | null>(
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

  const fetchReports = async (page: number) => {
  try {
    let res;

    if (debouncedSearch.trim() !== "") {
      res = await reportApi.searchReports(debouncedSearch, page, 7);
    } else {
      res = await reportApi.getAllReport(page, 7);
    }

    setReports(res);
    setCurrentPage(page);

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadReports = async (page: number) => {
      try {
        let res;

        if (debouncedSearch.trim() !== "") {
          res = await reportApi.searchReports(debouncedSearch, page, 7);
        } else {
          res = await reportApi.getAllReport(page, 7);
        }
        setReports(res);
        setCurrentPage(page);
      } catch (error) {
        console.error(error);
      }
    };

    loadReports(currentPage);
  }, [debouncedSearch, currentPage]);

  // const handleAddReport = () => {
  //   setSelectedReport(null);
  //   setOpenModal(true);
  // };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setOpenModal(true);
  };

  if (!reports) return null;

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý đơn tố cáo</h1>
      </div>

      {/* Search */}

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search report..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }} // reset to page 1 on search
            className="pl-9"
          />
        </div>
        {/* <Button
          className="bg-gray-950 text-white border border-gray-300"
          onClick={() => handleAddReport()}
        >
          + Add Report
        </Button> */}
      </div>

      {/* Table */}

      <ReportsTable
        reports={reports}
        onPageChange={fetchReports}
        onEdit={handleEditReport}
        refreshReports={() => fetchReports(currentPage)}
      />

      {/* EDIT USER MODAL */}

      <UploadReportModal
        report={selectedReport}
        open={openModal}
        onOpenChange={setOpenModal}
        onSuccess={() => fetchReports(currentPage)}
      />
    </div>
  );
}
