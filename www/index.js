import * as wasm from "turing-machine";

const BLANK_CHAR = ""
const ERROR_NO_STATES = "[ERRO] 'Todos os estados': por favor, forneça ao menos um estado"
const ERROR_NO_INITIAL_STATE = "[ERRO]: 'Estado inicial': por favor, forneça um estado inicial"
const ERROR_MORE_THAN_ONE_INITIAL_STATE = "[ERRO] 'Estado inicial': por favor, forneça apenas um estado inicial"
const ERROR_NO_INITIAL_STATE_FOUND = "[ERRO] 'Estado inicial': o estado inicial fornecido não está na lista de estados"
const ERROR_NO_FINAL_STATE_FOUND = "[ERRO] 'Estados finais': um ou mais estados finais fornecidos não estão na lista de estados"
const ERROR_NO_ENTRY_ALPHABET = "[ERRO] 'Alfabeto de entrada': por favor, forneça pelo menos um caracter como alfabeto de entrada"
const ERROR_REPEATED_CHARACTER = "[ERRO] 'Alfabeto auxiliar': caracteres repetidos em alfabeto de entrada e alfabeto auxiliar"
const ERROR_MORE_THAN_ONE_INITIAL_SYMBOL = "[ERRO] 'Símbolo de início': por favor, forneça apenas um símbolo inicial"
const ERROR_MORE_THAN_ONE_BLANK_SYMBOL = "[ERRO] 'Símbolo de branco': por favor, forneça apenas um símbolo branco"

const ERROR_TRANSITION_TABLE_BEGINNIG = "[ERRO] 'Tabela de transição' em "
const ERROR_INCORRECT_NUMBER_OF_PARAMETERS_TRANSITION = ": a transição precisa de três parâmetros no seguinte formato => [novo estado], [novo caracter], [direção]"
const ERROR_INVALID_NEW_STATE = ": o estado fornecido não está na lista de estados"
const ERROR_INVALID_NEW_CHARACTER = ": o caracter fornecido não está na lista de caracteres de nenhum alfabeto"
const ERROR_INVALID_DIRECTION = ": a direção fornecida é inválida. As direções possíveis são 'E', 'D' ou ''(caracter vazio)"

const WARNING_NO_TRANSITIONS_MACHINE = "[AVISO]: A máquina de estados gerada não possui transições"

let statesList = undefined
let initialState = undefined
let finalStatesList = undefined
let entryAlphabet = undefined
let auxiliarAlphabet = undefined
let initialSymbol = undefined
let blankSymbol = undefined
let alphabet = undefined
let transitionTable = []

const verifyCodeButton = document.getElementById('verify_code')
const errorsLog = document.getElementById('errors_area')
const generateTableButton = document.getElementById('generate_table')


verifyCodeButton.addEventListener("click", event => {
    if(createTransitionTable()) {
        createTMObject()
    }
    //wasm.greet('olha o console')    
})

generateTableButton.addEventListener('click', event => {
    if(verifyInputs()) {
        createInputTable()
    }
})

const createTMObject = () => {
    const alphabetString = alphabet.reduce((finalString, element) => {
        return finalString += element
    }, "")

    const finalStatesString = finalStatesList.reduce((finalString, element) => {
        return finalString += (element + ',') 
    }, "")

    const neutralStates = statesList.filter((element) => {
        return !(element === initialState || finalStatesList.includes(element))
    })
    const statesString = neutralStates.reduce((finalString, element) => {
        return finalString += (element + ',')
    }, "")
    const transitionsString = transitionTable.reduce((finalString, line) => {
        let lineString = line.reduce((finalLine, element) => {
            return finalLine += (element + ',')
        }, "")
        return finalString += (lineString + '/')
    }, "")

    const TMObject = {
        alphabet: alphabetString,
        initialState: initialState,
        states: statesString,
        finalStates: finalStatesString,
        transitions: transitionsString
    }
    console.log(TMObject)
    window.localStorage.setItem('TMObject', JSON.stringify(TMObject));
}

const validStatesInput = () => {
    statesList = document.getElementById("states").value
    if(!statesList) {
        errorsLog.innerText = ERROR_NO_STATES
        return false
    }
    statesList = listify(statesList)
    return true
}

const validInitialStateInput = () => {
    initialState = document.getElementById("initial_state").value
    if(!initialState) {
        errorsLog.innerText = ERROR_NO_INITIAL_STATE
        return false
    } else if(listify(initialState).length > 1) {
        errorsLog.innerText = ERROR_MORE_THAN_ONE_INITIAL_STATE
        return false
    }
    initialState = initialState.trim()
    if(!statesList.includes(initialState)) {
        errorsLog.innerText = ERROR_NO_INITIAL_STATE_FOUND
        return false
    }
    return true
}

const validFinalStatesInput = () => {
    finalStatesList = document.getElementById("final_states").value
    if(!finalStatesList) {
        finalStatesList = []
    } else {
        finalStatesList = listify(finalStatesList)
        const finalStatesNotIncluded = finalStatesList.filter((element) => statesList.indexOf(element) === -1)
        if(finalStatesNotIncluded.length > 0) {
            errorsLog.innerText = ERROR_NO_FINAL_STATE_FOUND
            return false
        }
    }
    return true
}

