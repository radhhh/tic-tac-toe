function Player(symbol){
    this.score = 0;
    this.symbol = symbol
}

const player = [new Player('X'), new Player('O')];

const robot = (() => {
    const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    let difficulty = 1;
    const setDifficulty = function(selectedDifficulty){
        difficulty = selectedDifficulty;
    }
    const easyBot = function(){
        const boardState = board.getState();
        const boardAvailableState = boardState
            .map((value, index) => {
                return {val: value, idx: index}})
            .filter((current) => isNaN(current.val));
        return boardAvailableState[parseInt(Math.random()*boardAvailableState.length)].idx;
    }
    const mediumBot = function(){
        const boardState = board.getState();
        let nextMove;
        validTrack.forEach((track) => {
            const status = track.map((value) => boardState[value]);
            if((status[1] == status[2]) && isNaN(status[0])){
                nextMove = track[0];
                if(status[1] == 1) return;
            }
            if((status[0] == status[2]) && isNaN(status[1])){
                nextMove = track[1];
                if(status[0] == 1) return;
            }
            if((status[0] == status[1]) && isNaN(status[2])){
                nextMove = track[2];
                if(status[2] == 1) return;
            }
        });
        if(nextMove != undefined) return nextMove;
        else return easyBot();
    }
    const move = function(){
        switch(difficulty){
            case 0:
                controller.movePlayer(easyBot());
                break;
            case 1:
                controller.movePlayer(mediumBot());
                break;
            case 2:
                controller.movePlayer(hardBot());
                break;
        }
    }
    return {move, setDifficulty};
})();

const display = (() => {
    const turnDisplay = document.querySelector('#turnDisplay'),
    gridContent = document.querySelectorAll('.gridContent'),
    gridItem = document.querySelectorAll('.gridItem'),
    xDisplay = document.querySelector('#displayX'),
    oDisplay = document.querySelector('#displayO'),
    tieDisplay = document.querySelector('#displayTie');
    overlayDark = document.querySelector('#overlayDark'),
    newRoundWindow = document.querySelector('#newRoundWindow'),
    modeSelectorWindow = document.querySelector('#modeSelectorWindow');
    pauseWindow = document.querySelector('#pauseWindow');
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
        tieDisplay.textContent = controller.getTieCount();
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
        if(winningPlayer !== undefined) winnerText.textContent = `Player ${player[winningPlayer].symbol} is the winner!`;
        else winnerText.textContent = 'The game is tie'
        newRoundWindow.classList.remove('hidden');
        overlayDark.classList.remove('hidden');
    };
    const hideNewRound = function(){
        newRoundWindow.classList.add('hidden');
        overlayDark.classList.add('hidden');
    }
    const showModeSelector = function(){
        modeSelectorWindow.classList.remove('hidden');
        overlayDark.classList.remove('hidden');
    }
    const hideModeSelector = function(){
        modeSelectorWindow.classList.add('hidden');
        overlayDark.classList.add('hidden');
    }
    const showPauseWindow = function(){
        pauseWindow.classList.remove('hidden');
        overlayDark.classList.remove('hidden');
    }
    const hidePauseWindow = function(){
        pauseWindow.classList.add('hidden');
        overlayDark.classList.add('hidden');
    } 
    const resetGrid = function(){
        for(let i = 0; i < 9; i++){
            gridItem[i].className = "gridItem";
            gridContent[i].className = "gridContent";
            gridContent[i].textContent = "";
        }
    }
    return {addPreview, removePreview, showMove, updateTurn, updateScore, showWinGrid, showNewRound, hideNewRound, showModeSelector, hideModeSelector, showPauseWindow, hidePauseWindow, resetGrid};
})();

const board = (() => {
    const defaultState = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
    let state = defaultState;
    const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    const getState = function(){
        return state;
    }
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
    return {isValid, getState, movePlayer, checkWinning, reset};
})();

const controller = (() => {
    let round, active = false, tieCount = 0, move, gameMode; 
    // gameMode = 0 (multiplayer), 1 (single easy), 2 (single hard)
    let currentPlayer;
    const isActive = function(){return active};
    const activate = function(status = true){
        active = status;
    };
    const getTieCount = function(){
        return tieCount;
    }
    const nextTurn = function(){
        currentPlayer = currentPlayer == 0 ? 1 : 0;
        display.updateTurn(currentPlayer);
        if(gameMode == 'single' && currentPlayer == 1){
            active = false;
            setTimeout(() => {active = true; robot.move();}, 1000);
        }
    }
    const resetScore = function(){
        player[0].score = player[1].score = 0;
        tieCount = 0;
    }
    const winGame = function(result){
        display.showWinGrid(result);
        active = false;
        player[currentPlayer].score++;
        display.updateScore();
        console.log('winGame', currentPlayer);
        setTimeout(() => {
            display.showNewRound(currentPlayer);
        }, 1000);
    }
    const tieGame = function(){
        active = false;
        tieCount++;
        display.updateScore(); 
        console.log('tieGame');
        setTimeout(() => {
            display.showNewRound();
        }, 1000);
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
    const newGame = function(selectedMode){
        resetScore();
        display.updateScore();
        gameMode = selectedMode;
        round = 0;
        nextRound();
    };
    const nextRound = function(){
        display.resetGrid();
        board.reset();
        round++;
        move = 0;
        currentPlayer = (round % 2 == 1) ? 0 : 1;
        display.updateTurn(currentPlayer);
        if(gameMode == 'single' && currentPlayer == 1){
            active = false;
            setTimeout(() => {active = true; robot.move();}, 1000);
        }
    }
    return {activate, isActive, getTieCount, newGame, movePlayer, newGame, nextRound, resetScore};
})();

function handleClick(location){
    if(board.isValid(location) && controller.isActive()) controller.movePlayer(location);
}

function handleNewGame(){
    display.hideNewRound();
    display.hidePauseWindow();
    controller.resetScore();
    display.updateScore();
    display.resetGrid();
    board.reset();
    display.updateTurn(0);
    setTimeout(() => display.showModeSelector(), 500);
}

function handleNextRound(){
    display.hideNewRound();
    controller.activate();
    controller.nextRound();
}

function handleSelectMode(selectedMode){
    display.hideModeSelector();
    controller.activate();
    switch(selectedMode){
        case 'singleEasy':
            robot.setDifficulty(0)
            controller.newGame('single');
            break;
        case 'singleMedium':
            robot.setDifficulty(1);
            controller.newGame('single');
            break;
        case 'multiplayer':
            controller.newGame('multi');
    }
}

function handlePauseButton(){
    controller.activate(false);
    display.showPauseWindow();
}

function handleContinue(){
    controller.activate();
    display.hidePauseWindow();
}