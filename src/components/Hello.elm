module Hello exposing (main)

import Browser
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (on, onClick)
import Http
import Json.Decode exposing (Decoder, field, string)


fetchData =
    Http.get { url = "https://jsonplaceholder.typicode.com/posts/1", expect = Http.expectJson FetchDataSuccess dataDeocder }


dataDeocder =
    field "message" string


type Msg
    = FetchData
    | FetchDataSuccess String
    | FetchDataError Http.Error


update msg model =
    case msg of
        FetchData ->
            ( model, fetchData )

        FetchDataSuccess newMessage ->
            ( { model | message = newMessage }, Cmd.none )

        FetchDataError _ ->
            ( { model | message = "Failed to load data" }, Cmd.none )


view model =
    div [ class "flex ", onClick FetchData ] [ text "Hello, World!" ]


init =
    { mesage = "loading" }


main =
    Browser.sandbox { init = init, update = update, view = view }
