import CategoriesPage from '@/app/ui/components/categories/CategoriesPage';

export default function ExpenseCategories() {
  return (
    <CategoriesPage 
      isLoggedIn={true} 
      categoryTypeName="Expense"
      getEndpoint="CashFlowCategories?cashFlowType=Expense"
      createUpdateDeletEndpoint="CashFlowCategories"
    />
  )	
}
