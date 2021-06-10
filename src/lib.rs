mod utils;

mod state;
mod tape;
mod direction;
mod transition;
mod tm;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn turing_machine(entry_word: &str, alphabet: &str) {
    let tape = tape::Tape::new("$|#", entry_word);
    let states = vec![
        state::State::new('0', state::StateType::Start),
        state::State::new('1', state::StateType::Empty),
        state::State::new('f', state::StateType::Final)
    ];
 
    let transitions = vec![
        transition::Transition::new('0', '$', '1', '$', direction::Direction::Right),
        transition::Transition::new('1', '|', '1', '|', direction::Direction::Right),
        transition::Transition::new('1', '#', 'f', '|', direction::Direction::None)
    ];
 
    let mut tm = tm::TM::new(states, transitions, tape);

    //tm.process(true);

    alert(&format!("{}", alphabet.to_string()));
}