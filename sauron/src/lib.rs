use log::{info, Level};
use sauron::wasm_bindgen_futures;
use sauron::{
  document,
  html::{text, units::px},
  jss, node, wasm_bindgen, Application, Cmd, Node, Program,
};

enum Msg {
  Increment,
  Decrement,
  Reset,
}

struct App {
  count: i32,
}

#[cfg(feature = "wasm")]
impl App {
  fn new() -> Self {
    App { count: 0 }
  }
}

impl Application for App {
  type MSG = Msg;

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
    match msg {
      Msg::Increment => self.count += 1,
      Msg::Decrement => self.count -= 1,
      Msg::Reset => {
        log::info!("resetting count");
        self.count = 0
      }
    }
    Cmd::none()
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
