import * as wasm from "turing-machine";
import { TM, State, StateType, Transition, Tape, Direction } from "turing-machine";

const runButton = document.getElementById('run_button')
runButton.addEventListener('click', event => {
    const entryWord = document.getElementById('word_input').value
    const TMObject = JSON.parse(window.localStorage.getItem('TMObject'))

    wasm.build_machine(entryWord, TMObject.alphabet, TMObject.initialState, TMObject.states, TMObject.finalStates, TMObject.transitions)
})