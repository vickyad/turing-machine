#[derive(Copy)]
pub enum Direction {
    Right,
    Left,
    None
}

impl Clone for Direction {
    fn clone(&self) -> Direction { *self }
}