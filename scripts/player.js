function Player(symbol){
    this.score = 0;
    this.symbol = symbol;
}

export const player = [new Player('X'), new Player('O')];