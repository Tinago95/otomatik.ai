// Global loading component for the app
// This will be displayed when navigating between routes or during data fetching

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-indigo-600 rounded-full opacity-75 animate-ping"></div>
          <div className="w-8 h-8 bg-indigo-600 rounded-full absolute top-0 left-0 animate-pulse"></div>
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
