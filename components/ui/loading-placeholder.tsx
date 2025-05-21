export function LoadingPlaceholder() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-4 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="overflow-x-auto">
          <div className="h-40 bg-gray-200 animate-pulse rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}
