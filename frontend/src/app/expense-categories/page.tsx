import { auth0 } from "@/app/lib/auth/auth0";
import ExpenseCategories from "../ui/components/expense-categories/ExpenseCategories";

export default async function ExpenseCategoriesPage() {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You must be logged in to view this page.</p>
      </div>
    );
  }
  const isLoggedIn = session != null && session.user != null;
  return (
    <ExpenseCategories isLoggedIn={isLoggedIn} /> 
  );
}