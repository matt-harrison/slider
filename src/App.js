import React, { Component } from 'react';

class App extends Component {
  state = {
    backgroundHeight: 1519,
    backgroundWidth: 1000,
    columns: 4,
    img: 'http://rootbeercomics.com/illustration/posters/img/flickit-fridays.jpg',
    puzzleHeight: null,
    puzzleWidth: null,
    rows: 6,
    squareWidth: null,
    squareHeight: null,
    squares: []
  }

  componentWillMount() {
    this.formatPuzzle(true);

    window.addEventListener('resize', () => {this.formatPuzzle()});
  }

  buildPuzzle = () => {
    let squares   = [];
    let positions = [];

    for (let row = 0; row < this.state.rows; row++) {
      for (let column = 0; column < this.state.columns; column++) {
        const id = row * this.state.columns + column;
        const position = {
          column,
          row
        };
        const square = {
          backgroundPosition: {
            column,
            row
          },
          style: {
            opacity: (id === (this.state.columns * this.state.rows) - 1) ? '0'  : '1',
            zIndex:  (id === (this.state.columns * this.state.rows) - 1) ? '-1' : id
          }
        };

        squares.push(square);
        positions.push(position);
      }
    }

    squares = this.shuffleSquares(squares, positions);

    this.setState({squares});
  }

  formatPuzzle = (isInit = false) => {
    const backgroundRatio = this.state.backgroundWidth / this.state.backgroundHeight;
    const isFullWidth     = window.innerWidth / backgroundRatio <= window.innerHeight;
    const puzzleWidth     = (isFullWidth) ? Math.floor(window.innerWidth) : Math.floor(window.innerHeight * backgroundRatio);
    const puzzleHeight    = Math.floor(puzzleWidth / backgroundRatio);
    const puzzleScale     = Math.floor(puzzleWidth / this.state.backgroundWidth);
    const squareWidth     = Math.floor(puzzleWidth / this.state.columns);
    const squareHeight    = Math.floor(puzzleHeight / this.state.rows);

    this.setState({
      puzzleHeight,
      puzzleScale,
      puzzleWidth,
      squareHeight,
      squareWidth
    }, () => {
      if (isInit) {
        this.buildPuzzle();
      }
    });
  };

  handleClick = (index) => {
    let squares = this.state.squares.slice();
    const empty = this.state.squares[this.state.squares.length - 1];

    if (empty.row === squares[index].row) {
      if (empty.column === squares[index].column + 1) {
        squares[index].column++;
        empty.column--;
      } else if (empty.column === squares[index].column - 1) {
        squares[index].column--;
        empty.column++;
      }
    } else if (empty.column === squares[index].column) {
      if (empty.row === squares[index].row + 1) {
        squares[index].row++;
        empty.row--;
      } else if (empty.row === squares[index].row - 1) {
        squares[index].row--;
        empty.row++;
      }
    }

    this.setState({squares});
  };

  shuffleSquares = (squares, positions) => {
    for (let i = 0; i < squares.length; i++) {
      const slot     = Math.floor(Math.random() * positions.length);
      const position = positions.splice(slot, 1);

      squares[i].column = position[0].column;
      squares[i].row    = position[0].row;
    }

    return squares;
  }

  render() {
    return (
        <div
        className="puzzle"
        style={{
          width:  this.state.puzzleWidth,
          height: this.state.puzzleHeight,
        }}
        >
          <div
          className="background"
          style={{
            backgroundImage: `url(${this.state.img})`,
            backgroundSize:  `${this.state.puzzleWidth}px ${this.state.puzzleHeight}px`
          }}
          />
          {this.state.squares.map((square, index) => {
            const x     = square.backgroundPosition.column * this.state.squareWidth;
            const y     = square.backgroundPosition.row * this.state.squareHeight;
            const style = {
              top: square.row * this.state.squareHeight,
              left: square.column * this.state.squareWidth,
              width: this.state.squareWidth,
              height: this.state.squareHeight,
              backgroundPosition: `${(0 - x)}px ${(0 - y)}px`,
              backgroundImage: `url(${this.state.img})`,
              backgroundSize: `${this.state.puzzleWidth}px ${this.state.puzzleHeight}px`,
              opacity: square.style.opacity,
              zIndex:  square.style.zIndex
            };

            return (
              <div
              className="square"
              key={index}
              style={style}
              onClick={(e) => {
                e.preventDefault();
                this.handleClick(index);
              }}
              />
            );
          })}
        </div>
    );
  }
}

export default App;
