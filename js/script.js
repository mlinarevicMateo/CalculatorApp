var control = 0; //Control follows in which row of screen user is typing
var controlMinus = 0;
/* Controls for operations, to be sure that user can't
insert more than one operation */
var controlBackspace = 0; // Controls if backspace removes digit or whole number
var firstRow, secondRow, resultRow; //Representing three columns in calculator calcScreen
firstRow = document.getElementById("firstRow");
secondRow = document.getElementById("secondRow");
resultRow = document.getElementById("resultRow");
var line = document.getElementById("line");

var buttons = document.getElementsByTagName('button'); //Array of buttons
//Adding event listeners to each element in 'buttons' array
for (var i of buttons) {
  i.addEventListener("click", (event) => {
    switch (event.target.value) {
      case "backspace":
        backspace();
        break;
      case "C":
        clearScreen();
        disableButton("equals", false);
        controlBackspace = 0;
        break;
      case "=":
        if (secondRow.innerHTML.length === 2) {
          if (secondRow.innerHTML[1] !== "-") {
            //to be able to operate with negative numbers, and not to get error if operating with just a "-" sign
            addLine("black");
            calculate();
            disableButton("equals", true);
            controlBackspace = 1;
          }
        } else {
          addLine("black");
          calculate();
          disableButton("equals", true);
          controlBackspace = 1;
        }
        break;
      default:
        disableButton("equals", false);
        controlRow(control, event.target.value);
        controlBackspace = 0;
        break;
    }
  });
}
//backspace button on keyboard listener
document.addEventListener("keydown", (event) => {
  if (event.keyCode === 8) {
    backspace();
  }
});
//line between second and thirdt row
function addLine(classToAdd) {
  //by toggling a class, did you mean something like this? haha
  // could do the same thing with jquery, but not sure can I use it
  if(classToAdd === "green"){
  line.classList.add(classToAdd);
  line.classList.remove("black");
  }
  else{
    line.classList.add(classToAdd);
    line.classList.remove("green");
  }
}
//controls in which row user is typing based on control variable
function controlRow(control, value) {
  switch (control) {
    case 0:
      //Screen is clear, insert into last row
      controlValue(resultRow, value);
      break;
    case 1:
      /* Operation clicked, insert into second rows, number from last row
      moves into first row */
      controlValue(secondRow, value);
      break;
  }
}
//do preety much all the work with calling functions based on what user has pressed
function controlValue(row, value) {
  switch (value) {
    case "+":
    case "*":
    case "/":
      //user is allowed to use them only at beggining of second row
      if (row.innerHTML !== "" && row.innerHTML !== "-" && row.innerHTML !== "." && row.innerHTML[1] !== "-") {
        if (row.innerHTML !== "+" && row.innerHTML !== "×" && row.innerHTML !== "÷") {
          control = 1;
          calculate();
          resultToFirst();
          secondRow.innerHTML = displayOperation(value);
          addLine("green");
        }
        else {
          //if user clicked one operation and wants to change it, it changes without deleting
          if (row.innerHTML.length === 1 && row.innerHTML !== value) {
            secondRow.innerHTML = displayOperation(value);
          }
        }
      } else if (secondRow.innerHTML === "-") {
        //if user clicked one operation and wants to change it, it changes without deleting, for minus
        secondRow.innerHTML = displayOperation(value);
      }
      else if (row.id === "secondRow" && secondRow.innerHTML.match(/[0-9]/gi) !== null) {
        //if there are some numbers in second row, calculate result, then add operation to second row
        calculate();
        resultToFirst();
        resetValue(resultRow);
        secondRow.innerHTML = value;
      }
      break;
      //minus is specific because there are negative numbers, so there are some special conditions for that
    case "-":
      if (row.innerHTML.length === 0) {
        //if empty
        row.innerHTML = "-";
      } else if (row.id === "secondRow" && secondRow.innerHTML.length === 1) {
        //if only the operation is in second row
        row.innerHTML += "-";
      } else if (row.id === "resultRow" && resultRow.innerHTML !== "-") {
        //condition to go to second row
        resultToFirst();
        secondRow.innerHTML = "-";
        control = 1;
      } else if (row.id === "secondRow" && secondRow.innerHTML.match(/[0-9]/gi) !== null) {
        //if there are some numbers in second row, calculate result, then add - to second row
        calculate();
        resultToFirst();
        resetValue(resultRow);
        secondRow.innerHTML = "-";
      }
      break;

    case ".":
      //making sure that in curently active row is no dots, than insert one
      if (row.innerHTML.indexOf(".") === -1) {
        if (firstRow.innerHTML !== "" && secondRow.innerHTML !== "" &&
          resultRow.innerHTML !== "") {
          break;
        } else {
          row.innerHTML += ".";
        }
      }
      disableButton("operation", true); //to be sure that user can't call calculate() function, right after pressing "." buttons
      //enabling operations after user clicks on any number, or clear
      break;

    default:
      //when number is pressed, if number is more than 17 digits long, stop inserting
      if (row.innerHTML.length < 17) {
        // if equals was pressed before, than if any of numbers is pressed, reset calculator
        if (firstRow.innerHTML !== "" && secondRow.innerHTML !== "" && resultRow.innerHTML !== "") {
          clearScreen();
          resultRow.innerHTML = value;
        }
        //in any other case, just write pressed value in currently active row
        else {
          row.innerHTML += value;
        }
        disableButton("operation", false);
        break;
      }
  }
}

