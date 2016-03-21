module Bill
  (Expense, Bill, Balance
  , addExpense, balances, names, makeExpense, newBill
  ) where

{-| Library for Bill object and all its sub-objects.

# Definition
@docs Bill, Expense, Balance, addExpense, balances, names, makeExpense, newBill

-}

import Basics
import Debug
import Dict
import Html
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


type alias Balance =
  { totalPaid : Float
  , totalDue : Float
  , balance : Float
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


balancesForExpense : Expense -> Set.Set String -> List (String, Balance)
balancesForExpense expense names =
  let
    numShares = Basics.toFloat (Set.size names)
  in
    Set.foldl
      (\name list ->
        let
          paid = if name == expense.name then expense.amount else 0
          due = expense.amount / numShares
          balance = paid - due
        in
          (++)
            list
            [ (name
              , { totalPaid = paid
                , totalDue = due
                , balance = balance
                }
              )
            ]
      )
      []
      names


sumBalances : List (String, Balance) -> Dict.Dict String Balance
sumBalances balances =
  List.foldl
    (\ (name, balance) dict ->
      let
        entry =
          Maybe.withDefault
            { totalPaid = 0, totalDue = 0, balance = 0 }
            (Dict.get name dict)
      in
        Dict.insert
          name
          { totalPaid = entry.totalPaid + balance.totalPaid
          , totalDue = entry.totalDue + balance.totalDue
          , balance = entry.balance + balance.balance
          }
          dict)
    Dict.empty
    balances



balances : Bill -> Dict.Dict String Balance
balances bill =
  let
    setOfNames = names bill
  in
    List.map
      (\expense -> balancesForExpense expense setOfNames)
      bill.expenses
    |> List.concat
    |> sumBalances


{-| Returns the set of names of all participants in the bill.
-}
names : Bill -> Set.Set String
names bill =
  List.foldl Set.insert Set.empty (List.map .name bill.expenses)
