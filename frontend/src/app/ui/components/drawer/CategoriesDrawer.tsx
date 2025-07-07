'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CategoriesPage from '../categories/CategoriesPage';

interface CategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categoryType: 'Income' | 'Expense' | 'Holding';
  onCategoriesUpdated?: () => void;
}

export default function CategoriesDrawer(props: CategoriesDrawerProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && props.isOpen) {
        handleClose();
      }
    };

    if (props.isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Don't prevent body scroll - let the main page remain visible
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [props.isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      props.onClose();
      setIsClosing(false);
    }, 200); // Match the transition duration
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const getEndpoint = () => {
    switch (props.categoryType) {
      case 'Income':
        return 'CashFlowCategories?cashFlowType=Income';
      case 'Expense':
        return 'CashFlowCategories?cashFlowType=Expense';
      case 'Holding':
        return 'HoldingCategories';
      default:
        return 'CashFlowCategories?cashFlowType=Expense';
    }
  };

  const getCreateUpdateDeleteEndpoint = () => {
    switch (props.categoryType) {
      case 'Income':
      case 'Expense':
        return 'CashFlowCategories';
      case 'Holding':
        return 'HoldingCategories';
      default:
        return 'CashFlowCategories';
    }
  };

  if (!props.isOpen) return null;

  return (
    <>
      {/* Backdrop - blurred main page */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-all duration-200 ${
          isClosing ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-sm'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-base-100 shadow-2xl z-50 transform transition-transform duration-200 ease-in-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300 bg-base-100">
          <h2 className="text-xl font-semibold">
            {props.categoryType} Categories
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <CategoriesPage
              isLoggedIn={true}
              categoryTypeName={props.categoryType}
              getEndpoint={getEndpoint()}
              createUpdateDeletEndpoint={getCreateUpdateDeleteEndpoint()}
              onCategoriesUpdated={props.onCategoriesUpdated}
              disableForm={true}
            />
          </div>
        </div>
      </div>
    </>
  );
} 