import * as board from "./board.js";
import * as display from "./display.js";
import * as robot from "./robot.js";
import {player} from "./player.js";

let round, active = false, tieCount = 0, move, gameMode; 
// gameMode = 0 (multiplayer), 1 (single easy), 2 (single hard)
let currentPlayer;
export function isActive(){return active};
export function activate(status = true){
    active = status;
};
export function getTieCount(){
    return tieCount;
}
export function getCurrentPlayer(){
    return currentPlayer;
}
export function nextTurn(){
    currentPlayer = currentPlayer == 0 ? 1 : 0;
    display.updateTurn(currentPlayer);
    if(gameMode == 'single' && currentPlayer == 1){
        active = false;
        setTimeout(() => {active = true; movePlayer(robot.getMove())}, 1000);
    }
}
export function resetScore(){
    player[0].score = player[1].score = 0;
    tieCount = 0;
}
function winGame(result){
    display.showWinGrid(result);
    active = false;
    player[currentPlayer].score++;
    display.updateScore(player[0].score, tieCount, player[1].score);
    setTimeout(() => {
        display.showNewRound(currentPlayer);
    }, 1000);
}
function tieGame(){
    active = false;
    tieCount++;
    display.updateScore(player[0].score, tieCount, player[1].score); 
    setTimeout(() => {
        display.showNewRound();
    }, 1000);
}
export function movePlayer(location){
    board.movePlayer(currentPlayer, location);
    display.showMove(currentPlayer, location);
    move++;
    const result = board.checkWinning();
    if(result) winGame(result);
    else if(move == 9) tieGame();
    else nextTurn();
};
export function newGame(selectedMode){
    resetScore();
    display.updateScore(0, 0, 0);
    gameMode = selectedMode;
    round = 0;
    nextRound();
};
export function nextRound(){
    display.resetGrid();
    board.reset();
    round++;
    move = 0;
    currentPlayer = (round % 2 == 1) ? 0 : 1;
    display.updateTurn(currentPlayer);
    if(gameMode == 'single' && currentPlayer == 1){
        active = false;
        setTimeout(() => {active = true; movePlayer(robot.getMove());}, 1000);
    }
}