import React from 'react'

type TablePaginationProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export default function TablePagination(props: TablePaginationProps) {

  if (props.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={props.handlePrevious}
        disabled={props.currentPage === 1}
        className="btn btn-outline"
      >
        Previous
      </button>

      <div className="flex space-x-1">
        {Array.from({ length: props.totalPages }, (_, i) => i + 1)
          .filter((pageNumber) => {
            if (pageNumber === 1 || pageNumber === props.totalPages) return true;
            if (
              pageNumber >= props.currentPage - 2 &&
              pageNumber <= props.currentPage + 2
            )
              return true;
            return false;
          })
          .map((pageNumber, index, filteredPages) => {
            const prevPage = filteredPages[index - 1];
            const shouldShowEllipsis = prevPage && pageNumber !== prevPage + 1;

            return (
              <React.Fragment key={pageNumber}>
                {shouldShowEllipsis && <span className="px-2">...</span>}
                <button
                  onClick={() => props.handlePageChange(pageNumber)}
                  className={`btn btn-square ${props.currentPage === pageNumber ? 'btn-primary' : 'btn-outline'
                    }`}
                >
                  {pageNumber}
                </button>
              </React.Fragment>
            );
          })}
      </div>

      <button
        onClick={props.handleNext}
        disabled={props.currentPage === props.totalPages}
        className="btn btn-outline"
      >
        Next
      </button>
    </div>
  )
}