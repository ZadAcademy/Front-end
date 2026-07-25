export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-4/3 rounded-xl bg-gray-200" />
      {/* Content placeholder */}
      <div className="flex flex-col gap-3 mt-3">
        <div className="w-24 h-6 rounded-lg bg-gray-200" />
        <div className="w-3/4 h-5 rounded bg-gray-200" />
        <div className="w-full h-12 rounded bg-gray-100" />
        <div className="w-full h-7 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
