function Player(symbol){
    this.score = 0;
    this.symbol = symbol
}

const player = [new Player('X'), new Player('O')];

const display = (() => {
    const turnDisplay = document.querySelector('#turnDisplay'),
    gridContent = document.querySelectorAll('.gridContent'),
    gridItem = document.querySelectorAll('.gridItem'),
    xDisplay = document.querySelector('#xDisplay'),
    oDisplay = document.querySelector('#oDisplay'),
    overlayDark = document.querySelector('#overlayDark');

    const addPreview = function(playerID, location){
        gridContent[location].textContent = player[playerID].symbol;
        gridContent[location].classList.add(player[playerID].symbol);
    }
    const removePreview = function(location){
        gridContent[location].textContent = '';
    }
    const showMove = function(playerID, location){
        gridContent[location].textContent = player[playerID].symbol;
        gridContent[location].classList.add('chosen');
        gridContent[location].classList.add(player[playerID].symbol);
    }
    const updateTurn = function(symbol){
        turnDisplay.textContent = `${symbol} TURN`;
        turnDisplay.classList = symbol;
    }
    const showWinning = function(winningLine){
        for(let i = 0; i < 9; i++){
            if(winningLine.some((index) => index == i)){
                gridItem[i].classList.add('winning');
                continue;
            }
            gridContent[i].classList.remove('chosen');
        }
    }
    const showWinWindow = function(){

    };
    const resetDisplay = function(){
        for(let i = 0; i < 9; i++){
            gridItem[i].className = "gridItem";
            gridContent[i].className = "gridContent";
            gridContent[i].textContent = "";
        }
    }
    return {addPreview, removePreview, showMove, updateTurn, showWinning, resetDisplay};
})();

const board = (() => {
    const defaultState = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
    const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    let state = defaultState;
    const checkWinning = function(){
        let value;
        validTrack.forEach((track) => {
            if((state[track[0]] == state[track[1]]) && (state[track[1]] == state[track[2]])){
                value = track;
                return;
            }
        });
        return value;
    }
    const isValid = function(index){
        return isNaN(state[index]);
    }
    const movePlayer = function(playerID, index){
        state[index] = playerID;
        console.log(state);
    }
    return {isValid, movePlayer, checkWinning};
})();

const controller = (() => {
    let round;
    let currentPlayer;
    const gridItem = document.querySelectorAll('.gridItem');
    const nextTurn = function(){
        currentPlayer = currentPlayer == 0 ? 1 : 0;
        display.updateTurn(player[currentPlayer].symbol);
    }
    const winGame = function(result){
        display.showWinning(result);
        setTimeout(() => {
            display.showWinWindow(currentPlayer);
        }, 500)
    }
    const movePlayer = function(location){
        board.movePlayer(currentPlayer, location);
        display.showMove(currentPlayer, location);
        const result = board.checkWinning();
        if(result) winGame(result);
        else nextTurn();
    };
    const newGame = function(){
        round = 1;
        currentPlayer = 0;
        display.updateTurn(player[currentPlayer].symbol);
    };
    return {newGame, movePlayer};
})();

function handleClick(location){
    if(board.isValid(location)) controller.movePlayer(location);
}
controller.newGame();