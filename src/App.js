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

    window.addEventListener('resize', this.formatPuzzle);
  }

  formatPuzzle = (isInit = false) => {
    const backgroundRatio = this.state.backgroundWidth / this.state.backgroundHeight;
    const isFullWidth     = window.innerWidth / backgroundRatio <= window.innerHeight;
    const puzzleWidth     = (isFullWidth) ? Math.floor(window.innerWidth) : Math.floor(window.innerHeight * backgroundRatio);
    const puzzleHeight    = Math.floor(puzzleWidth / backgroundRatio);
    const puzzleScale     = Math.floor(puzzleWidth / this.state.backgroundWidth);
    const squareWidth     = Math.floor(puzzleWidth / this.state.columns);
    const squareHeight    = Math.floor(puzzleHeight / this.state.rows);
    let   squares         = [];

    for (let row = 0; row < this.state.rows; row++) {
      for (let column = 0; column < this.state.columns; column++) {
        const x = column * squareWidth;
        const y = row * squareHeight;
        const id = row * this.state.columns + column;
        let square = {
          x: x,
          y: y,
          style: {
            width: squareWidth,
            height: squareHeight,
            backgroundImage: `url(${this.state.img})`,
            backgroundPosition: `${(0 - x)}px ${(0 - y)}px`,
            backgroundSize: `${puzzleWidth}px ${puzzleHeight}px`,
            opacity: (id === (this.state.columns * this.state.rows) - 1) ? '0' : '1',
            zIndex:  (id === (this.state.columns * this.state.rows) - 1) ? '-1' : id
          }
        };

        squares.push(square);
      }
    }

    if (isInit) {
      squares = this.shuffleSquares(squares);
    }

    this.setState({
      puzzleHeight,
      puzzleScale,
      puzzleWidth,
      squareHeight,
      squareWidth,
      squares
    });
  }

  handleClick = (index) => {
    let squares = this.state.squares.slice();
    const empty = this.state.squares[this.state.squares.length - 1];

    if (empty.y === squares[index].y) {
      if (empty.x - squares[index].x === this.state.squareWidth) {
        squares[index].x += this.state.squareWidth;
        empty.x -= this.state.squareWidth;
      } else if (empty.x - squares[index].x === 0 - this.state.squareWidth) {
        squares[index].x -= this.state.squareWidth;
        empty.x += this.state.squareWidth;
      }
    } else if (empty.x === squares[index].x) {
      if (empty.y - squares[index].y === this.state.squareHeight) {
        squares[index].y += this.state.squareHeight;
        empty.y -= this.state.squareHeight;
      } else if (empty.y - squares[index].y === 0 - this.state.squareHeight) {
        squares[index].y -= this.state.squareHeight;
        empty.y += this.state.squareHeight;
      }
    }

    this.setState({squares});
  };

  shuffleSquares = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      const index1 = Math.floor(Math.random() * squares.length);
      const index2 = Math.floor(Math.random() * squares.length);
      let square1 = squares[index1];
      let square2 = squares[index2];
      let coords1 = {x: square1.x, y: square1.y};
      let coords2 = {x: square2.x, y: square2.y};

      square1.x = coords2.x;
      square1.y = coords2.y;
      square2.x = coords1.x;
      square2.y = coords1.y;
    }

    return squares;
  }

  render() {
    return (
        <div
        className="puzzle"
        style={{
          width: this.state.puzzleWidth,
          height: this.state.puzzleHeight,
        }}
        >
          <div
          className="background"
          style={{
            backgroundImage: `url(${this.state.img})`,
            backgroundSize: `${this.state.puzzleWidth}px ${this.state.puzzleHeight}px`
          }}
          />
          {this.state.squares.map((square, index) => {
            let style = {
              top: square.y,
              left: square.x,
              width: square.style.width,
              height: square.style.height,
              backgroundImage: square.style.backgroundImage,
              backgroundPosition: square.style.backgroundPosition,
              backgroundSize: square.style.backgroundSize,
              opacity: square.style.opacity,
              zIndex:  square.style.zIndex
            };

            return (
              <div
              className="square"
              key={index}
              style={style}
              onClick={() => {this.handleClick(index)}}
              />
            );
          })}
        </div>
    );
  }
}

export default App;
