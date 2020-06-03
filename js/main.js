//////////////////////////////////////////////////////////////////////////
////////////--ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ--/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
var Dimension = 5;
var GameField = []; //МАССИВ ЗАПОЛНЕНННОСТЬ ИГРОВОГО ПОЛЯ
var Chain = []; //МАССИВ ИНДЕКСОВ ПОЛЕЙ ЦЕПОЧКИ
var FirstSquareIsSelected = false; //false - выбранная - первая; true - выбранная - последующая, не первая 
var SelectSquareArroundLast = false; //выбранная ячейка около последней
var GameFieldIsFull = false; //заполненность игрового поля, true - победа
var canvas = document.getElementById("c1");
var ctx = canvas.getContext("2d");
var NumberOfRed = 1; //Количество красных ячеек
var X_last, Y_last; //координаты последней ячейки в цепочке
var i_last, j_last; //индексы последней ячейки в цепочке в массиве GameField
var X_slct, Y_slct; //координаты выбравнной ячейки 
var i_slct, j_slct; //индексы выбравнной ячейки в массиве GameField
var ArrRed = []; //Массив индексов красных ячеек ArrRed[0..NumberOfRed][0..1]
var NNN; //Количество заполненных полей
//////////////////////////////////////////////////////////////////////////
////////////--ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ--/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
//////////////--ОБЪЯВЛЕНИЕ ФУНКЦИЙ--/////////////////////////////
/////////////////////////////////////////////////////////////////

///////////--ОТРИСОВКА ИГРОВОГО ПОЛЯ--/////////////////////////////
function DrawGameField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var img = new Image();
  img.onload = function () {
    for (var i = 0; i < Dimension; i++) {
      for (var j = 0; j < Dimension; j++) {
        ctx.drawImage(img, 50 * i, 50 * j, 50, 50);
      }
    }
  };
  img.src = "img/Square.jpg";
}
///////////--ОТРИСОВКА ИГРОВОГО ПОЛЯ--/////////////////////////////

///////////////--ОТРИСОВКА СТРЕЛОК--//////////////////
function DrawArray(i, j) {
  //i, j - last
  ///--ВВЕРХ

  if (j > 0) {
    if (GameField[j - 1][i] == 0) {
      var img4 = new Image();
      img4.onload = function () {
        ctx.drawImage(img4, i * 50, (j - 1) * 50, 50, 50);
      }
      img4.src = "img/Arrow_Up.svg";
    }
  }
  ///--ВНИЗ
  if (j < Dimension - 1) {
    if (GameField[j + 1][i] == 0) {
      var img5 = new Image();
      img5.onload = function () {
        ctx.drawImage(img5, i * 50, (j + 1) * 50, 50, 50);
      }
      img5.src = "img/Arrow_Down.svg";
    }
  }
  ///--ВПРАВО
  if (i < Dimension - 1) {
    if (GameField[j][i + 1] == 0) {
      var img6 = new Image();
      img6.onload = function () {
        ctx.drawImage(img6, (i + 1) * 50, j * 50, 50, 50);
      }
      img6.src = "img/Arrow_Right.svg";
    }
  }
  ///--ВЛЕВО
  if (i > 0) {
    if (GameField[j][i - 1] == 0) {
      var img7 = new Image();
      img7.onload = function () {
        ctx.drawImage(img7, (i - 1) * 50, j * 50, 50, 50);
      }
      img7.src = "img/Arrow_Left.svg";
    }
  }
}
///////////////--ОТРИСОВКА СТРЕЛОК--//////////////////

////////////////--УДАЛЕНИЕ СТАРЫХ СТРЕЛОК--////////////////
function DeleteOldArrow() {
  for (let j = 0; j < Dimension; j++) {
    for (let i = 0; i < Dimension; i++) {
      if (GameField[j][i] == 0) {
        var img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 50 * i, 50 * j, 50, 50);
        }
        img.src = "img/Square.jpg";
      }
    }
  }
}
////////////////--УДАЛЕНИЕ СТАРЫХ СТРЕЛОК--////////////////


