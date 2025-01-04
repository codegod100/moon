mod utils;

use std::rc::Rc;

use log::{info, Level};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{RequestInit, RequestMode};
use yew::prelude::*;
use yewdux::{dispatch, prelude::*};

#[derive(Default, Clone, PartialEq, Store)]
struct State {
  cat_url: String,
}

#[derive(Debug, Default, Clone, PartialEq, serde::Deserialize, Store)]
struct Cat {
  url: String,
}

async fn fetch_cat() -> Result<Cat, JsValue> {
  let res = fetch_data("https://api.thecatapi.com/v1/images/search").await?;
  info!("res: {:#?}", res);
  let cat: Vec<Cat> =
    serde_json::from_str(&res.as_string().unwrap()).expect("JSON parse error");
  Ok(cat.first().expect("No cat found").clone())
}

#[function_component]
pub fn App() -> Html {
  /// Dispatches a global instance of `Cat`.
  ///
  /// This function is only valid for the `wasm32` target architecture.
  #[cfg(target_arch = "wasm32")]
  let d = Dispatch::<Cat>::global();
  println!("d: {:#?}", d);
  let onclick = {
    move |_| {
      let future = async move {
        let cat = fetch_cat().await.expect("fetch_cat failed");
        d.set(cat);
      };
    }
  };

  html! {
      <div>
          <button {onclick}>{ "+1" }</button>
        <img src={d.get().url} />

      </div>
  }
}
pub async fn fetch_data(url: &str) -> Result<JsValue, JsValue> {
  // Set up the request options
  let opts = RequestInit::new();
  opts.set_method("GET");
  opts.set_mode(RequestMode::Cors);

  // Fetch the URL with the options
  let window = web_sys::window().unwrap();
  let resp_value =
    JsFuture::from(window.fetch_with_str_and_init(&url, &opts)).await?;

  // Convert the response to a Response object
  let resp: web_sys::Response = resp_value.dyn_into()?;

  // Get the response body as text
  let text = JsFuture::from(resp.text()?).await?;

  Ok(text)
}

#[wasm_bindgen]
extern "C" {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
  alert("Hello, yew!");
}

#[wasm_bindgen(start)]
pub fn start() {
  console_error_panic_hook::set_once();
  let _ = console_log::init_with_level(Level::Debug);
}

#[wasm_bindgen]
pub fn mount_app(selector: &str) {
  info!("mounting app; selector: {:#?}", selector);
  let mount = web_sys::window()
    .expect("no window")
    .document()
    .expect("no document")
    .query_selector(selector)
    .expect("query_selector failed")
    .expect(&format!("no element with selector: {}", selector));
  info!("mounted");
  yew::Renderer::<App>::with_root(mount).render();
}
