use crate::tape;
use crate::transition;
use crate::state;

pub struct TM {
    states: Vec<state::State>,
    transitions: Vec<transition::Transition>,
    pub tape: tape::Tape
} 

impl TM {
    pub fn new(states: Vec<state::State>, transitions: Vec<transition::Transition>, tape: tape::Tape) -> TM {
        TM { states, transitions, tape }
    }

    pub fn process(&mut self, verbose: bool) {
        let mut current_state: state::State = self.get_first_state();
        let mut step: i32 = 0;

        self.log_step(step, verbose);

        while current_state.state_type != state::StateType::Final {
            let current_char = self.tape.read();
            let state_id = current_state.id;

            let transition = *self.transitions.iter().clone()
            .find(|transition| transition.current_state == state_id && transition.current_char == current_char).unwrap();

            current_state = *self.states.iter().clone().find(|state| state.id == transition.new_state).unwrap();

            step += 1;
            self.tape.write(transition.new_char);
            self.tape.move_head(transition.direction);
            self.log_step(step, verbose);
        }
    }

    fn get_first_state(&self) -> state::State {
        let mut iter = self.states.iter().cloned();
        let first_state: Option<state::State> = iter.find(|state| state.state_type == state::StateType::Start);

        match first_state {
            None => panic!("No start state found."),
            Some(state) => state
        }
    }

    fn log_step(&mut self, step: i32, verbose: bool) {
        if !verbose {
            return
        }

        println!("Tape after step {0}: {1} -> Head position: {2}", step, self.tape.to_string(), self.tape.head_position);
    }
}
