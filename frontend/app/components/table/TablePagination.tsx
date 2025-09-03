import React from 'react'

type TablePaginationProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
}

export function TablePagination(props: TablePaginationProps) {

  if (props.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <button
          onClick={props.handlePrevious}
          disabled={props.currentPage === 1}
          className="btn btn-outline btn-xs sm:btn-sm"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>
      </div>

      <div className="flex items-center flex-wrap justify-center gap-1 max-w-full overflow-hidden">
        {Array.from({ length: props.totalPages }, (_, i) => i + 1)
          .filter((pageNumber) => {
            if (pageNumber === 1 || pageNumber === props.totalPages) return true;
            if (
              pageNumber >= props.currentPage - 1 &&
              pageNumber <= props.currentPage + 1
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
                  <span className="px-2 py-1 text-xs sm:text-sm text-base-content/70">...</span>
                )}
                <button
                  onClick={() => props.handlePageChange(pageNumber)}
                  className={`btn btn-xs sm:btn-sm min-w-[2rem] ${
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

      <div className="flex items-center">
        <button
          onClick={props.handleNext}
          disabled={props.currentPage === props.totalPages}
          className="btn btn-outline btn-xs sm:btn-sm"
        >
          <span>Next</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}