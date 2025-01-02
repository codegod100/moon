use sauron::{
    html::text, html::units::px, jss, node, wasm_bindgen, Application, Cmd, Node, Program,
};
use log::Level;


enum Msg {
    Increment,
    Decrement,
    Reset,
}

struct App {
    count: i32,
}

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
            class="inline-block px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-md"
            value="+"
            on_click=|_| {
                Msg::Increment
            }
                />
                <button class="count" on_click=|_|{
                    Msg::Reset} >{text(self.count)}</button>
                <input type="button"
                class="inline-block px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-md"
                value="-"
                on_click=|_| {
                    Msg::Decrement
                }
                />
            </main>
        }
    }
    
    fn update(&mut self, msg: Msg) -> Cmd<Msg> {
        match msg {
            Msg::Increment => self.count += 1,
            Msg::Decrement => self.count -= 1,
            Msg::Reset => {
                log::info!("resetting count");
                self.count = 1},
            }
            Cmd::none()
        }
        
        
    }
    
    #[wasm_bindgen(start)]
    pub fn start() {
    console_log::init_with_level(Level::Debug);
    Program::mount_to_body(App::new());
}