///////////////--ОПРЕДЕЛЕНИЕ ПОБЕДЫ--//////////////////
var GameFieldIsFull = function GameFieldIsFull() {
  var Curr = true;
  for (let j = 0; j < Dimension; j++) {
    for (let i = 0; i < Dimension; i++) {
      if (GameField[j][i] == 0) {
        Curr = false;
      }
    }
  }
  return Curr;
}
///////////////--ОПРЕДЕЛЕНИЕ ПОБЕДЫ--//////////////////

///////////////--ДЕЙСТВИЯ ПРИ ПОБЕДЕ--//////////////////
function YourWin() {
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, 250, 250);
  }
  img.src = "img/Win.svg";
}
///////////////--ДЕЙСТВИЯ ПРИ ПОБЕДЕ--//////////////////

///////////////--СЛЕДУЮЩИЙ ХОД ВОЗМОЖЕН--//////////////
function NextChoiceIsEnable(j,i){
  var Enbl =  false;
  if (j>0) {
    if (GameField[j-1][i] == 0) {
      Enbl = true;
    }
  }
  if (j<Dimension-1) {
    if (GameField[j+1][i] == 0) {
      Enbl = true;
    }
  }
  if (i>0) {
    if (GameField[j][i-1] == 0) {
      Enbl = true;
    }
  }
  if (i<Dimension-1) {
    if (GameField[j][i+1] == 0) {
      Enbl = true;
    }
  }
  return Enbl;
}
///////////////--СЛЕДУЮЩИЙ ХОД ВОЗМОЖЕН--//////////////

///////////////--ДЕЙСТВИЯ ПРИ ПРОИГРЫШЕ--//////////////////
function YourLose() {
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, 250, 250);
  }
  img.src = "img/Lose.svg";
}
///////////////--ДЕЙСТВИЯ ПРИ ПРОИГРЫШЕ--//////////////////



////////////////--НОВАЯ ИГРА--/////////////////////
function New_game() {
  NNN = NumberOfRed;
  /////////--МАССИВ ЗАПОЛНЕНННОСТЬ ИГРОВОГО ПОЛЯ--////////////
  for (let j = 0; j < Dimension; j++) {
    GameField[j] = [];
    for (let i = 0; i < Dimension; i++) {
      GameField[j][i] = 0; //[y,x]
    }
    //console.log(GameField[j]);
  }
  /////////--МАССИВ ЗАПОЛНЕНННОСТЬ ИГРОВОГО ПОЛЯ--////////////

  ////////////--МАССИВ ИНДЕКСОВ ПОЛЕЙ ЦЕПОЧКИ--////////////
  for (var n = 0; n < (Dimension + 1) * (Dimension + 1) - 1; n++) {
    Chain[n] = [0, 0];
  }
  ////////////--МАССИВ ИНДЕКСОВ ПОЛЕЙ ЦЕПОЧКИ--////////////

  FirstSquareIsSelected = false; //false - выбранная - первая; true - выбранная - последующая, не первая 
  SelectSquareArroundLast = false; //выбранная ячейка около последней
  GameFieldIsFull = false; //заполненность игрового поля, true - победа
 
  ///////////--ОТРИСОВКА ИГРОВОГО ПОЛЯ--/////////////////////////////
  DrawGameField();

  //////////////--КРАСНЫЕ ПОЛЯ--/////////////////////
  //Math.floor(Math.random()*8);
  var ArrRed = []; //Массив индексов красных ячеек ArrRed[0..NumberOfRed][0..1]
  for (let j = 0; j < NumberOfRed; j++) {
    ArrRed[j] = [];
    for (let i = 0; i < 2; i++) {
      ArrRed[j][i] = 0;
    }
  }
  for (var i = 0; i < NumberOfRed; i++) {
    if (i == 0) {
      ArrRed[0][0] = Math.floor(Math.random() * Dimension);
      ArrRed[0][1] = Math.floor(Math.random() * Dimension);
    }
    if (i > 0) {
      do {
        ArrRed[i][0] = Math.floor(Math.random() * Dimension);
        ArrRed[i][1] = Math.floor(Math.random() * Dimension);
        var IsDifferent = true; //true - новая, false - повтор
        for (let ii = 0; ii < i; ii++) {
          if (ArrRed[ii][0] == ArrRed[i][0] && ArrRed[ii][1] == ArrRed[i][1]) IsDifferent = false;
        }
      }
      while (IsDifferent == false);
    }
  }
  var imgR = new Image(); //ОТРИСОВКА + ЗАНЕСЕНИЕ В МАССИВ GameField
  imgR.onload = function () {
    for (var i = 0; i < NumberOfRed; i++) {
      GameField[ArrRed[i][1]][ArrRed[i][0]] = 1;
      ctx.drawImage(imgR, 50 * ArrRed[i][0], 50 * ArrRed[i][1], 50, 50);
      console.log(ArrRed[i]);
    }
  }
  imgR.src = "img/Square_Red.jpg";
}
//------------------------------------------------------------------------------

