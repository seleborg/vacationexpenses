module BillPage where

import Debug
import Html
import Html.Events
import Html.Attributes
import Json.Decode
import List
import Maybe
import StartApp.Simple

import Bill


type alias NewExpense = 
  { name : String 
  }


type alias Model = 
  { bill : Bill.Bill
  , newExpense : NewExpense
  }


type Action = 
  UpdateNewExpenseName String
  | AddExpense


init : Model
init =
  { bill = 
    { expenses = 
      [ { name = "John" }
      , { name = "Jack" }
      ]
    }
  , newExpense = 
    { name = ""
    }
  }


viewExpense : Bill.Expense -> Html.Html
viewExpense expense =
  Html.li [] [ Html.text expense.name ]


view : Signal.Address Action -> Model -> Html.Html
view address model =
  Html.div []
  [ Html.div [] [ Html.ol [] (List.map viewExpense model.bill.expenses) ]
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
    , Html.button [] [Html.text "Add"]]
  ]


update action model =
  case action of
    UpdateNewExpenseName newName ->
      let
        newExpense = model.newExpense
      in
        { model | newExpense = { newExpense | name = newName } }

    AddExpense ->
      { model 
        | bill = Bill.addExpense model.bill { name = model.newExpense.name }
        , newExpense = { name = "" } 
      }


main =
  StartApp.Simple.start { model = init, view = view, update = update }
