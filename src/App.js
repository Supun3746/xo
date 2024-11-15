import { useState } from "react";

function Square({ value, onSquareClick, clsName }) {
  return (
    <button className={clsName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [win, setWin] = useState(Array(3));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      setWin(winner);
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else if (!squares.includes(null)) {
    status = "Nothing";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function createBoard(cols, row) {
    const res = [];
    for (let i = 0; i < row; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const index = i * cols + j;
        row.push(
          <Square
            key={index}
            value={squares[index]}
            clsName={win && !win.includes(index) ? "square" : "square-win"}
            onSquareClick={() => handleClick(index)}
          />
        );
      }
      res.push(
        <div key={i} className="board-row">
          {row}
        </div>
      );
    }
    return res;
  }
  return (
    <>
      <div className="status">{status}</div>
      {createBoard(3, 3)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isReserved, setIsReserved] = useState(false);
  const squaresToCoord = {
    6: "1:1",
    3: "1:2",
    0: "1:3",
    7: "2:1",
    4: "2:2",
    1: "2:3",
    8: "3:1",
    5: "3:2",
    2: "3:3",
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function createHistory(flag = true) {
    const moves = history.map((squares, move) => {
      let description;
      if (move > 0) {
        const currentArr = history[move]
          .map((item, index) =>
            history[move][index] !== history[move - 1][index] ? index : -1
          )
          .filter((item) => item !== -1);
        console.log(currentArr);
        description = squaresToCoord[currentArr[0]];
        // description = typeof Number(currentArr);
      } else {
        description = "Go to game start";
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });
    return <ol>{flag ? moves : moves.reverse()}</ol>;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">{createHistory(!isReserved)}</div>
      <div className="reverse-history">
        <button
          onClick={() => {
            setIsReserved((prev) => !prev);
          }}
        >
          Reverse moves
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
      return [squares[a], a, b, c];
    }
  }
  return null;
}