function displayOperation(value) {
  if (value === "/") value = "÷";
  else if (value === "÷") value = "/";
  else if (value === "*") value = "×";
  else if (value === "×") value = "*";
  return value;
}
// Function clearScreen clear all rows and resets control variables
function clearScreen() {
  firstRow.innerHTML = "";
  secondRow.innerHTML = "";
  resultRow.innerHTML = "";
  control = 0;
  disableButton("all", false);
  addLine("green");
}
/* This function moves number from resultRow into firstRow, that happens
  when any operation is clicked */
function resultToFirst() {
  firstRow.innerHTML = resultRow.innerHTML;
  resetValue(secondRow);
  resetValue(resultRow);
}
// clears value of passed row
function resetValue(row) {
  row.innerHTML = "";
}
//calculate function
function calculate() {
  var first = firstRow.innerHTML;
  var operation = displayOperation(secondRow.innerHTML.slice(0, 1));
  var second = secondRow.innerHTML.slice(1);
  var result;
  if (first != "" && second != "" && resultRow.innerHTML === "") {

    first = Number(first);
    second = Number(second);
    switch (operation) {
      case "+":
        //Rounding result on max 7 decimals, result are a bit ugly if there is a lot of numbers after dot
        result = Math.ceil((first + second) * Math.pow(10,7)) / Math.pow(10,7);
        break;
      case "-":
        result = Math.ceil((first - second) * Math.pow(10,7)) / Math.pow(10,7);
        break;
      case "*":
        result = Math.ceil((first * second) * Math.pow(10,7)) / Math.pow(10,7);
        break;
      case "/":
        if (second === 0) {
          clearScreen();
          secondRow.innerHTML = "Err - dividing by 0";
          resultRow.innerHTML = "Press clear";
          disableButton("all", true);
          result = "error"; //setting result to error
        } else {
          result = Math.ceil((first / second) * Math.pow(10,7)) / Math.pow(10,7);
        }
    }
    if(result != "error"){
      //if result is "error", don't go in if-else statement; removing error in line 206 from previous version
      if (result.toString().length > 17) {
        clearScreen();
        secondRow.innerHTML = "Err - out of bounds";
        resultRow.innerHTML = "Press clear";
        disableButton("all", true);
      } else {
        resultRow.innerHTML = result;
      }
  }
  } else if (first != "" && second != "" && resultRow.innerHTML != "") {
    result = resultRow.innerHTML;
    firstRow.innerHTML = result;
    secondRow.innerHTML = operation;
  }
  if (secondRow.innerHTML.length <= 1) {
    //if in second row is no number, don't draw line
    addLine("green");
  }
}
//function to enable/disable buttons by id, if it's needed
function disableButton(id, bool) {
  if (id === "all") {
    //this if is called when error is displayed, so user needs to reset calculator to continue
    var buttonsToDisable = document.getElementsByTagName('button');
    for (var i of buttonsToDisable) {
      if (i.id !== "clearButton") {
        i.disabled = bool;
      }
    }
  } else if(id === "operation"){
      var buttonsToDisable = document.getElementsByClassName('operation');
      for (var i of buttonsToDisable) {
          i.disabled = bool;
      }
  } else{
    //just for one
    document.getElementById(id).disabled = bool;
  }
}

function backspace() {
  if (controlBackspace === 0) {
    //user didn't clicked equals button
    if (resultRow.innerHTML.length !== 0) {
      checkForDot(resultRow);
      resultRow.innerHTML = resultRow.innerHTML.substring(0, resultRow.innerHTML.length - 1);
    } else if (secondRow.innerHTML.length !== 0) {
      addLine("green");
      checkForDot(secondRow);
      secondRow.innerHTML = secondRow.innerHTML.substring(0, secondRow.innerHTML.length - 1);
      if (secondRow.innerHTML.length === 0) {
        //returning number from first row into result row
        resultRow.innerHTML = firstRow.innerHTML;
        resetValue(firstRow);
        control = 0;
      }
    }
  } else {
    //user clicked equals button
    if (resultRow.innerHTML !== "") {
      resetValue(resultRow);
      addLine("green");
    } else{
      controlBackspace = 0;
      backspace();
    }

  }
}

//because (operations are disabled when user clicked ".", I need to enable them if user deletes "."
function checkForDot(row){
  if(row.innerHTML[row.innerHTML.length-1] === "."){
   disableButton("operation", false);
  }
}
