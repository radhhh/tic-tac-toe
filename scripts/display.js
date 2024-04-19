import {player} from "./player.js";


const turnDisplay = document.querySelector('#turnDisplay');
const gridContent = document.querySelectorAll('.gridContent');
const gridItem = document.querySelectorAll('.gridItem');
const xDisplay = document.querySelector('#displayX');
const oDisplay = document.querySelector('#displayO');
const tieDisplay = document.querySelector('#displayTie');
const overlayDark = document.querySelector('#overlayDark');
const newRoundWindow = document.querySelector('#newRoundWindow');
const modeSelectorWindow = document.querySelector('#modeSelectorWindow');
const pauseWindow = document.querySelector('#pauseWindow');
const winnerText = document.querySelector('#winnerText');

export function addPreview(playerID, location){
    gridContent[location].textContent = player[playerID].symbol;
    gridContent[location].classList.add(player[playerID].symbol);
}
export function removePreview(location){
    gridContent[location].textContent = '';
    gridContent[location].className = "gridContent";
}
export function showMove(playerID, location){
    gridContent[location].textContent = player[playerID].symbol;
    gridContent[location].classList.add('chosen');
    gridContent[location].classList.add(player[playerID].symbol);
}
export function updateTurn(playerID){
    turnDisplay.textContent = `${player[playerID].symbol} TURN`;
    turnDisplay.classList = player[playerID].symbol;
}
export function updateScore(playerScore1, tieScore, playerScore2){
    xDisplay.textContent = playerScore1;
    tieDisplay.textContent = tieScore;
    oDisplay.textContent = playerScore2;
}
export function showWinGrid(winningLine){
    for(let i = 0; i < 9; i++){
        if(winningLine.some((index) => index == i)){
            gridItem[i].classList.add('winning');
        }
        else gridContent[i].classList.remove('chosen');
    }
}
export function showNewRound(winningPlayer){
    if(winningPlayer !== undefined) winnerText.textContent = `Player ${player[winningPlayer].symbol} is the winner!`;
    else winnerText.textContent = 'The game is tie'
    newRoundWindow.classList.remove('hidden');
    overlayDark.classList.remove('hidden');
};
export function hideNewRound(){
    newRoundWindow.classList.add('hidden');
    overlayDark.classList.add('hidden');
}
export function showModeSelector(){
    modeSelectorWindow.classList.remove('hidden');
    overlayDark.classList.remove('hidden');
}
export function hideModeSelector(){
    modeSelectorWindow.classList.add('hidden');
    overlayDark.classList.add('hidden');
}
export function showPauseWindow(){
    pauseWindow.classList.remove('hidden');
    overlayDark.classList.remove('hidden');
}
export function hidePauseWindow(){
    pauseWindow.classList.add('hidden');
    overlayDark.classList.add('hidden');
} 
export function resetGrid(){
    for(let i = 0; i < 9; i++){
        gridItem[i].className = "gridItem";
        gridContent[i].className = "gridContent";
        gridContent[i].textContent = "";
    }
}