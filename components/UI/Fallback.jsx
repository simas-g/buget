'use client'
export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-secondary border-solid"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">Kraunama...</p>
      </div>
    </div>
  );
}
