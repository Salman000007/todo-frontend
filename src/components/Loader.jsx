export default function Loader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 m-5">
      {/* Shimmer */}
      <div className="bg-gray-100 w-96 shadow-md rounded-lg p-6 flex flex-col space-y-4 border border-gray-200 mb-8 animate-pulse">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>  
          <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>  
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>  
        </div>

        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 rounded w-20"></div> 
          <div className="h-6 bg-gray-300 rounded w-28"></div>  
        </div>

        <div className="flex justify-end space-x-2">
          <div className="h-6 bg-gray-300 rounded w-20"></div>  
          <div className="h-6 bg-gray-300 rounded w-20"></div>  
        </div>
      </div>
    </div>
  );
}
