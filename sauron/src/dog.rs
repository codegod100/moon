use std::thread;
use std::time::Duration;

use log::{info, Level};
use sauron::dom::Http;
use sauron::js_sys::{Promise, TypeError};
use sauron::{
  document,
  html::{text, units::px},
  jss, node, wasm_bindgen, Application, Cmd, Node, Program,
};
use sauron::{wasm_bindgen_futures, Closure, JsValue};
use serde::Deserialize;

#[derive(Deserialize, Debug, PartialEq, Clone, Default)]
pub struct CatData {
  url: String, // url of cat pic
}
pub enum Msg {
  FetchDog,
  JsonError(serde_json::Error),
  RequestError(TypeError),
  Dog(String),
}

pub struct Dog {
  dog_url: String,
}

#[cfg(feature = "wasm")]
impl Dog {
  pub fn new() -> Self {
    Dog {
      dog_url: "".to_string(),
    }
  }
}

// // Import JavaScript's setTimeout function
// #[wasm_bindgen]
// extern "C" {
//   #[wasm_bindgen(js_name = setTimeout)]
//   fn set_timeout(closure: &Closure<dyn FnMut()>, millis: u32) -> f64;
// }

// // Sleep function for WebAssembly
// #[wasm_bindgen]
// pub async fn sleep(millis: u32) {
//   let promise = Promise::new(&mut |resolve, _| {
//     let closure = Closure::once(move || {
//       resolve.call0(&JsValue::undefined()).unwrap();
//     });
//     set_timeout(&closure, millis);
//     closure.forget(); // Prevent the closure from being dropped
//   });

//   // Await the promise
//   wasm_bindgen_futures::JsFuture::from(promise).await.unwrap();
// }

fn fetch_dog() -> Cmd<Msg> {
  let url = "https://dog.ceo/api/breeds/image/random";
  Cmd::new(async move {
    log::info!("fetching data from: {}", url);
    let msg = match Http::fetch_text(&url).await {
      Ok(v) => match serde_json::from_str::<serde_json::Value>(&v) {
        Ok(data1) => {
          log::info!("data1: {:?}", data1);
          // sleep(10).await;
          let src = data1["message"].as_str().unwrap_or_default().to_string();
          // Msg::ReceivedData(data1.into_iter().next().unwrap_or_default())
          Msg::Dog(src)
        }
        Err(err) => {
          log::error!("error: {:?}", err);
          Msg::JsonError(err)
        }
      },
      Err(e) => {
        log::error!("error: {:?}", e);
        Msg::RequestError(e)
      }
    };
    msg
  })
}

impl Application for Dog {
  type MSG = Msg;

  fn init(&mut self) -> Cmd<Msg> {
    Cmd::none()
  }

  fn view(&self) -> Node<Msg> {
    node! {
        <main>

        {if self.dog_url.is_empty() {
            node! {
        <button
            class="count ml-2 mr-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            on_click=|_|{Msg::FetchDog}>
            load dog image
        </button>
            }
        } else {
            node! { <img class="max-w-60 cursor-pointer" src={self.dog_url.clone()} on_click=|_|{Msg::FetchDog}/> }
        }}


        </main>
    }
  }

  #[cfg(feature = "wasm")]
  fn update(&mut self, msg: Msg) -> Cmd<Msg> {
    match &msg {
      Msg::FetchDog => {
        return fetch_dog();
      }

      Msg::Dog(url) => {
        self.dog_url = url.clone();
      }

      _ => {} // some other message I don't want to deal with
    };
    Cmd::none()
  }
}
