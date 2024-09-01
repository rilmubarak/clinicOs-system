import { useMemo, useCallback, useEffect } from 'react';
import { useTable, usePagination, useSortBy, Column, SortingRule } from 'react-table';

const useTablePagination = <T extends object>(
  columns: Column<T>[],
  data: T[],
  pageIndex: number,
  pageSize: number,
  sortBy: SortingRule<T>[],
  setSortBy: (sortBy: SortingRule<T>[]) => void,
  setPageIndex: (index: number) => void,
  setPageSize: (size: number) => void
) => {
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

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setTablePageSize(size);
  }, [setPageSize, setTablePageSize]);

  const handleSortChange = useCallback((sortBy: SortingRule<T>[]) => {
    const normalizedSortBy = sortBy.map(sort => ({
      id: sort.id,
      desc: sort.desc ?? false
    }));
    setSortBy(normalizedSortBy);
  }, [setSortBy]);

  const handleHeaderClick = useCallback((column: { id: string; isSortedDesc?: boolean; toggleSortBy: (desc?: boolean) => void; }) => {
    const isDesc = column.isSortedDesc ?? false;
    handleSortChange([{ id: column.id, desc: !isDesc }]);
    column.toggleSortBy(!isDesc);
  }, [handleSortChange]);

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
    handleHeaderClick
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
    handleHeaderClick
  ]);
};

export default useTablePagination;
