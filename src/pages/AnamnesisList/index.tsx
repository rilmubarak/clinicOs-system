import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column } from 'react-table';
import { AnamnesisFormType } from 'src/types';
import Loading from 'src/icons/Loading';
import SortAscIcon from 'src/icons/SortAscIcon';
import SortDescIcon from 'src/icons/SortDescIcon';
import SearchInput from 'src/components/UI/SearchInput';
import TableActions from 'src/components/AnamnesisTable/TableActions';
import PaginationControls from 'src/components/AnamnesisTable/PaginationControls';
import useTablePagination from 'src/hooks/useTablePagination';
import useAnamnesisList from 'src/hooks/useAnamnesisList';
import { formatDate } from 'src/utils/formatDate';

const AnamnesisList = () => {
  const navigate = useNavigate();

  const { data, isLoading, deleteItem, searchTerm, setSearchTerm } = useAnamnesisList();

  const columns: Column<AnamnesisFormType>[] = useMemo(() => [
    { Header: 'Title', accessor: 'title' },
    { Header: 'Description', accessor: 'description' },
    {
      Header: 'Created At',
      accessor: 'createdAt',
      Cell: ({ cell: { value } }) => formatDate(value),
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      disableSortBy: true,
      Cell: ({ row }: { row: { original: AnamnesisFormType } }) => <TableActions original={row.original} deleteItem={deleteItem} />
    }
  ], [deleteItem]);

  const {
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
    pageSize,
  } = useTablePagination(
    columns,
    data
  );

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <SearchInput searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <button
          onClick={() => navigate('/create')}
          className="bg-blue-300 py-2 px-6 rounded-xl text-white hover:bg-blue-400"
        >
          + Add
        </button>
      </div>

      {isLoading && 
        <div className="flex items-center justify-center m-4">
          <Loading />
        </div>
      }
      
      {data.length === 0 && !isLoading && 
        <div className="flex items-center justify-center m-4">
          <p className="text-gray-500">No data found.</p>
        </div>
      }
      
      {data.length > 0 && (
        <div className="overflow-x-auto w-full">
          <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {headerGroups.map((headerGroup, idx) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider" key={idx+1}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-6 py-3 relative"
                      onClick={() => handleHeaderClick(column)}
                      key={column.id}
                    >
                      {column.render('Header')}
                      <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs">
                        {column.id !== 'actions' && (column.isSorted
                          ? column.isSortedDesc
                            ? <SortDescIcon />
                            : <SortAscIcon />
                          : <SortDescIcon />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
              {tablePage.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-100" key={row.id}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" key={cell.column.id}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            gotoPage={tableGotoPage}
            nextPage={tableNextPage}
            previousPage={tablePreviousPage}
            setPageSize={handlePageSizeChange}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default AnamnesisList;
