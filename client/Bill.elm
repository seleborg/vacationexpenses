module Bill (Expense, Bill, addExpense) where

{-| Library for Bill object and all its sub-objects.

# Definition
@docs Bill, Expense, addExpense

-}

{-| An Expense is a single record of expense.
-}
type alias Expense =
  { name : String
  }


{-| The Bill holds all the input data from a VacationExpenses bill, but not the results.
-}
type alias Bill =
  { expenses : List Expense
  }


{-| Returns a new bill with the given expense added to it.
-}
addExpense : Bill -> Expense -> Bill
addExpense bill expense =
  { bill | expenses = bill.expenses ++ [expense] }


