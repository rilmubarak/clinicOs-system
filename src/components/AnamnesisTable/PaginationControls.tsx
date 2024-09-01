interface PaginationControlsProps {
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoPage: (pageIndex: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  pageIndex: number;
  pageOptions: number[];
  pageSize: number;
}

const PaginationControls = ({
  canPreviousPage,
  canNextPage,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageOptions,
  pageSize
}: PaginationControlsProps) => (
  <div className="my-4 flex flex-col sm:flex-row items-center justify-end sm:space-x-4">
    <div className="flex space-x-2 mb-4 sm:mb-0">
      <button
        onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
        className={`px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="First Page"
      >
        {'<<'}
      </button>
      <button
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
        className={`px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Previous Page"
      >
        {'<'}
      </button>
      <button
        onClick={() => nextPage()}
        disabled={!canNextPage}
        className={`px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Next Page"
      >
        {'>'}
      </button>
      <button
        onClick={() => gotoPage(pageOptions.length - 1)}
        disabled={!canNextPage}
        className={`px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Last Page"
      >
        {'>>'}
      </button>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-gray-700">
        Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
      </span>
      <select
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
        className="border border-gray-300 rounded-md p-1 bg-white text-gray-600 cursor-pointer"
        aria-label="Select number of rows per page"
      >
        {[10, 20, 30, 40, 50].map(size => (
          <option key={size} value={size}>Show {size}</option>
        ))}
      </select>
    </div>
  </div>
);

export default PaginationControls;
