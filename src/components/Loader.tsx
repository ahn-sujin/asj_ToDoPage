export default function Loader() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="ml-2 text-gray-500">로딩 중...</span>
    </div>
  );
}
