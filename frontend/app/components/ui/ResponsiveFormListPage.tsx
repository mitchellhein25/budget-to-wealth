import React from 'react'
import { MobileState, mobileStateIsMediumOrLarge, mobileStateIsSmallOrSmaller, useMobileDetection, useSidebarDetection } from '@/app/hooks';

interface ResponsiveFormListPageProps {
  sideBar: React.ReactNode;
  totalDisplay: React.ReactNode;
  datePicker: React.ReactNode;
  showTotalAndDatePicker?: boolean;
  form: React.ReactNode;
  list: React.ReactNode;
}

export function ResponsiveFormListPage(props: ResponsiveFormListPageProps) {
  const mobileState = useMobileDetection();
  const showSidebar = useSidebarDetection();
  const showTotalAndDatePicker = props.showTotalAndDatePicker ?? true;
  
  return (
    <div className="page-layout">
      {showSidebar && props.sideBar}
      <div className="flex flex-1 gap-3 sm:gap-6">
        {mobileStateIsSmallOrSmaller(mobileState) ? (
          <div className="flex-1 flex flex-col gap-3 sm:gap-6">
            <div className="w-full flex justify-center">
              {props.form}
            </div>
            
            {showTotalAndDatePicker && 
              (mobileState === MobileState.XSMALL ? (
                <div className={`flex gap-3 sm:gap-4 flex-col`}>
                  <div className="flex justify-center">
                    {props.totalDisplay}
                  </div>
                  <div className="w-full flex justify-center">
                    {props.datePicker}
                  </div>
                </div>
              ) : (
                <div className={`flex gap-3 sm:gap-4 justify-center items-center`}>
                  <div className="w-full flex justify-center">
                    {props.datePicker}
                  </div>
                  <div className="flex justify-center">
                    {props.totalDisplay}
                  </div>
                </div>
              ))
            }
            
            <div className="flex-1">
              {props.list}
            </div>
          </div>
        ) : mobileStateIsMediumOrLarge(mobileState) ? (
          <div className="flex-1 flex flex-col gap-3 sm:gap-6 justify-center items-center">
            
            <div className="flex gap-3 sm:gap-4 justify-center items-center w-full">
              <div className="w-full">
                {props.form}
              </div>
              
              {showTotalAndDatePicker && 
                <div className="flex flex-col gap-3 sm:gap-4 w-full h-full justify-between">
                  <div className="flex-1"></div>
                  <div className="flex justify-center">
                      <div className="h-1/3">
                        {props.totalDisplay}
                      </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="w-full">
                    {props.datePicker}
                  </div>
                </div>
              }
            </div>
            
            <div className="flex-1 w-full">
              {props.list}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0">
              {props.form}
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:gap-4">
              {showTotalAndDatePicker && (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {props.datePicker}
                  </div>
                  <div className="flex-1 flex justify-center w-2/3">
                    {props.totalDisplay}
                  </div>
                </div>
              )}
              {props.list}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
