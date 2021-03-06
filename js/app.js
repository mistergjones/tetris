document.addEventListener("DOMContentLoaded", () => {
    // TODO: we can also get the grid size from user
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

    // no need to type 200 divs :)
    const grid = createGrid();
    let squares = Array.from(grid.querySelectorAll("div"));
    const startBtn = document.querySelector(".button");
    const hamburgerBtn = document.querySelector(".toggler");
    const menu = document.querySelector(".menu");
    const span = document.getElementsByClassName("close")[0];
    const scoreDisplay = document.querySelector(".score-display");
    const linesDisplay = document.querySelector(".lines-score");
    let currentIndex = 0;
    let currentRotation = 0;
    const width = 10;
    let score = 0;
    let lines = 0;
    let timerId;
    let nextRandom = 0;
    const colors = [
        "url(images/blue_block.png)",
        "url(images/pink_block.png)",
        "url(images/purple_block.png)",
        "url(images/peach_block.png)",
        "url(images/yellow_block.png)",
        "url(images/pink_block.png)",
        "url(images/green_block.png)",
    ];

    // to ensure a t piece cannot rotate outside of the grid, a flag status
    var canIrotate = null;
    var canLrotate;

    function createGrid() {
        // the main grid
        let grid = document.querySelector(".grid");
        for (let i = 0; i < GRID_SIZE; i++) {
            let gridElement = document.createElement("div");

            grid.appendChild(gridElement);
        }

        // set base of grid
        for (let i = 0; i < GRID_WIDTH; i++) {
            let gridElement = document.createElement("div");
            gridElement.setAttribute("class", "block3");
            grid.appendChild(gridElement);
        }

        let nextGrid = document.querySelector(".next-grid");
        // Since 16 is the max grid size in which all the Tetrominoes
        // can fit in we create one here
        for (let i = 0; i < 16; i++) {
            let gridElement = document.createElement("div");
            nextGrid.appendChild(gridElement);
        }
        return grid;
    }

    //assign functions to keycodes
    function control(e) {
        if (e.keyCode === 39) moveright();
        else if (e.keyCode === 38) {
            // check to see if the shape can rotate whilst at the edges.
            if (canIrotate === true) {
                rotate();
                canLrotate = false;
            }
        } else if (e.keyCode === 37) moveleft();
        else if (e.keyCode === 40) moveDown();
    }

    // the classical behavior is to speed up the block if down button is kept pressed so doing that
    document.addEventListener("keydown", control);

    //The Tetrominoes
    const lTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
        [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
    ];

    // the scond l Tetromnio
    const gTetromino = [
        [1, 2, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
    ];

    const zTetromino = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    ];
    // the second z tetromnio
    const z2Tetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH, GRID_WIDTH * 2],
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH, GRID_WIDTH * 2],
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
    ];

    const tTetromino = [
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
        [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ];

    const oTetromino = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    ];

    const iTetromino = [
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    ];

    // array pos: 1=lTet, 2=zTet, 3=tTet, 4=oTet, 5=iTet, 6=gTet, 7=z2Tet
    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
        gTetromino,
        z2Tetromino,
    ];

    //Randomly Select Tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    //move the Tetromino moveDown
    let currentPosition = 4;
    //draw the shape
    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("block");
            squares[currentPosition + index].style.backgroundImage =
                colors[random];
        });
    }

    //undraw the shape
    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("block");
            squares[currentPosition + index].style.backgroundImage = "none";
        });
    }

    //move down on loop
    function moveDown() {
        undraw();
        currentPosition = currentPosition += width;
        draw();
        freeze();
    }

    startBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    // these functions prevent a user from rotation if the shape is at each each of the grid. This will prevent bleeding on the other side.
    function canITetrominoRotateRight() {
        if (currentPosition % 10 > 6) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canITetrominoRotateLeft() {
        if (currentPosition % 10 === 9 || currentPosition % 10 === 7) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }
    function canLTetrominoRotateRight() {
        if (currentPosition % 10 === 8) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        console.log(currentPosition, canIrotate);
        return canIrotate;
    }

    function canLTetrominoRotateLeft() {
        if (currentPosition % 10 === 9) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        console.log(currentPosition, canIrotate);

        return canIrotate;
    }

    function canTTetrominoRotateRight() {
        // console.log(currentPosition);
        if (currentPosition % 10 === 8) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canTTetrominoRotateLeft() {
        console.log(currentPosition);
        if (currentPosition % 10 === 9) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canZTetrominoRotateRight() {
        console.log(currentPosition);
        if (currentPosition % 10 === 8) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canZTetrominoRotateLeft() {
        console.log(currentPosition);
        if (currentPosition % 10 === 9) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canGTetrominoRotateRight() {
        console.log(currentPosition);
        if (currentPosition % 10 === 8) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        console.log(currentPosition, canIrotate);
        return canIrotate;
    }

    function canGTetrominoRotateLeft() {
        if (currentPosition % 10 === 9) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        console.log(currentPosition, canIrotate);

        return canIrotate;
    }

    function canZ2TetrominoRotateRight() {
        console.log(currentPosition);
        if (currentPosition % 10 === 8) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    function canZ2TetrominoRotateLeft() {
        console.log(currentPosition);
        if (currentPosition % 10 === 9) {
            canIrotate = false;
        } else {
            canIrotate = true;
        }
        return canIrotate;
    }

    //move left and prevent collisions with shapes moving left
    function moveright() {
        undraw();
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        if (!isAtRightEdge) currentPosition += 1;

        // determine if we need to prevent the shape from rotation at each edge.
        switch (random) {
            case 0: // let tet
                canLTetrominoRotateRight();
                break;
            case 1: // z tet
                canZTetrominoRotateRight();
                break;
            case 2: // t tet
                canTTetrominoRotateRight();
                break;
            case 3: // square block
                break;
            case 4:
                canITetrominoRotateRight();
                break;
            case 5:
                canGTetrominoRotateRight();
                break;
            case 6:
                canZ2TetrominoRotateRight();
                break;
        }

        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("block2")
            )
        ) {
            currentPosition -= 1;
        }
        draw();
    }

    //move left and prevent collisions with shapes moving right
    function moveleft() {
        undraw();
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        );

        if (!isAtLeftEdge) currentPosition -= 1;
        // determine if we need to prevent the shape from rotation at each edge.
        switch (random) {
            case 0:
                canLTetrominoRotateLeft();
                break;
            case 1:
                canZTetrominoRotateLeft();
                break;
            case 2:
                canTTetrominoRotateLeft();
                break;
            case 3: // square block
                break;
            case 4:
                canITetrominoRotateLeft();
                break;
            case 5:
                canGTetrominoRotateLeft();
                break;
            case 6:
                canZ2TetrominoRotateLeft();
                break;
        }

        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("block2")
            )
        ) {
            currentPosition += 1;
        }
        draw();
    }

    //freeze the shape
    function freeze() {
        // if block has settled
        if (
            current.some(
                (index) =>
                    squares[currentPosition + index + width].classList.contains(
                        "block3"
                    ) ||
                    squares[currentPosition + index + width].classList.contains(
                        "block2"
                    )
            )
        ) {
            // make it block2
            current.forEach((index) =>
                squares[index + currentPosition].classList.add("block2")
            );
            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }
    freeze();

    //Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    //Game Over
    function gameOver() {
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("block2")
            )
        ) {
            scoreDisplay.innerHTML = "end";
            clearInterval(timerId);
        }
    }

    //show next tetromino in scoreDisplay
    const displayWidth = 4;
    const displaySquares = document.querySelectorAll(".next-grid div");
    let displayIndex = 0;

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetromino */,
        [
            0,
            displayWidth,
            displayWidth + 1,
            displayWidth * 2 + 1,
        ] /* zTetromino */,
        [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetromino */,
        [0, 1, displayWidth, displayWidth + 1] /* oTetromino */,
        [
            1,
            displayWidth + 1,
            displayWidth * 2 + 1,
            displayWidth * 3 + 1,
        ] /* iTetromino */,
        [1, 2, displayWidth + 2, displayWidth * 2 + 2], //gTet
        [1, displayWidth + 1, displayWidth, displayWidth * 2], //z2Tet
    ];

    function displayShape() {
        displaySquares.forEach((square) => {
            square.classList.remove("block");
            square.style.backgroundImage = "none";
        });
        smallTetrominoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add("block");
            displaySquares[displayIndex + index].style.backgroundImage =
                colors[nextRandom];
        });
    }

    //Add score
    function addScore() {
        for (
            currentIndex = 0;
            currentIndex < GRID_SIZE;
            currentIndex += GRID_WIDTH
        ) {
            const row = [
                currentIndex,
                currentIndex + 1,
                currentIndex + 2,
                currentIndex + 3,
                currentIndex + 4,
                currentIndex + 5,
                currentIndex + 6,
                currentIndex + 7,
                currentIndex + 8,
                currentIndex + 9,
            ];
            if (
                row.every((index) =>
                    squares[index].classList.contains("block2")
                )
            ) {
                score += 10;
                lines += 1;
                scoreDisplay.innerHTML = score;
                linesDisplay.innerHTML = lines;
                row.forEach((index) => {
                    squares[index].style.backgroundImage = "none";
                    squares[index].classList.remove("block2") ||
                        squares[index].classList.remove("block");
                });
                //splice array
                const squaresRemoved = squares.splice(currentIndex, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => grid.appendChild(cell));
            }
        }
    }

    //Styling eventListeners
    hamburgerBtn.addEventListener("click", () => {
        menu.style.display = "flex";
    });
    span.addEventListener("click", () => {
        menu.style.display = "none";
    });
});
