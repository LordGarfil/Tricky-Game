/* Clases */

let board = class {
  constructor(width, height) {
    this.items = [];
    this.xLength = 3; //Inicio del trazo de la primera linea horizontal
    this.yLength = 3; //Inicio del trazo de la primera linea vertical
    this.xStroke = width / 3; //Inicio del trazo de la primera linea vertical
    this.yStroke = height / 3; //Inicio del trazo de la primera linea horizontal
    this.width = width;
    this.height = height;
    this.addedPosition = [];
    this.pos = [
      //Coordenas
      {
        x: 50,
        y: 140,
        val: 1,
      },
      {
        x: 250,
        y: 140,
        val: 2,
      },
      {
        x: 450,
        y: 140,
        val: 3,
      },
      {
        x: 50,
        y: 340,
        val: 4,
      },
      {
        x: 250,
        y: 340,
        val: 5,
      },
      {
        x: 450,
        y: 340,
        val: 6,
      },
      {
        x: 50,
        y: 540,
        val: 7,
      },
      {
        x: 250,
        y: 540,
        val: 8,
      },
      {
        x: 450,
        y: 540,
        val: 9,
      },
    ];
  }
};

/* Inicialización */

var ctx;
var started = false;
var winner;

//Object instance of the board class
var objBoard = new board(600, 600);
const htmlCanva = document.getElementById("gameCanvas");

//Eventos

window.onload = () => {
  setup();
};

document.getElementById("btnStart").onclick = () => {
  resetBoardItems(objBoard);
  initializeItems();
  draw(10);
  console.clear();
  console.log(objBoard);
  changeButtonValue();
};

document.onresize = () => {
  //AJUSTAR TAMAÑO DEL CANVAS
};

/* FUNCIONES */

function setup() {
  ctx = htmlCanva.getContext("2d");
  htmlCanva.width = objBoard.width;
  htmlCanva.height = objBoard.height;
}

//Devuelve los elementos a su estado original
function initializeItems() {
  for (var i = 0; i < objBoard.xLength * objBoard.yLength; i++) {
    objBoard.items[i] = {
      val: "",
    };
    objBoard.addedPosition[i] = "";
  }
}

//Dibuja las lineas del tablero
function drawBoardLines() {
  for (let x = 0; x < objBoard.xLength - 1; x++) {
    //Se crearan 2 lineas horizontales
    ctx.moveTo(0, objBoard.xStroke); //Coordenadas donde empezara el trazo de la linea
    ctx.lineTo(objBoard.width, objBoard.xStroke); //Coordenadas donde terminara el trazo de la linea
    ctx.stroke(); //Se traza la linea
    objBoard.xStroke = objBoard.xStroke * 2; //Se mueve el inicio del trazo de la linea vertical, para trazar la segunda linea
  }
  for (let y = 0; y < objBoard.yLength - 1; y++) {
    //Se crearan 2 lineas verticales
    ctx.moveTo(objBoard.yStroke, 0);
    ctx.lineTo(objBoard.yStroke, objBoard.height);
    ctx.stroke();
    objBoard.yStroke = objBoard.yStroke * 2;
  }
}

//Genera el array de letras (X y Y)
function randomLetter() {
  var result = ["X", "O", "X", "O", "X", "O", "X", "O", "X"];
  return result;
}

function randomPosition(count, ary = []) {
  //Funcion recursiva que se ejecuta n numero de veces y afecta a un array
  //Genera una posicion al azar entre un rango de numeros ( Min y Max)
  var min = 1;
  var max = 10;
  var tempRes = Math.floor(Math.random() * (max - min)) + min; //Numero aleatorio

  if (count == 1) {
    //Verifica que la funcion haya llegado a su iteración final
    return 1;
  } else {
    if (!ary.some((element) => tempRes == element)) {
      ary[10 - count] = tempRes;
      randomPosition(count - 1, ary);
    } else if (ary.some((element) => tempRes == element)) {
      randomPosition(count, ary);
    }
  }
}

