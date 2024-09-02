import { useMemo, useCallback, useEffect, useState } from 'react';
import { useTable, usePagination, useSortBy, Column, SortingRule } from 'react-table';
import { AnamnesisFormType } from 'src/types';

// Custom hook for table pagination and sorting
const useTablePagination = <T extends object>(
  columns: Column<T>[],
  data: T[],
) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortingRule<AnamnesisFormType>[]>([]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: tablePage,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage: tableGotoPage,
    nextPage: tableNextPage,
    previousPage: tablePreviousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex: tablePageIndex, pageSize: tablePageSize, sortBy: tableSortBy }
  } = useTable<T>(
    { 
      columns, 
      data, 
      initialState: { pageIndex, pageSize, sortBy }
    }, 
    useSortBy,
    usePagination
  );

  // Handle page size changes
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setTablePageSize(size);
  }, [setPageSize, setTablePageSize]);

  // Handle sort changes
  const handleSortChange = useCallback((sortBy: SortingRule<T>[]) => {
    const normalizedSortBy = sortBy.map(sort => ({
      id: sort.id,
      desc: sort.desc ?? false
    }));
    setSortBy(normalizedSortBy);
  }, [setSortBy]);

  // Handle header click to toggle sorting
  const handleHeaderClick = useCallback((column: { id: string; isSortedDesc?: boolean; toggleSortBy: (desc?: boolean) => void; }) => {
    const isDesc = column.isSortedDesc ?? false;
    handleSortChange([{ id: column.id, desc: !isDesc }]);
    column.toggleSortBy(!isDesc);
  }, [handleSortChange]);

  // Sync local state with table instance state
  useEffect(() => {
    setPageIndex(tablePageIndex);
    setPageSize(tablePageSize);

    const normalizedSortBy = tableSortBy.map(sort => ({
      id: sort.id,
      desc: sort.desc ?? false
    }));
    
    setSortBy(normalizedSortBy);
  }, [tablePageIndex, tablePageSize, tableSortBy, setPageIndex, setPageSize, setSortBy]);

  return useMemo(() => ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    tablePage,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    tableGotoPage,
    tableNextPage,
    tablePreviousPage,
    handlePageSizeChange,
    handleHeaderClick,
    pageIndex,
    pageSize
  }), [
    getTableProps,
    getTableBodyProps,
    headerGroups,
    tablePage,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    tableGotoPage,
    tableNextPage,
    tablePreviousPage,
    handlePageSizeChange,
    handleHeaderClick,
    pageIndex,
    pageSize
  ]);
};

export default useTablePagination;
