#[derive(PartialEq, Debug)]
#[derive(Copy)]
pub enum StateType {
    Start,
    Empty,
    Final
}

#[derive(Copy)]
pub struct State {
    pub id: char,
    pub state_type: StateType
}

impl State {
    pub fn new(id: char, state_type: StateType) -> State {
        State { id, state_type }
    }
}

impl Clone for StateType {
    fn clone(&self) -> StateType { *self }
}

impl Clone for State {
    fn clone(&self) -> State { *self }
}