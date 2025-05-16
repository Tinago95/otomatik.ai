export default function LoadingFunctionEdit() {
    return (
        <div>
            {/* Header Skeleton */}
            <div className="mb-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div> {/* Back link */}
                <div className="h-8 bg-gray-300 rounded w-3/5"></div> {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-1"></div> {/* ID */}
            </div>

            {/* Form Skeleton */}
            <div className="space-y-8 animate-pulse">
                {/* Card Skeleton */}
                <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                            <div className="h-9 bg-gray-200 rounded w-full"></div>
                        </div>
                         <div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                            <div className="h-9 bg-gray-200 rounded w-full"></div>
                        </div>
                    </div>
                </div>
                {/* Card Skeleton */}
                <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="h-14 bg-gray-200 rounded"></div>
                        <div className="h-14 bg-gray-200 rounded"></div>
                        <div className="h-14 bg-gray-200 rounded"></div>
                        <div className="h-14 bg-gray-200 rounded"></div>
                    </div>
                </div>
                {/* Card Skeleton (Code Editor) */}
                 <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                 </div>
                 {/* Card Skeleton (Schemas) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
                         <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                         <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                 </div>
                {/* Button Skeleton */}
                 <div className="flex justify-end pt-4">
                     <div className="h-10 bg-gray-300 rounded w-32"></div>
                </div>
            </div>
        </div>
    );
}
