interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;

  totalPages: number;
}

const Pagination = ({
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}: PaginationProps) => {

  function handleLimitChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLimit(Number(event.target.value));
    setPage(1);
  }

  return (
    <div className="mt-6 flex items-center justify-between border-t pt-4">

      {/* Previous */}
      <button
        disabled={page === 1}
        onClick={() => setPage(prev => prev - 1)}
        className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>


      {/* Page Info */}
      <div className="text-sm font-medium">
        Page {page} of {totalPages}
      </div>


      {/* Limit + Next */}
      <div className="flex items-center gap-3">

        <label className="text-sm">
          Show
        </label>

        <select
          value={limit}
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
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
          className="rounded-md border px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default Pagination;