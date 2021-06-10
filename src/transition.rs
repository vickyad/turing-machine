use crate::direction;

#[derive(Copy)]
pub struct Transition {
    pub current_state: char,
    pub current_char: char,
    pub new_state: char,
    pub new_char: char,
    pub direction: direction::Direction
}

impl Transition {
    pub fn new(current_state: char, current_char: char, new_state: char, new_char: char, direction: direction::Direction) -> Transition {
        Transition { current_state, current_char, new_state, new_char, direction }
    }
}

impl Clone for Transition {
    fn clone(&self) -> Transition { *self }
}