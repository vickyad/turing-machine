// use num_bigint::BigUint;
use crate::direction;

pub struct Tape {
    pub alphabet: Vec<char>,
    pub head_position: i32,
    pub tape: Vec<char>
}

impl Tape {
    pub fn new(alphabet: &str, tape: &str) -> Tape {
        Tape { alphabet: alphabet.chars().collect(), head_position: 0, tape: tape.chars().collect() }
    }

    pub fn write(&mut self, character: char) {
        if !(self.head_position >= 1 && self.alphabet.contains(&character)) {
            return
        }

        self.tape[self.head_position as usize] = character;
    }

    pub fn read(&mut self) -> char {
        if self.head_position as usize > self.tape.len() {
            panic!("Trying to read character at invalid position: {}.", self.head_position.to_string());
        }

        self.tape[self.head_position as usize]
    }

    pub fn move_head(&mut self, direction: direction::Direction) {
        match direction {
            direction::Direction::Right => { self.head_position += 1; },
            direction::Direction::Left => { self.head_position -= 1; },
            direction::Direction::None => {}
        }
        
        if self.head_position < 0 {
            self.head_position = 0;
        }

        if self.head_position >= self.tape.len() as i32 {
            self.tape.push('#');
        }
    }

    pub fn to_string(&self) -> String {
        self.tape.iter().collect()
    }
}
