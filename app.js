const gameDisplay = document.querySelector(".gameDisplay");
const gameStatus = document.querySelector(".gameStatus");
const cells = document.querySelectorAll(".cell");
const gameInput = document.querySelector(".gameInput");
const mode = document.querySelector(".mode");

const Person = (name, symbol, isCPU) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  const setName = (newName) => name = newName;
  const getCPU = () => isCPU;
  const setCPU = (cpu) => isCPU = cpu;
  const generateMove = () => {
    let cpuMove = Math.floor(Math.random() * 9);
    while (!gameBoard.isValidMove(cpuMove)) {
      cpuMove = Math.floor(Math.random() * 9);
    }
    return cpuMove;
  }
  return {
    getName,
    getSymbol,
    setName,
    getCPU,
    setCPU,
    generateMove,
  };
};

const gameBoard = (function () {
  const board = Array(9).fill(null);
  const setBoard = (playerChoice, player) => {
    board[playerChoice] = player.getSymbol();
  };
  const getBoard = () => board;
  const resetBoard = () => board.fill(null);
  const isValidMove = (playerChoice) => {
    if (board[playerChoice] === null) {
      return true;
    }
  };
  const isFull = () => {
    isAnyNull = board.some((cell) => cell === null);
    if (!isAnyNull) {
      return true;
    }
  };
  return {
    getBoard,
    setBoard,
    resetBoard,
    isValidMove,
    isFull,
  };
})();

const game = (function () {
  const playerOne = Person(`Player One`, "o", false);
  const playerTwo = Person(`Player Two`, "x", false);
  mode.addEventListener("change", (e) => {
    playerTwo.setCPU(e.target.checked);
  })
  gameInput.addEventListener('submit', (event) => {
    event.preventDefault();
    playerOne.setName(event.target[0].value);
    playerTwo.setName(event.target[1].value)
  })
  let result;
  let player = playerOne;
  const comPlay = () => {
    playerChoice = player.generateMove();
    const selectComDiv = document.getElementById(`${playerChoice}`);
    selectComDiv.innerHTML = `<p>${player.getSymbol()}</p>`;
    gameBoard.setBoard(playerChoice, player);
    result = winningCondition(gameBoard, player.getName());
    if (!result) {
      switchPlayer(player);
    }
  }
  const switchPlayer = (currentPlayer) => {
    player =
      currentPlayer.getSymbol() === playerOne.getSymbol() ? playerTwo : playerOne;
    if (player === playerTwo && playerTwo.getCPU()) {
      setTimeout(comPlay, 500);
    }
    gameStatus.textContent = player.getName();
  };

  const gamePlay = (event) => {
    playerChoice = parseInt(event.target.getAttribute("value"));
    if (gameBoard.isValidMove(playerChoice)) {
      gameBoard.setBoard(playerChoice, player);
      event.target.innerHTML = `<p>${player.getSymbol()}</p>`;
      result = winningCondition(gameBoard, player.getName());
      if (!result && playerTwo.getCPU()) {
        switchPlayer(player);
      } else if (!result) {
        switchPlayer(player);
        gameStatus.textContent = player.getName();
      }
    }
  };

  //public method
  const gameStart = () => {
    gameDisplay.style.display = "block";
    gameStatus.textContent = player.getName();
    gameDisplay.addEventListener("click", gamePlay);
  };

  const gameStop = () => {
    gameDisplay.removeEventListener("click", gamePlay);
  };

  const gameReset = () => {
    gameBoard.resetBoard();
    player = playerOne;
    gameStatus.textContent = player.getName();
    cells.forEach((cell) => (cell.textContent = ""));
  };

  return {
    gameStart,
    gameStop,
    gameReset,
  };
})();

function winningCondition(board, playerName) {
  let roundWon = false;
  const winningState = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  winningState.forEach((state) => {
    let a = board.getBoard()[state[0]];
    let b = board.getBoard()[state[1]];
    let c = board.getBoard()[state[2]];
    if ((a !== null || b !== null || c !== null) && a === b && b === c) {
      roundWon = true;
    }
  });
  if (roundWon) {
    gameStatus.textContent = `${playerName} has won.`;
    game.gameStop();
    return roundWon;
  }
  if (gameBoard.isFull() && !roundWon) {
    gameStatus.textContent = "It's a tie.";
    return true;
  }
}