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
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={props.handlePrevious}
          disabled={props.currentPage === 1}
          className="btn btn-outline btn-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
      </div>

      <div className="flex items-center space-x-1">
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
                {shouldShowEllipsis && (
                  <span className="px-3 py-2 text-sm text-base-content/70">...</span>
                )}
                <button
                  onClick={() => props.handlePageChange(pageNumber)}
                  className={`btn btn-sm ${
                    props.currentPage === pageNumber
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {pageNumber}
                </button>
              </React.Fragment>
            );
          })}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={props.handleNext}
          disabled={props.currentPage === props.totalPages}
          className="btn btn-outline btn-sm"
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}