module BillPage where

import Debug
import Dict
import Html
import Html.Events
import Html.Attributes
import Json.Decode
import List
import Maybe
import Set
import StartApp.Simple
import String

import Bill


type alias NewExpense =
  { name : String
  , amount : String
  }


type alias Model =
  { bill : Bill.Bill
  , newExpense : NewExpense
  }


type Action =
  UpdateNewExpenseName String
  | UpdateNewExpenseAmount String
  | AddExpense


init : Model
init =
  { bill =
    Bill.newBill
    |> Bill.addExpense (Bill.makeExpense "John" 50)
    |> Bill.addExpense (Bill.makeExpense "Jack" 10)
  , newExpense =
    { name = ""
    , amount = ""
    }
  }


viewExpense : Bill.Expense -> Html.Html
viewExpense expense =
  Html.li
    []
    [ Html.text
      (expense.name ++ " spent " ++ (Basics.toString expense.amount)) ]


view : Signal.Address Action -> Model -> Html.Html
view address model =
  Html.div []
  [ Html.h1 [] [Html.text "Expenses"]
  , Html.div [] [ Html.ol [] (List.map viewExpense model.bill.expenses) ]
  , Html.form
    [ Html.Events.onWithOptions
        "submit"
        { stopPropagation = False, preventDefault = True}
        (Json.Decode.succeed Maybe.Nothing)
        (\_ -> (Signal.message address AddExpense))
    ]
    [ Html.input
      [ Html.Attributes.value model.newExpense.name
      , Html.Events.on
        "input"
        Html.Events.targetValue
        (\value -> (Signal.message address (UpdateNewExpenseName value)))
      ]
      []
    , Html.input [
        Html.Attributes.value model.newExpense.amount
      , Html.Events.on
        "input"
        Html.Events.targetValue
        (\value -> (Signal.message address (UpdateNewExpenseAmount value)))
      ]
      []
    , Html.button [] [Html.text "Add"]]
  , Html.div []
    [ Html.h1 [] [Html.text "Participants"]
    , Html.ul
        []
        (Bill.balances model.bill
        |> Dict.toList
        |> List.map
          (\(name, balance) ->
            Html.li []
            [Html.text (name ++ (Basics.toString balance))]))
    ]
  ]


update : Action -> Model -> Model
update action model =
  case action of
    UpdateNewExpenseName newName ->
      let
        newExpense = model.newExpense
      in
        { model | newExpense = { newExpense | name = newName } }

    UpdateNewExpenseAmount newAmount ->
      let
        newExpense = model.newExpense
      in
        { model | newExpense = { newExpense | amount = newAmount } }

    AddExpense ->
      let
        name = model.newExpense.name
        amount = Result.withDefault 0 (String.toFloat model.newExpense.amount)
        newExpense = { name = name, amount = amount }
      in
        { model
          | bill = (Bill.addExpense newExpense model.bill)
          , newExpense = { name = "", amount = "" }
        }


main =
  StartApp.Simple.start { model = init, view = view, update = update }
