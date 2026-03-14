import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            Analytics đang được phát triển
          </h2>

          <p className="text-sm text-muted-foreground max-w-md">
            Chức năng phân tích dữ liệu sẽ được triển khai trong các phiên bản
            tiếp theo. Trang này sẽ cung cấp thống kê về người dùng, lượt nghe,
            bài hát phổ biến và các chỉ số quan trọng của hệ thống.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}