document.querySelector('#c1').onmousedown = function (event) {
  /////////////////--ПОЛУЧЕНИЕ КООРДИНАТ --////////////////////
  event = event || window.event;
  X_slct = Math.floor(event.offsetX / 50) * 50;
  Y_slct = Math.floor(event.offsetY / 50) * 50;
  i_slct = Math.floor(event.offsetX / 50);
  j_slct = Math.floor(event.offsetY / 50);

  /////////////////--ОПРЕДЕЛЕНИЕ - ВЫБРАННАЯ ОКОЛО ПОСЛЕДНЕЙ? --////////////////////
  //SelectSquareArroundLast
  //i_slct j_slct i_last j_last
  if (FirstSquareIsSelected == false)
    SelectSquareArroundLast = true;
  else {
    if (Math.pow(i_slct - i_last, 2) + Math.pow(j_slct - j_last, 2) == 1) SelectSquareArroundLast = true;
    else SelectSquareArroundLast = false;
  }
  console.log('SelectSquareArroundLast = ' + SelectSquareArroundLast);
  console.log('FirstSquareIsSelected = ' + FirstSquareIsSelected);

  ////////////////////////////////////////////////////////////////////////
  if ((FirstSquareIsSelected == false) || (FirstSquareIsSelected == true && GameField[j_slct][i_slct] == 0 && SelectSquareArroundLast == true)) {
    //(Выбрана первая) ИЛИ (Выбрана не первая + Она пустая + Она около последней) 

    DeleteOldArrow(); //Удаление стрелок

    if (FirstSquareIsSelected == false) { //ПЕРВАЯ ЯЧЕЙКА
      var img2 = new Image();
      img2.onload = function () {
        ctx.drawImage(img2, X_slct, Y_slct, 50, 50);
      }
      img2.src = "img/Square_Green.jpg";
      i_last = i_slct;
      j_last = j_slct;
      DrawArray(i_last, j_last);
      console.log('i_last = ' + i_last + '; j_last = ' + j_last);
      GameField[j_slct][i_slct] = 1;
      FirstSquareIsSelected = true;
      NNN = NNN + 1;
    }
    //////////////--ЗАПОЛНЕНИЕ ПОЛЕЙ--///////////////////
    if (FirstSquareIsSelected == true) { //НЕ ПЕРВАЯ ЯЧЕЙКА

      //DeleteOldArrow(); //Удаление стрелок

      ////////////--ЗАПОЛНЕНИЕ ВВЕРХ--////////////////////
      if (i_slct == i_last && j_slct - j_last == -1) {
        var img333 = new Image();
        img333.onload = function () {
          var jj = j_slct;
          while (GameField[jj][i_slct] == 0) {
            ctx.drawImage(img333, 50 * i_slct, 50 * jj, 50, 50);
            GameField[jj][i_slct] = 1;
            j_last = jj;
            NNN = NNN + 1;
            jj--;
            if (jj === -1) {
              j_last = 0;
              break;
            }
          } //WHILE
          i_last = i_slct;
                    
          console.log('NextChoiceIsEnable - ' + NextChoiceIsEnable(j_last,i_last));
          if (NextChoiceIsEnable(j_last,i_last)==false && NNN < Dimension * Dimension) {
            YourLose();
           }
          if (NNN == Dimension * Dimension) {
            YourWin();
          }

          if (NNN < Dimension * Dimension) {
            DrawArray(i_last, j_last);
          }
         
        } //ONLOAD
        img333.src = "img/Square_Yellow.jpg";
      } //ЗАПОЛНЕНИЕ ВВЕРХ

      ////////////--ЗАПОЛНЕНИЕ ВНИЗ--////////////////////
      if (i_slct == i_last && j_slct - j_last == 1) {
        var img333 = new Image();
        img333.onload = function () {
          var jj = j_slct;
          while (GameField[jj][i_slct] == 0) {
            ctx.drawImage(img333, 50 * i_slct, 50 * jj, 50, 50);
            GameField[jj][i_slct] = 1;
            NNN = NNN + 1;
            j_last = jj;
            jj++;
            if (jj === Dimension) {
              j_last = Dimension - 1;
              break;
            }
          }
          if (NNN == Dimension * Dimension) {
            YourWin();
          }
          i_last = i_slct;
          console.log('NextChoiceIsEnable - ' + NextChoiceIsEnable(j_last,i_last));
          if (NextChoiceIsEnable(j_last,i_last)==false && NNN < Dimension * Dimension) {
            YourLose();
           }
          if (NNN < Dimension * Dimension) {
            DrawArray(i_last, j_last);
          }
          
        }
        img333.src = "img/Square_Yellow.jpg";
      }
      ////////////--ЗАПОЛНЕНИЕ ВПРАВО--////////////////////
      if (j_slct == j_last && i_slct - i_last == 1) {
        var img333 = new Image();
        img333.onload = function () {
          var ii = i_slct;
          while (GameField[j_slct][ii] == 0) {
            ctx.drawImage(img333, 50 * ii, 50 * j_slct, 50, 50);
            GameField[j_slct][ii] = 1;
            NNN = NNN + 1;
            if (NNN == Dimension * Dimension) {
              YourWin();
            }
            i_last = ii;
            ii++;
            if (ii === Dimension) {
              i_last = Dimension - 1;
              break;
            }
          }
          if (NNN == Dimension * Dimension) {
            YourWin();
          }
          j_last = j_slct;
          console.log('NextChoiceIsEnable - ' + NextChoiceIsEnable(j_last,i_last));
          if (NextChoiceIsEnable(j_last,i_last)==false && NNN < Dimension * Dimension) {
            YourLose();
           }
          if (NNN < Dimension * Dimension) {
            DrawArray(i_last, j_last);
           }
           
        }
        img333.src = "img/Square_Yellow.jpg";
      }
      ////////////--ЗАПОЛНЕНИЕ ВЛЕВО--////////////////////
      if (j_slct == j_last && i_slct - i_last == -1) {
        var img333 = new Image();
        img333.onload = function () {
          var ii = i_slct;
          while (GameField[j_slct][ii] == 0) {
            ctx.drawImage(img333, 50 * ii, 50 * j_slct, 50, 50);
            GameField[j_slct][ii] = 1;
            NNN = NNN + 1;
            i_last = ii;
            ii--;
            if (ii === -1) {
              i_last = 0;
              break;
            }
          } //while
          j_last = j_slct;
          if (NNN == Dimension * Dimension) {
            YourWin();
          }
          console.log('NextChoiceIsEnable - ' + NextChoiceIsEnable(j_last,i_last));
          if (NNN < Dimension * Dimension) {
            DrawArray(i_last, j_last);
          }
          if (NextChoiceIsEnable(j_last,i_last)==false && NNN < Dimension * Dimension) {
           YourLose();
          }
        } //onload
        img333.src = "img/Square_Yellow.jpg";
      } //ЗАПОЛНЕНИЕ ВЛЕВО
      } //НЕ ПЕРВАЯ ЯЧЕЙКА
  }
} //onmousedown

window.onload = New_game();
document.getElementById("input").addEventListener("click", New_game);
