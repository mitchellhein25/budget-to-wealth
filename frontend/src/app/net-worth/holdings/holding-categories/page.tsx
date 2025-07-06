import CategoriesPage from '@/app/ui/components/categories/CategoriesPage'

export default function HoldingCategories() {
  return (
    <CategoriesPage 
      isLoggedIn={true} 
      categoryTypeName="Holding"
      getEndpoint="HoldingCategories"
      createUpdateDeletEndpoint="HoldingCategories"
    />
  )
}
