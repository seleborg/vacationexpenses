module Bill (Expense, Bill, addExpense, makeExpense, names, newBill) where

{-| Library for Bill object and all its sub-objects.

# Definition
@docs Bill, Expense, addExpense, makeExpense, names, newBill

-}

import Set


{-| An Expense is a single record of expense.
-}
type alias Expense =
  { name : String
  , amount : Float
  }


{-| The Bill holds all the input data from a VacationExpenses bill, but not the results.
-}
type alias Bill =
  { expenses : List Expense
  }


{-| Returns a new bill with the given expense added to it.
-}
addExpense : Expense -> Bill -> Bill
addExpense expense bill =
  { bill | expenses = bill.expenses ++ [expense] }


makeExpense : String -> Float -> Expense
makeExpense name amount =
    { name = name, amount = amount }


newBill : Bill
newBill =
  { expenses = []
  }


{-| Returns the set of names of all participants in the bill.
-}
names : Bill -> Set.Set String
names bill =
  List.foldl Set.insert Set.empty (List.map .name bill.expenses)
