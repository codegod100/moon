use cat::Cat;
use dog::Dog;
use log::{info, Level};
use sauron::{document, wasm_bindgen, Program};

mod cat;
mod dog;

#[wasm_bindgen(start)]
pub fn start() {
  let _ = console_log::init_with_level(Level::Debug);
}

#[wasm_bindgen]
pub fn mount_component(id: String, name: String) {
  let mount = document().query_selector(&id).ok().flatten();
  info!("mounting component with id: {}", id);
  info!("mount: {:?}", mount);
  if mount.is_some() {
    if name == "cat" {
      Program::replace_mount(Cat::new(), &mount.clone().unwrap());
    }
    if name == "dog" {
      Program::replace_mount(Dog::new(), &mount.unwrap());
    }
  }
}
