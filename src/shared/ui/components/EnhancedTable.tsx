import React, { ReactElement } from 'react'
import { Column, usePagination, useTable } from 'react-table'
import { BackIcon, DoubleBackIcon, DoubleForwardIcon, ForwardIcon } from '../../../routes/assets/PaginationIcon'
import Pagination, { PaginationButton } from '../../../routes/components/Pagination'
interface TableProps<T extends object> {
  columns: Array<Column<T>>
  data: T[]
  onRowClick?: (id: string) => void
  sortIcon: (column: string) => ReactElement
  setSortColumn: (column: string) => void
}

function Table<T extends object> ({ columns, data, sortIcon, setSortColumn, onRowClick = (id: string) => { console.log(id) } }: TableProps<T>): ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    usePagination
  )

  const handleSetPageSize = (page: number): void => {
    setPageSize(page)
  }

  const headStyle = 'text-sm font-medium text-white px-6 py-4 capitalize cursor-pointer'
  const bodyStyle = 'text-sm font-light px-6 py-4 uppercase cursor-pointer text-center'

  const PAGINATION_BUTTONS: PaginationButton[] = [
    {
      disabled: canPreviousPage,
      onClick: () => { gotoPage(0) },
      icon: <DoubleBackIcon className='w-5 h-5' />
    },
    {
      disabled: canPreviousPage,
      onClick: () => { previousPage() },
      icon: <BackIcon className='w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { nextPage() },
      icon: <ForwardIcon className='w-5 h-5' />
    },
    {
      disabled: canNextPage,
      onClick: () => { gotoPage(pageCount - 1) },
      icon: <DoubleForwardIcon className='w-5 h-5' />
    }
  ]

  return (
    <>
      <div className='overflow-x-auto'>
        <div className='inline-block min-w-full'>
          <div className='overflow-hidden'>
            <table {...getTableProps()} className='min-w-full'>
              <thead className='border-b bg-black'>
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <th className={headStyle} {...column.getHeaderProps()} key={index} onClick={() => { setSortColumn(column.id ?? '') }} >
                        <p className='flex items-center justify-center gap-4'>{column.render('Header')} {sortIcon(column.id ?? '')}</p>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row)
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.original['id' as keyof T] as string}
                      className={'bg-white border-b transition duration-300 ease-in-out hover:bg-gray-200'}
                    >
                      {row.cells.map((cell, index) => (
                        <td
                          {...cell.getCellProps()}
                          key={index}
                          className={`${bodyStyle}`}
                          onClick={() => { onRowClick(row.original['id' as keyof T] as string) }}
                        >{cell.render('Cell')} { }</td>
                      ))}

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <Pagination
          buttons={PAGINATION_BUTTONS}
          pageOptions={{ pageIndex, pageSize, length: pageOptions.length, setPageSize: handleSetPageSize }} />
      </div>
    </>
  )
}

export default Table
