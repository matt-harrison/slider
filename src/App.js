import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    let squares   = [];
    let positions = [];
    let initialState = {
      backgroundHeight: 1519,
      backgroundWidth: 1000,
      columns: 4,
      isResizing: false,
      img: 'http://rootbeercomics.com/illustration/posters/img/flickit-fridays.jpg',
      puzzleHeight: null,
      puzzleWidth: null,
      rows: 6,
      squareWidth: null,
      squareHeight: null,
      squares,
      debounceTimer: {}
    };

    initialState = Object.assign(initialState, this.formatPuzzle(initialState));

    for (let row = 0; row < initialState.rows; row++) {
      for (let column = 0; column < initialState.columns; column++) {
        const id = row * initialState.columns + column;
        const position = {
          column,
          row
        };
        const square = {
          originalPosition: {
            column,
            row
          },
          style: {
            opacity: (id === (initialState.columns * initialState.rows) - 1) ? '0'  : '1',
            zIndex:  (id === (initialState.columns * initialState.rows) - 1) ? '-1' : id
          }
        };

        squares.push(square);
        positions.push(position);
      }
    }

    squares = this.shuffleSquares(squares, positions);

    this.state = initialState;

    window.addEventListener('resize', () => {
      let debounceTimer = this.state.debounceTimer;

      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(this.debounceFormatPuzzle, 250);

      this.setState({debounceTimer});
    });
  }

  debounceFormatPuzzle = () => {
    const format = this.formatPuzzle(this.state);

    this.setState({
      isResizing: true,
      ...format
    }, () => {
      setTimeout(() => {
        this.setState({isResizing: false}, () => {
        });
      }, 100);
    });
  };

  formatPuzzle = (state) => {
    const windowWidth     = window.innerWidth - 20;
    const windowHeight    = window.innerHeight - 20;
    const backgroundRatio = state.backgroundWidth / state.backgroundHeight;
    const isFullWidth     = windowWidth / backgroundRatio <= windowHeight;
    const puzzleWidth     = (isFullWidth) ? windowWidth : windowHeight * backgroundRatio;
    const puzzleHeight    = puzzleWidth / backgroundRatio;
    const puzzleScale     = puzzleWidth / state.backgroundWidth;
    const squareWidth     = puzzleWidth / state.columns;
    const squareHeight    = puzzleHeight / state.rows;

    return {
      puzzleHeight,
      puzzleScale,
      puzzleWidth,
      squareHeight,
      squareWidth
    };
  };

  handleClick = (index) => {
    let   clicked       = this.state.squares[index];
    const clickedColumn = clicked.column;
    const clickedRow    = clicked.row;
    let   empty         = this.state.squares[this.state.squares.length - 1];
    const emptyColumn   = empty.column;
    const emptyRow      = empty.row;
    let   squares       = this.state.squares.slice();

    if ((clickedColumn === emptyColumn && clickedRow !== emptyRow) || (clickedRow === emptyRow && clickedColumn !== emptyColumn)) {
      squares.forEach((square) => {
        if (!(square.column === emptyColumn && square.row === emptyRow)) {
          if (emptyColumn === clickedColumn && square.column === clickedColumn) {
            if (emptyRow > clickedRow && square.row >= clickedRow && square.row < emptyRow) {
              square.row++;
            } else if (emptyRow < clickedRow && square.row <= clickedRow && square.row > emptyRow) {
              square.row--;
            }
          } else if (emptyRow === clickedRow && square.row === clickedRow) {
            if (emptyColumn > clickedColumn && square.column >= clickedColumn && square.column < emptyColumn) {
              square.column++;
            } else if (emptyColumn < clickedColumn && square.column <= clickedColumn && square.column > emptyColumn) {
              square.column--;
            }
          }
        } else {
          square.column = clickedColumn;
          square.row    = clickedRow;
        }
      });

      this.setState({squares});
    }
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
          const x     = square.originalPosition.column * this.state.squareWidth;
          const y     = square.originalPosition.row * this.state.squareHeight;
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
            className={this.state.isResizing ? 'square hotdog' : 'square trans'}
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
