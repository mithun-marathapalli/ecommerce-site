export default function ProductDetailsLoader() {
    return (
        <div className="flex gap-6 mt-20 ml-40">
            <div className="w-[500px] h-[500px] p-4  rounded-lg animate-pulse bg-white">
                <div className="w-full h-[320px] bg-gray-300 rounded-md"></div>
            </div>
            <div className="w-[500px] h-[500px] p-4  rounded-lg animate-pulse bg-white">
                <div className="mt-4 space-y-3">
                    <div className="h-8 bg-gray-300 rounded"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/3 mt-20"></div>
                </div>
            </div>
        </div>
    )
}
