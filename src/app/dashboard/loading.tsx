export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-7 w-32 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <div className="h-4 w-20 bg-gray-100 rounded mb-3" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-8">
        <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
        <div className="h-48 bg-gray-50 rounded-xl" />
      </div>

      {/* Reviews skeleton */}
      <div className="h-6 w-28 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
          >
            <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
            <div className="h-3 w-full bg-gray-50 rounded mb-2" />
            <div className="h-3 w-3/4 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