//Organiza los items de manera ascendente en sus posiciones
function sortItems() {
  objBoard.items.sort(function (a, b) {
    if (a.pos > b.pos) {
      return 1;
    }
    if (a.pos < b.pos) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
}

//Agrega la letra y la posicion a cada item
function generateItems(n) {
  var te = n;

  if (n == 1) {
    let letter = randomLetter();
    objBoard.items[10 - te] = {
      pos: objBoard.addedPosition[10 - te],
      val: letter[10 - te],
    };
    return;
  } else {
    let letter = randomLetter();
    objBoard.items[10 - te] = {
      pos: objBoard.addedPosition[10 - te],
      val: letter[10 - te],
    };
    generateItems(n - 1);
  }
}

//Restaura los valores del tablero
function resetBoardItems(board = []) {
  board.items = [];
  board.xStroke = board.width / 3;
  board.yStroke = board.height / 3;
  htmlCanva.width = htmlCanva.width;
}

//Al haber pulsado por primera vez el boton Start su valor cambia a Resetear
function changeButtonValue() {
  let btn = document.getElementById("btnStart");
  btn.value = "Reset";
}

//Funcion recursiva que dibuja las letras en el tablero
function draw(count) {
  var currentPos = 10 - count;
  var itemPos;
  var velocity = 1000;

  //Verifica que sea la ultima iteracion
  if (count == 1) {
    sortItems();
    setTimeout(() => {
      alert("Winner " + winner);
    }, 500);
    return;
  } else if (count == 10) {
    //Verifica la primera iteracción
    drawBoardLines();
    ctx.font = "130px Arial";
    setTimeout(() => {
      randomPosition(10, objBoard.addedPosition);
      generateItems(10);
      itemPos = objBoard.items[currentPos].pos;
      ctx.fillText(
        objBoard.items[currentPos].val,
        objBoard.pos[itemPos - 1].x,
        objBoard.pos[itemPos - 1].y
      );
      draw(count - 1);
    }, velocity);
  } else if (count == 9) {
    setTimeout(() => {
      winner = checkWinner();
      itemPos = objBoard.items[currentPos].pos;
      ctx.fillText(
        objBoard.items[currentPos].val,
        objBoard.pos[itemPos - 1].x,
        objBoard.pos[itemPos - 1].y
      );
      draw(count - 1);
    }, velocity);
  } else if (count < 9) {
    setTimeout(() => {
      itemPos = objBoard.items[currentPos].pos;
      ctx.fillText(
        objBoard.items[currentPos].val,
        objBoard.pos[itemPos - 1].x,
        objBoard.pos[itemPos - 1].y
      );

      draw(count - 1);
    }, velocity);
  }
}

//Verifica si alguno de los jugadores ha ganado
function checkWinner() {
  var winner = false;

  //Verifica las horizontales
  if (
    objBoard.items[0].val != null &&
    objBoard.items[1].val != null &&
    objBoard.items[2].val != null &&
    objBoard.items[0].val == objBoard.items[1].val &&
    objBoard.items[1].val == objBoard.items[2].val
  ) {
    winner = objBoard.items[0].val;
  } else if (
    objBoard.items[3].val != null &&
    objBoard.items[4].val != null &&
    objBoard.items[5].val != null &&
    objBoard.items[3].val == objBoard.items[4].val &&
    objBoard.items[4].val == objBoard.items[5].val
  ) {
    winner = objBoard.items[3].val;
  } else if (
    objBoard.items[6].val != null &&
    objBoard.items[7].val != null &&
    objBoard.items[8].val != null &&
    objBoard.items[6].val == objBoard.items[7].val &&
    objBoard.items[7].val == objBoard.items[8].val
  ) {
    winner = objBoard.items[6].val;
  } else if (
    objBoard.items[0].val != null &&
    objBoard.items[3].val != null &&
    objBoard.items[6].val != null &&
    objBoard.items[0].val == objBoard.items[3].val &&
    objBoard.items[3].val == objBoard.items[6].val
  ) {
    //Verifica las verticales
    winner = objBoard.items[0].val;
  } else if (
    objBoard.items[1].val != null &&
    objBoard.items[4].val != null &&
    objBoard.items[7].val != null &&
    objBoard.items[1].val == objBoard.items[4].val &&
    objBoard.items[4].val == objBoard.items[7].val
  ) {
    winner = objBoard.items[1].val;
  } else if (
    objBoard.items[2].val != null &&
    objBoard.items[5].val != null &&
    objBoard.items[8].val != null &&
    objBoard.items[2].val == objBoard.items[5].val &&
    objBoard.items[5].val == objBoard.items[8].val
  ) {
    winner = objBoard.items[2].val;
  } else if (
    // Verifica las diagonales
    objBoard.items[0].val != null &&
    objBoard.items[4].val != null &&
    objBoard.items[8].val != null &&
    objBoard.items[0].val == objBoard.items[4].val &&
    objBoard.items[4].val == objBoard.items[8].val
  ) {
    winner = objBoard.items[0].val;
  } else if (
    objBoard.items[2].val != null &&
    objBoard.items[4].val != null &&
    objBoard.items[6].val != null &&
    objBoard.items[2].val == objBoard.items[4].val &&
    objBoard.items[4].val == objBoard.items[6].val
  ) {
    winner = objBoard.items[2].val;
  } else {
    winner = false;
  }

  return winner;
}
