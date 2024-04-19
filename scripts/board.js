const defaultState = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
let state = defaultState;
const validTrack = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                    [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

export function getState(){
    return state;
}

export function checkWinning(){
    let value;
    validTrack.forEach((track) => {
        if((state[track[0]] == state[track[1]]) && (state[track[1]] == state[track[2]])){
            value = track;
            return;
        }
    });
    return value;
}
export function isValid(index){
    return isNaN(state[index]);
}
export function movePlayer(playerID, index){
    state[index] = playerID;
}
export function reset(){
    state = defaultState.slice();
}