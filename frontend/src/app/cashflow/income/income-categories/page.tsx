import CategoriesPage from '@/app/ui/components/categories/CategoriesPage';

export default function IncomeCategories() {
	return (
		<CategoriesPage 
			isLoggedIn={true} 
			categoryTypeName="Income"
			getEndpoint="CashFlowCategories?cashFlowType=Income"
			createUpdateDeletEndpoint="CashFlowCategories"
		/>
	)	
}
