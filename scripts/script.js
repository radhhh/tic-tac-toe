import * as robot from "./robot.js";
import * as board from "./board.js";
import * as display from "./display.js";
import * as controller from "./controller.js";

window.handleClick = function handleClick(location){
    if(board.isValid(location) && controller.isActive()) controller.movePlayer(location);
}

window.addPreview = function addPreview(location){
    if(board.isValid(location) && controller.isActive()) display.addPreview(controller.getCurrentPlayer(), location);
}

window.removePreview = function removePreview(location){
    if(board.isValid(location)) display.removePreview(location)
}

window.handleNewGame = function handleNewGame(){
    display.hideNewRound();
    display.hidePauseWindow();
    controller.resetScore();
    display.updateScore(0, 0, 0);
    display.resetGrid();
    board.reset();
    display.updateTurn(0);
    setTimeout(() => display.showModeSelector(), 500);
}

window.handleNextRound = function handleNextRound(){
    display.hideNewRound();
    controller.activate();
    controller.nextRound();
}

window.handleSelectMode = function handleSelectMode(selectedMode){
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
        case 'singleHard':
            robot.setDifficulty(2);
            controller.newGame('single');
            break;
        case 'singleInsane':
            robot.setDifficulty(3);
            controller.newGame('single');
            break;
        case 'multiplayer':
            controller.newGame('multi');
            break;
    }
}

window.handlePauseButton = function handlePauseButton(){
    controller.activate(false);
    display.showPauseWindow();
}

window.handleContinue = function handleContinue(){
    controller.activate();
    display.hidePauseWindow();
}