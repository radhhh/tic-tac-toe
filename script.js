function Player(symbol){
    this.score = 0;
    this.symbol = symbol
}

const player = [new Player('X'), new Player('O')];

const display = (() => {
    const turnDisplay = document.querySelector('#turnDisplay'),
    gridContent = document.querySelectorAll('.gridContent'),
    gridItem = document.querySelectorAll('.gridItem'),
    xDisplay = document.querySelector('#displayX'),
    oDisplay = document.querySelector('#displayO'),
    tieDisplay = document.querySelector('#displayTie');
    overlayDark = document.querySelector('#overlayDark'),
    newRoundWindow = document.querySelector('#newRoundWindow'),
    winnerText = document.querySelector('#winnerText');

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
    const updateTurn = function(playerID){
        turnDisplay.textContent = `${player[playerID].symbol} TURN`;
        turnDisplay.classList = player[playerID].symbol;
    }
    const updateScore = function(){
        xDisplay.textContent = player[0].score;
        tieDisplay.textContent = controller.tieCount;
        oDisplay.textContent = player[1].score;
    }
    const showWinGrid = function(winningLine){
        for(let i = 0; i < 9; i++){
            if(winningLine.some((index) => index == i)){
                gridItem[i].classList.add('winning');
                continue;
            }
            gridContent[i].classList.remove('chosen');
        }
    }
    const showNewRound = function(winningPlayer){
        if(winningPlayer) winnerText.textContent = `Player ${player[winningPlayer].symbol} is the winner`;
        else winnerText.textContent = 'The game is tie'
        newRoundWindow.classList.remove('hidden');
        overlayDark.classList.remove('hidden');
    };
    const hideNewRound = function(){
        newRoundWindow.classList.add('hidden');
        overlayDark.classList.add('hidden');
    }
    const resetGrid = function(){
        for(let i = 0; i < 9; i++){
            gridItem[i].className = "gridItem";
            gridContent[i].className = "gridContent";
            gridContent[i].textContent = "";
        }
    }
    return {addPreview, removePreview, showMove, updateTurn, updateScore, showWinGrid, showNewRound, hideNewRound, resetGrid};
})();

const board = (() => {
    const defaultState = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
    let state = defaultState;
    const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
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
    const reset = function(){
        state = defaultState.slice();
        console.log(state);
    }
    return {isValid, movePlayer, checkWinning, reset};
})();

const controller = (() => {
    let round, active = true, tieCount = 0, move = 0;
    let currentPlayer;
    const isActive = function(){return active};
    const activate = function(){
        active = true
    };
    const nextTurn = function(){
        currentPlayer = currentPlayer == 0 ? 1 : 0;
        display.updateTurn(currentPlayer);
    }
    const resetScore = function(){
        player[0].score = player[1].score = 0;
    }
    const winGame = function(result){
        display.showWinGrid(result);
        active = false;
        player[currentPlayer].score++;
        display.updateScore();
        setTimeout(() => {
            display.showNewRound(currentPlayer);
        }, 1000);
    }
    const tieGame = function(){
        active = false;
        tieCount++;
        display.updateScore();
        setTimeout(() => {
            display.showNewRound();
        })
    }
    const movePlayer = function(location){
        board.movePlayer(currentPlayer, location);
        display.showMove(currentPlayer, location);
        move++;
        const result = board.checkWinning();
        if(result) winGame(result);
        else if(move == 9) tieGame();
        else nextTurn();
    };
    const newGame = function(){
        round = 1;
        move = 0;
        currentPlayer = 0;
        display.updateTurn(currentPlayer);
        resetScore();
        display.updateScore();
        display.resetGrid();
        board.reset();
    };
    const nextRound = function(){
        round++;
        move = 0;
        currentPlayer = (round % 2 == 1) ? 0 : 1;
        display.updateTurn(currentPlayer);
        display.resetGrid();
        board.reset();
    }
    return {activate, isActive, tieCount, newGame, movePlayer, newGame, nextRound};
})();

function handleClick(location){
    if(board.isValid(location) && controller.isActive()) controller.movePlayer(location);
}
function handleNewGame(){
    display.hideNewRound();
    controller.activate();
    controller.newGame();
}
function handleNextRound(){
    display.hideNewRound();
    controller.activate();
    controller.nextRound();
}

controller.newGame();