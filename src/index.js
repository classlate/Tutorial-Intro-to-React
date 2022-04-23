import React from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={props.style}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props)
  // }
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        style={{ color: this.props.winLine.includes(i) ? '#f00' : '#000' }}
      />
    )
  }

  render() {
    let i = 0
    const grid = (row, col) => {
      return Array(row).fill(null).map(() => {
        return (
          <div className="board-row">
            {
              Array(col).fill(null).map(() => this.renderSquare(i++))
            }
          </div>
        )
      })
    }
    
    return (
      <div>
        {grid(3, 3)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          x: null,
          y: null,
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      upSort: false,
      winLine: [],
    }
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    const winner = calculateWinner(current.squares)

    // 出现胜者或已被落棋则直接返回
    if (winner || squares[i]) {
      winner && this.setState({ winLine: winner[1]})
      return
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    const x = i % 3 + 1
    const y = Math.floor((i / 3 + 1))
    this.setState({
      history: history.concat([{
        squares,
        x,
        y,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpTo(step) {
    console.log(step)
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const x = this.state.history[move].x
      const y = this.state.history[move].y
      const desc = move
        ? `Go to move #${move}, {${x}, ${y}}`
        : 'Go to game start'

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={move === this.state.stepNumber ? 'current-replay-step' : ''}
          >
            {desc}
          </button>
        </li>
      )
    })
    const movesReverse = moves.slice().reverse()
    
    const status = winner
      ? `Winner: ${winner[0]}`
      : history.length === 10
      ? `No Winner`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLine={winner?.[1] ?? []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <span style={{ color: (winner || history.length ===10) ? '#f00' : '#000' }}>{status}</span>
            <button
              style={{ marginLeft: '8px', padding: '0 8px', }}
              onClick={() => {this.setState({ upSort: !this.state.upSort})}}
            >↓</button>
          </div>
          <ol>{this.state.upSort ? movesReverse : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

function calculateWinner(squares) {
  // console.log(squares)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
