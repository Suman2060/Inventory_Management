import type React from "react";
import type { IRequestParams } from "../types/products";

interface PaginationProps {
requestParams:IRequestParams
setRequestParams:React.Dispatch<React.SetStateAction<IRequestParams>>
totalPages:number
}

const Pagination = ({
 requestParams,setRequestParams,totalPages

}: PaginationProps) => {

  function handleLimitChange(event: React.ChangeEvent<HTMLSelectElement>) {
    // setLimit(Number(event.target.value));
    // setPage(1);
       setRequestParams((prev)=> {
        return{
            ...prev,
            limit:Number(event.target.value),
            page:1,
        }
    })
  }

  return (
    <div className="mt-6 flex items-center justify-between border-t pt-4">

      
      <button
        disabled={requestParams.page === 1}
        onClick={() =>
          setRequestParams((prev) => ({
            ...prev,
            page: (prev.page ?? 1) - 1,
          }))
        }
        className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>


      {/* Page Info */}
      <div className="text-sm font-medium">
        Page {requestParams.page} of {totalPages}
      </div>


      {/* Limit + Next */}
      <div className="flex items-center gap-3">

        <label className="text-sm">
          Show
        </label>

        <select
          value={requestParams.limit}
          onChange={handleLimitChange}
          className="rounded-md border px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </select>


        <button
          disabled={requestParams.page === totalPages}
          onClick={() =>
            setRequestParams((prev) => ({
              ...prev,
              page: (prev.page ?? 1) + 1,
            }))
          }
          className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Pagination;