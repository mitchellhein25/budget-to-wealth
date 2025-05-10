import ExpenseCategoriesList from "@/components/expense-categories/ExpenseCategoriesList";
import { auth0 } from "@/lib/auth0";

export default async function ExpenseCategories() {
  const session = await auth0.getSession();
  return (
    <>
        {session?.user && (
            <div>
                <h1>Expense Categories</h1>
                <ExpenseCategoriesList/>
            </div>
        )}
    </>
  );
}