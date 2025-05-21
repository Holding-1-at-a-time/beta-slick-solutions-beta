export function LoadingPlaceholder() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-2/3"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  )
}
