import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function FileListSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="file-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="grid gap-8">
      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </section>

      <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-sm">
        <Skeleton className="h-8 w-40 mb-6" />
        <FileListSkeleton />
      </section>
    </div>
  )
}
