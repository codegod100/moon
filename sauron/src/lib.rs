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
pub struct Data {
  title: String,
  body: String,
}
enum Msg {
  Increment,
  Decrement,
  Reset,
  FetchData,
  ReceivedData(Data),
  JsonError(serde_json::Error),
  RequestError(TypeError),
}

struct App {
  count: i32,
  title: String,
}

#[cfg(feature = "wasm")]
impl App {
  fn new() -> Self {
    App {
      count: 0,
      title: "fetch data".to_string(),
    }
  }
}

// Import JavaScript's setTimeout function
#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(js_name = setTimeout)]
  fn set_timeout(closure: &Closure<dyn FnMut()>, millis: u32) -> f64;
}

// Sleep function for WebAssembly
#[wasm_bindgen]
pub async fn sleep(millis: u32) {
  let promise = Promise::new(&mut |resolve, _| {
    let closure = Closure::once(move || {
      resolve.call0(&JsValue::undefined()).unwrap();
    });
    set_timeout(&closure, millis);
    closure.forget(); // Prevent the closure from being dropped
  });

  // Await the promise
  wasm_bindgen_futures::JsFuture::from(promise).await.unwrap();
}

fn fetch_data() -> Cmd<Msg> {
  let url = "https://jsonplaceholder.typicode.com/posts/1";
  Cmd::new(async move {
    log::info!("fetching data from: {}", url);
    let msg = match Http::fetch_text(&url).await {
      Ok(v) => match serde_json::from_str(&v) {
        Ok(data1) => {
          log::info!("data1: {:?}", data1);
          sleep(100).await;

          Msg::ReceivedData(data1)
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
impl Application for App {
  type MSG = Msg;

  fn init(&mut self) -> Cmd<Msg> {
    // self.fetch_data()
    Cmd::none()
  }

  fn view(&self) -> Node<Msg> {
    node! {
        <main>
        <input type="button"
            class="inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
            value="+"
            on_click=|_| {
                Msg::Increment
            }
        />
        <button class="count ml-2 mr-2" on_click=|_|{
            Msg::Reset} >
            {text(self.count)}
        </button>

        <button class="count ml-2 mr-2" on_click=|_|{
          Msg::FetchData}>
          {text(self.title.clone())}
        </button>
        <input type="button"
            class="inline-block px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
            value="-"
            on_click=|_| {
                Msg::Decrement
            }
        />
        </main>
    }
  }

  #[cfg(feature = "wasm")]
  fn update(&mut self, msg: Msg) -> Cmd<Msg> {
    match &msg {
      Msg::Increment => self.count += 1,
      Msg::Decrement => self.count -= 1,
      Msg::Reset => {
        log::info!("resetting count");
        self.count = 0;
      }
      Msg::ReceivedData(data) => {
        log::info!("received data: {:?}", data);
        self.title = data.title.clone();
      }

      _ => {}
    };
    if let Msg::FetchData = msg {
      fetch_data()
    } else {
      Cmd::none()
    }
  }
}

#[wasm_bindgen(start)]
pub fn start() {
  console_log::init_with_level(Level::Debug);
  //   let mount = document().query_selector(".foo").ok().flatten().unwrap();
  //   Program::append_to_mount(App::new(), &mount);
}
#[wasm_bindgen]
pub fn mount_component(id: String) {
  info!("mounting component with id: {}", id);
  let mount = document().query_selector(&id).ok().flatten();
  info!("mount: {:?}", mount);
  if mount.is_some() {
    Program::replace_mount(App::new(), &mount.unwrap());
  }
}
