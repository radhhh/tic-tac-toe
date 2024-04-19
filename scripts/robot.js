import * as board from "./board.js";

const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
const nextMove = {};
let difficulty = 1;

export function setDifficulty(selectedDifficulty){
    difficulty = selectedDifficulty;
}
function easyBot(){
    const boardState = board.getState();
    const boardAvailableState = boardState
        .map((value, index) => {
            return {val: value, idx: index}})
        .filter((current) => isNaN(current.val));
    return boardAvailableState[parseInt(Math.random()*boardAvailableState.length)].idx;
}
function mediumBot(){
    const boardState = board.getState();
    let nextMove;
    validTrack.forEach((track) => {
        const status = track.map((value) => boardState[value]);
        if(status[0] == 1 && status[0] == status[1] && isNaN(status[2])){
            nextMove = track[2];
            if(status[0] == 1) return;
        }
        if(status[1] == 1 && status[1] == status[2] && isNaN(status[0])){
            nextMove = track[0];
            if(status[1] == 1) return;
        }
        if(status[2] == 1 && status[0] == status[2] && isNaN(status[1])){
            nextMove = track[1];
            if(status[0] == 1) return;
        }
    });
    if(nextMove !== undefined) return nextMove;
    validTrack.forEach((track) => {
        const status = track.map((value) => boardState[value]);
        if(status[0] == status[1] && isNaN(status[2])){
            nextMove = track[2];
            if(status[0] == 1) return;
        }
        if(status[1] == status[2] && isNaN(status[0])){
            nextMove = track[0];
            if(status[1] == 1) return;
        }
        if(status[0] == status[2] && isNaN(status[1])){
            nextMove = track[1];
            if(status[0] == 1) return;
        }
    });
    return nextMove;
}

function hardBot(){
    const boardState = board.getState();
    const possibleMoves = nextMove[boardState];
    return possibleMoves[Math.round(Math.random() * possibleMoves.length)];
}

export function getMove(){
    switch(difficulty){
        case 0:
            const obviousMove = mediumBot();
            if(obviousMove !== undefined) return obviousMove;
            else return easyBot();
        case 1:
            return hardBot();
    }
}

// hard bot
function checkWinning(state){
    let value;
    validTrack.forEach((track) => {
        if((state[track[0]] == state[track[1]]) && (state[track[1]] == state[track[2]])){
            value = state[track[0]];
            return;
        }
    });
    return value;
}

function flip(state){
    return state.map(val => {
        if(isNaN(val)) return NaN;
        return (val == 1 ? 0 : 1);
    });
}

function precompute(state, moveCount){
    if(checkWinning(state) === 1) return 1; // win
    if(checkWinning(state) === 0) return -1; // lose
    if(moveCount == 9) return 0;

    const nextState = flip(state);
    let bestCase = -1, bestMove = [];
    for(let i = 0; i < 9; i++){
        if(!isNaN(nextState[i])) continue;
        nextState[i] = 0;
        const result = precompute(nextState, moveCount + 1) * -1;
        nextState[i] = NaN;
        if(result > bestCase){
            bestMove = [];
            bestCase = result;
        }
        if(result == bestCase){
            bestMove.push(i);
        }
    }
    nextMove[state] = bestMove;
    return bestCase;
}

precompute([NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN], 0);