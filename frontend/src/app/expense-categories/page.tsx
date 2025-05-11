import ExpenseCategoriesForm from "@/app/ui/components/expense-categories/ExpenseCategoriesForm";
import ExpenseCategoriesList from "@/app/ui/components/expense-categories/ExpenseCategoriesList";
import { auth0 } from "@/app/lib/auth/auth0";

export default async function ExpenseCategories() {
  const session = await auth0.getSession();
  return (
    <>
        {session?.user && (
            <div>
                <ExpenseCategoriesList/>
                <ExpenseCategoriesForm/>
            </div>
        )}
    </>
  );
}