const validEntryAlphabetInput = () => {
    entryAlphabet = document.getElementById("entry_alphabet").value
    if(!entryAlphabet) {
        errorsLog.innerText = ERROR_NO_ENTRY_ALPHABET
        return false
    }
    entryAlphabet = listify(entryAlphabet)
    return true
}

const validAuxiliarAlphabetInput = () => {
    auxiliarAlphabet = document.getElementById("aux_alphabet").value
    if(!auxiliarAlphabet) {
        auxiliarAlphabet = []
    } else {
        auxiliarAlphabet = listify(auxiliarAlphabet) 
        const repeatedChar = entryAlphabet.some(char => auxiliarAlphabet.indexOf(char) >= 0)
        if(repeatedChar) {
            errorsLog.innerText = ERROR_REPEATED_CHARACTER
            return false
        }
    }
    return true
}

const validInitialSymbolInput = () => {
    initialSymbol = document.getElementById("initial_symbol").value
    if(!initialSymbol) {
        initialSymbol = "@"
    } else if (listify(initialSymbol).length > 1) {
        errorsLog.innerText = ERROR_MORE_THAN_ONE_INITIAL_SYMBOL
        return false
    }
    return true
}

const validBlankSymbolInput = () => {
    blankSymbol = document.getElementById("blank_symbol").value
    if(!blankSymbol) {
        blankSymbol = "-"
    } else if (listify(blankSymbol).length > 1) {
        errorsLog.innerText = ERROR_MORE_THAN_ONE_BLANK_SYMBOL
        return false
    }
    return true
}

const verifyInputs = () => {
    clearInputTable()
    errorsLog.innerText = BLANK_CHAR
    
    if(!validStatesInput() || !validInitialStateInput() || !validFinalStatesInput()
    || !validEntryAlphabetInput() || !validAuxiliarAlphabetInput() 
    || !validInitialSymbolInput() || !validBlankSymbolInput()) {
        return false
    }
    
    alphabet = [initialSymbol, ...entryAlphabet, ...auxiliarAlphabet, blankSymbol]
    return true
}

const listify = (element) => {
    return element.split(',').map((state) => state.trim())
}

const createInputTable = () => {
    const transitionTable = document.getElementById('transition_table')
    createHeaderRow(transitionTable)
    createStatesRow(transitionTable)
}

const createElement = (parent, elementType, insideText) => {
    let child = document.createElement(elementType)
    child.innerHTML = insideText
    parent.append(child)
}

const createHeaderRow = (transitionTable) => {
    const tableRow = document.createElement('tr')
    createElement(tableRow, 'th', BLANK_CHAR)

    alphabet.forEach(element => {
        createElement(tableRow, 'th', element)
    })
    transitionTable.append(tableRow)
}

const createStatesRow = (transitionTable) => {
    statesList.forEach(element => {
        const tableRow = document.createElement('tr')
        createElement(tableRow, 'td', element)
        for (let i = 0; i < alphabet.length; i++) {
            createElement(tableRow, 'td', '<input type="text" class="transition" name="transition_input">')
        }
        transitionTable.append(tableRow)
    })
}

const clearInputTable = () => {
    const inputTable = document.getElementById('transition_table')
    inputTable.innerHTML = BLANK_CHAR
}

const createTransitionTable = () => {
    errorsLog.innerText = BLANK_CHAR
    const directions = ["E", "D", ""]
    const inputTable = document.getElementById('transition_table')
    let rowLength = inputTable.rows.length

    for (let i = 1; i < rowLength; i++){  
       let oCells = inputTable.rows.item(i).cells
       let cellLength = oCells.length
       for(let j = 1; j < cellLength; j++){
            let cellVal = oCells.item(j).children[0].value
            if(cellVal) {
                cellVal = listify(cellVal)
                
                if(cellVal.length !== 0 && cellVal.length !== 3) {
                    errorsLog.innerText = ERROR_TRANSITION_TABLE_BEGINNIG + statesList[i - 1] + " x " + alphabet[j - 1] + ERROR_INCORRECT_NUMBER_OF_PARAMETERS_TRANSITION
                    return false
                }
                // estado, char, movimento
                if(!statesList.includes(cellVal[0])) {
                    errorsLog.innerText = ERROR_TRANSITION_TABLE_BEGINNIG + statesList[i - 1] + " x " + alphabet[j - 1] + ERROR_INVALID_NEW_STATE
                    return false
                }
                
                if(!alphabet.includes(cellVal[1])) {
                    errorsLog.innerText = ERROR_TRANSITION_TABLE_BEGINNIG + statesList[i - 1] + " x " + alphabet[j - 1] + ERROR_INVALID_NEW_CHARACTER
                    return false
                }
    
                if(!directions.includes(cellVal[2])) {
                    errorsLog.innerText = ERROR_TRANSITION_TABLE_BEGINNIG + statesList[i - 1] + " x " + alphabet[j - 1] + ERROR_INVALID_DIRECTION
                    return false
                }
    
                let transition = [statesList[i - 1], alphabet[j - 1], cellVal[0], cellVal[1], cellVal[2]]
                transitionTable.push(transition)
            }
        }
    }

    if(transitionTable.length < 1) {
        errorsLog.innerText = WARNING_NO_TRANSITIONS_MACHINE
    }

    return true
}