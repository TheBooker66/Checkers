var AllNum =  //null - can't be stepped in, 0 - Empty, 1 - Black Pawn, 2 - Red Pawn, 3 - Black King, 4 - Red King
    [
        [null, 1, null, 1, null, 1, null, 1],
        [1, null, 1, null, 1, null, 1, null],
        [null, 1, null, 1, null, 1, null, 1],
        [0, null, 0, null, 0, null, 0, null],
        [null, 0, null, 0, null, 0, null, 0],
        [2, null, 2, null, 2, null, 2, null],
        [null, 2, null, 2, null, 2, null, 2],
        [2, null, 2, null, 2, null, 2, null]
    ];
var firstClickRow, firstClickCol, secondClickRow, secondClickCol, turns = 0, tdNum1, tdNum2, clickCounter = 0; //movement and basics
var tdNum3, pieceEatenByKingID, pieceEatenByKingRow, pieceEatenByKingCol, blackPawnCount = 12, redPawnCount = 12; //eating
var boardSize, name1, name2, showTurn, showBlackPlayerAmount, showRedPlayerAmount;  //show stuff on the screen
var comparePoints = 100, doubleComparePoints = -100, oldComparePoints, RecursionCounter = 1, bestfirstRow, bestfirstCol, bestsecondRow, bestsecondCol, bestmiddleRow, bestmiddleCol, tempTurn = turns; //computer playz
const pawnValue = 1, kingValue = 10, RecursionAmount = 2;

{ //regular play - block scope so I can minimize - like #region
    function BuildingTheBoard() {
        if (screen.width > screen.height)
            boardSize = screen.width / 18;
        else
            boardSize = screen.height / 18;
        var x, y, nameInTable = 0, boardText = "";
        for (x = 0; x < 8; x++) {
            boardText = boardText + " <tr>";
            for (y = 0; y < 8; y++) {
                if ((x + y) % 2 == 0)
                    boardText = boardText + "<td id='" + nameInTable + "'> <img src='BeigeTile.png' width='" + boardSize + "' height=' " + boardSize + "'/> </td>";
                else if (x <= 2) //x == 0 || x == 1 || x == 2
                    boardText = boardText + "<td id='" + nameInTable + "' onclick='PressOnTile(this);' class='canBeClickedOn'> <img src='BlackCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/> </td>";
                else if (x >= 5) //x == 5 || x == 6 || x == 7
                    boardText = boardText + "<td id='" + nameInTable + "' onclick='PressOnTile(this);' class='canBeClickedOn'> <img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/> </td>";
                else if (x == 3 || x == 4)
                    boardText = boardText + "<td id='" + nameInTable + "' onclick='PressOnTile(this);' class='canBeClickedOn'> <img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/> </td>";
                nameInTable++;
            }
            boardText = boardText + " </tr>";
        }
        if (name1 == null || name2 == null) {
            name1 = prompt("What is the first player's name?");
            name2 = prompt("What is the second player's name?");
        }
        if (name1 == "" || name1 == null)
            name1 = "Player 1";
        if (name2 == "" || name2 == null)
            name2 = "Player 2";
        var showName1 = "Player 1 (Black): " + name1;
        var showName2 = "Player 2 (Red): " + name2;
        showTurn = "It is currently " + name1 + "'s turn.";
        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
        document.getElementById("rules").style.width = screen.width / 2 + "px";
        document.getElementById("board").innerHTML = boardText;
        document.getElementById("playerName1").innerHTML = showName1;
        document.getElementById("playerName2").innerHTML = showName2;
        document.getElementById("playerTurn").innerHTML = showTurn;
        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
        //console.log(CountPoints(AllNum));
    }

    function PressOnTile(currentThis) {
        if (turns % 2 == 0) {
            if (clickCounter % 2 == 0) {
                tdNum1 = parseInt(currentThis.id);
                firstClickRow = Math.floor(tdNum1 / 8);
                firstClickCol = tdNum1 % 8;
                if (AllNum[firstClickRow][firstClickCol] == 1)
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackCheckersPawnBorder.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                if (AllNum[firstClickRow][firstClickCol] == 3)
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackCheckersKingBorder.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                clickCounter++;
            }
            else {
                tdNum2 = parseInt(currentThis.id);
                secondClickRow = Math.floor(tdNum2 / 8);
                secondClickCol = tdNum2 % 8;
                if (FirstCheckKingMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[secondClickRow][secondClickCol] = 3;
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //remove eaten piece
                    if (AllNum[pieceEatenByKingRow][pieceEatenByKingCol] == 2)
                        redPawnCount--;
                    document.getElementById(pieceEatenByKingID).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                    CheckWin();
                    //
                    ChangeTurn();
                    showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                    document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                }
                else if (FirstCheckKingMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                    document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[secondClickRow][secondClickCol] = 3;
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    ChangeTurn();
                }
                else if (FirstCheckMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //check if new king
                    if (secondClickRow == 7 && AllNum[firstClickRow][firstClickCol] == 1) {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 3;
                        blackPawnCount--;
                        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
                        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                        CheckWin();
                    }
                    else {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 1;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    ChangeTurn();
                }
                else if (FirstCheckRightEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //check if new king
                    if (secondClickRow == 7 && AllNum[firstClickRow][firstClickCol] == 1) {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 3;
                        blackPawnCount--;
                        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
                        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                        CheckWin();
                    }
                    else {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 1;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //removes eaten piece
                    if (AllNum[firstClickRow + 1][firstClickCol + 1] == 2 && firstClickCol - secondClickCol == -2) {
                        tdNum3 = (firstClickRow + 1) * 8 + (firstClickCol + 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow + 1][firstClickCol + 1] = 0;
                        redPawnCount--;
                        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                        CheckWin();
                    }
                    else if (AllNum[firstClickRow + 1][firstClickCol + 1] == 4 && firstClickCol - secondClickCol == -2) {
                        tdNum3 = (firstClickRow + 1) * 8 + (firstClickCol + 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow + 1][firstClickCol + 1] = 0;
                        CheckWin();
                    }
                    //
                    ChangeTurn();
                }
                else if (FirstCheckLeftEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //check if new king
                    if (secondClickRow == 7 && AllNum[firstClickRow][firstClickCol] == 1) {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 3;
                        blackPawnCount--;
                        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
                        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                        CheckWin();
                    }
                    else {
                        document.getElementById(tdNum2).innerHTML = "<img src='BlackCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 1;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //removes eaten piece
                    if (AllNum[firstClickRow + 1][firstClickCol - 1] == 2 && firstClickCol - secondClickCol == 2) {
                        tdNum3 = (firstClickRow + 1) * 8 + (firstClickCol - 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow + 1][firstClickCol - 1] = 0;
                        redPawnCount--;
                        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                        CheckWin();
                    }
                    else if (AllNum[firstClickRow + 1][firstClickCol - 1] == 4 && firstClickCol - secondClickCol == 2) {
                        tdNum3 = (firstClickRow + 1) * 8 + (firstClickCol - 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow + 1][firstClickCol - 1] = 0;
                        CheckWin();
                    }
                    //
                    ChangeTurn();
                }
                else {
                    if (AllNum[firstClickRow][firstClickCol] == 1)
                        document.getElementById(tdNum1).innerHTML = "<img src='BlackCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    if (AllNum[firstClickRow][firstClickCol] == 3)
                        document.getElementById(tdNum1).innerHTML = "<img src='BlackCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                }
                clickCounter++;
            }
        }
        else {
            if (clickCounter % 2 == 0) {
                tdNum1 = parseInt(currentThis.id);
                firstClickRow = Math.floor(tdNum1 / 8);
                firstClickCol = tdNum1 % 8;
                if (AllNum[firstClickRow][firstClickCol] == 2)
                    document.getElementById(tdNum1).innerHTML = "<img src='RedCheckersPawnBorder.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                if (AllNum[firstClickRow][firstClickCol] == 4)
                    document.getElementById(tdNum1).innerHTML = "<img src='RedCheckersKingBorder.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                clickCounter++;
            }
            else {
                tdNum2 = parseInt(currentThis.id);
                secondClickRow = Math.floor(tdNum2 / 8);
                secondClickCol = tdNum2 % 8;
                if (SecondCheckKingMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[secondClickRow][secondClickCol] = 4;
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //removes eaten piece
                    if (AllNum[pieceEatenByKingRow][pieceEatenByKingCol] == 1)
                        blackPawnCount--;
                    document.getElementById(pieceEatenByKingID).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                    CheckWin();
                    //
                    ChangeTurn();
                    showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pieces left (not counting kings).";
                    document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                }
                else if (SecondCheckKingMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                    document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[secondClickRow][secondClickCol] = 4;
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    ChangeTurn();
                }
                else if (SecondCheckMove(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //checks if new king and removes 1 from the count
                    if (secondClickRow == 0 && AllNum[firstClickRow][firstClickCol] == 2) {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 4;
                        redPawnCount--;
                        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                        CheckWin();
                    }
                    else {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 2;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    ChangeTurn();
                }
                else if (SecondCheckRightEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //checks if new king and removes 1 from the count
                    if (secondClickRow == 0 && AllNum[firstClickRow][firstClickCol] == 2) {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 4;
                        redPawnCount--;
                        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                        CheckWin();
                    }
                    else {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 2;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //removes eaten piece and removes 1 from the count
                    if (AllNum[firstClickRow - 1][firstClickCol + 1] == 1 && firstClickCol - secondClickCol == -2) {
                        tdNum3 = (firstClickRow - 1) * 8 + (firstClickCol + 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow - 1][firstClickCol + 1] = 0;
                        blackPawnCount--;
                        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
                        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                        CheckWin();
                    }
                    else if (AllNum[firstClickRow - 1][firstClickCol + 1] == 3 && firstClickCol - secondClickCol == -2) {
                        tdNum3 = (firstClickRow - 1) * 8 + (firstClickCol + 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow - 1][firstClickCol + 1] = 0;
                        CheckWin();
                    }
                    //
                    ChangeTurn();
                }
                else if (SecondCheckLeftEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                    //checks if new king and removes 1 from the count
                    if (secondClickRow == 0 && AllNum[firstClickRow][firstClickCol] == 2) {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 4;
                        redPawnCount--;
                        showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                        document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                        CheckWin();
                    } else {
                        document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[secondClickRow][secondClickCol] = 2;
                    }
                    //
                    document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[firstClickRow][firstClickCol] = 0;
                    //removes eaten piece and removes 1 from the count
                    if (AllNum[firstClickRow - 1][firstClickCol - 1] == 1 && firstClickCol - secondClickCol == 2) {
                        tdNum3 = (firstClickRow - 1) * 8 + (firstClickCol - 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow - 1][firstClickCol - 1] = 0;
                        blackPawnCount--;
                        showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pawns left (not counting kings).";
                        document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                        CheckWin();
                    } else if (AllNum[firstClickRow - 1][firstClickCol - 1] == 3 && firstClickCol - secondClickCol == 2) {
                        tdNum3 = (firstClickRow - 1) * 8 + (firstClickCol - 1);
                        document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                        AllNum[firstClickRow - 1][firstClickCol - 1] = 0;
                        CheckWin();
                    }
                    //
                    ChangeTurn();
                }
                else {
                    if (AllNum[firstClickRow][firstClickCol] == 2)
                        document.getElementById(tdNum1).innerHTML = "<img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    if (AllNum[firstClickRow][firstClickCol] == 4)
                        document.getElementById(tdNum1).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                }
                clickCounter++;
            }
        }
    }

    function FirstCheckMove(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != 1)
            return 0;
        if (c1 - c2 != 1 && c1 - c2 != -1)
            return 0;
        return 1;
    }

    function SecondCheckMove(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != -1)
            return 0;
        if (c1 - c2 != 1 && c1 - c2 != -1)
            return 0;
        return 1;
    }

    function FirstCheckRightEat(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != 2)
            return 0;
        if (c1 - c2 != -2)
            return 0;
        if (b[r1 + 1][c1 + 1] != 2 && b[r1 + 1][c1 + 1] != 4)
            return 0;
        return 1;
    }

    function FirstCheckLeftEat(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != 2)
            return 0;
        if (c1 - c2 != 2)
            return 0;
        if (b[r1 + 1][c1 - 1] != 2 && b[r1 + 1][c1 - 1] != 4)
            return 0;
        return 1;
    }

    function SecondCheckRightEat(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != -2)
            return 0;
        if (c1 - c2 != -2)
            return 0;
        if (b[r1 - 1][c1 + 1] != 1 && b[r1 - 1][c1 + 1] != 3)
            return 0;
        return 1;
    }

    function SecondCheckLeftEat(b, r1, c1, r2, c2) {
        if (b[r2][c2] != 0)
            return 0;
        if (r2 - r1 != -2)
            return 0;
        if (c1 - c2 != 2)
            return 0;
        if (b[r1 - 1][c1 - 1] != 1 && b[r1 - 1][c1 - 1] != 3)
            return 0;
        return 1;
    }

    function FirstCheckKingMove(b, r1, c1, r2, c2) {
        if (b[r1][c1] != 3)
            return 0;
        if (b[r2][c2] != 0)
            return 0;
        if (c1 - c2 != r1 - r2 && c1 - c2 != r2 - r1)
            return 0;
        var rc = Math.abs(r2 - r1); //equal to Math.abs(c2 - c1)
        var counter2 = 0;  //how many pieces were eaten
        if (r1 > r2) {
            if (c1 > c2) {
                for (var counter = 0; counter < rc; counter++) {
                    r1--;
                    c1--;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 1 || b[r1][c1] == 3)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
            else {
                for (var counter = 0; counter < rc; counter++) {
                    r1--;
                    c1++;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 1 || b[r1][c1] == 3)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
        }
        else {
            if (c1 > c2) {
                for (var counter = 0; counter < rc; counter++) {
                    r1++;
                    c1--;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 1 || b[r1][c1] == 3)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
            else {
                for (var counter = 0; counter < rc; counter++) {
                    r1++;
                    c1++;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 1 || b[r1][c1] == 3)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
        }
        if (counter2 > 0) {
            if (counter2 > 1)
                return 0;
            return 1;
        }
        return 2;
    }

    function SecondCheckKingMove(b, r1, c1, r2, c2) {
        if (b[r1][c1] != 4)
            return 0;
        if (b[r2][c2] != 0)
            return 0;
        if (c1 - c2 != r1 - r2 && c1 - c2 != r2 - r1)
            return 0;
        var rc = Math.abs(r2 - r1); //equal to Math.abs(c2 - c1)
        var counter2 = 0;  //how many pieces were eaten
        if (r1 > r2) {
            if (c1 > c2) {
                for (var counter = 0; counter < rc; counter++) {
                    r1--;
                    c1--;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 2 || b[r1][c1] == 4)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
            else {
                for (var counter = 0; counter < rc; counter++) {
                    r1--;
                    c1++;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 2 || b[r1][c1] == 4)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
        }
        else {
            if (c1 > c2) {
                for (var counter = 0; counter < rc; counter++) {
                    r1++;
                    c1--;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 2 || b[r1][c1] == 4)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
            else {
                for (var counter = 0; counter < rc; counter++) {
                    r1++;
                    c1++;
                    if (b[r1][c1] != 0) {
                        pieceEatenByKingID = r1 * 8 + c1;
                        pieceEatenByKingRow = r1;
                        pieceEatenByKingCol = c1;
                        counter2++;
                        if (b[r1][c1] == 2 || b[r1][c1] == 4)  //plus one more because a player can't eat his own pieces
                            counter2++;
                    }
                }
            }
        }
        if (counter2 > 0) {
            if (counter2 > 1)
                return 0;
            return 1;
        }
        return 2;
    }

    function ChangeTurn() {
        turns++;
        tempTurn = turns
        if (turns % 2 == 0)
            showTurn = "It is currently " + name1 + "'s turn.";
        else
            showTurn = "It is currently " + name2 + "'s turn.";
        document.getElementById("playerTurn").innerHTML = showTurn;
        //console.log(CountPoints(AllNum));
    }

    function CheckWin() {
        if (blackPawnCount == 0 || redPawnCount == 0) {
            if (blackPawnCount == 0)
                alert(name2 + ' Wins and ' + name1 + ' Loses!');
            else if (redPawnCount == 0) //only "else" also does the job
                alert(name1 + ' Wins and ' + name2 + ' Loses!');
            //if (prompt("Play again? Type 'yes' if you'd like to play again!") == "yes")
            //    EndOfGame();
            if (confirm("Do you want to play again?") == true)
                EndOfGame();
        }
    }

    function EndOfGame() {
        AllNum =
            [
                [null, 1, null, 1, null, 1, null, 1],
                [1, null, 1, null, 1, null, 1, null],
                [null, 1, null, 1, null, 1, null, 1],
                [0, null, 0, null, 0, null, 0, null],
                [null, 0, null, 0, null, 0, null, 0],
                [2, null, 2, null, 2, null, 2, null],
                [null, 2, null, 2, null, 2, null, 2],
                [2, null, 2, null, 2, null, 2, null]
            ]
        turns = 0;
        clickCounter = 0;
        blackPawnCount = 12;
        redPawnCount = 12;
        comparePoints = 100;
        RecursionCounter = 1;
        tempTurn = turns;
        bestfirstRow, bestfirstCol, bestsecondRow, bestsecondCol, bestmiddleRow, bestmiddleCol;
        BuildingTheBoard();
    }
}
{ //Computer play - block scope so I can minimize - like #region
    function CountPoints(b) {
        var boardPoints = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                switch (x) {
                    case 0:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 8;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 1:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 2;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 7;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 2:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 3;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 6;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 3:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 4;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 5;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 4:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 5;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 4;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 5:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 6;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 3;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 6:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 7;
                                break;
                            case 2:
                                boardPoints -= pawnValue * 2;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                    case 7:
                        switch (b[x][y]) {
                            case 1:
                                boardPoints += pawnValue * 8;
                                break;
                            case 2:
                                boardPoints -= pawnValue;
                                break;
                            case 3:
                                boardPoints += kingValue;
                                break;
                            case 4:
                                boardPoints -= kingValue;
                                break;
                        }
                        break;
                }
            }
        }
        //console.log(boardPoints);
        return boardPoints;
    }

    function ComputerThink() {
        var tempEatenRow, tempEatenCol;
        //var tempArray = JSON.parse(JSON.stringify(AllNum));  /* creates a deep copy: I use this because a js array is an object 
        //    - the copy references that object - if I don't use these commands the original gets modified when I modify the copy */
        var doubleTempArray; //for "recursion"
        if (tempTurn % 2 != 0) {
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (AllNum[x][y] != null) {
                        tempArray = JSON.parse(JSON.stringify(AllNum)), firstClickRow = x, firstClickCol = y, secondClickRow = x - 1, secondClickCol = y + 1;
                        if (tempArray[firstClickRow][firstClickCol] == 2) {
                            tempArray = JSON.parse(JSON.stringify(AllNum)), firstClickRow = x, firstClickCol = y, secondClickRow = x - 1, secondClickCol = y + 1;
                            if (SecondCheckMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                //checks if new king
                                if (secondClickRow == 0) {
                                    tempArray[secondClickRow][secondClickCol] = 4;
                                }
                                else {
                                    tempArray[secondClickRow][secondClickCol] = 2;
                                }
                                //
                                tempArray[firstClickRow][firstClickCol] = 0;
                                tempTurn++;
                                oldComparePoints = comparePoints;
                                if (RecursionCounter < RecursionAmount)
                                    ComputerThink();
                                RecursionCounter--;
                                if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                    bestfirstRow = firstClickRow;
                                    bestfirstCol = firstClickCol;
                                    bestsecondRow = secondClickRow;
                                    bestsecondCol = secondClickCol;
                                    bestmiddleRow = null;
                                    bestmiddleCol = null;
                                }
                            }
                            tempArray = JSON.parse(JSON.stringify(AllNum)), firstClickRow = x, firstClickCol = y, secondClickRow = x - 1, secondClickCol = y - 1;
                            if (SecondCheckMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                //checks if new king
                                if (secondClickRow == 0) {
                                    tempArray[secondClickRow][secondClickCol] = 4;
                                }
                                else {
                                    tempArray[secondClickRow][secondClickCol] = 2;
                                }
                                //
                                tempArray[firstClickRow][firstClickCol] = 0;
                                tempTurn++;
                                oldComparePoints = comparePoints;
                                if (RecursionCounter < RecursionAmount)
                                    ComputerThink();
                                RecursionCounter--;
                                if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                    bestfirstRow = firstClickRow;
                                    bestfirstCol = firstClickCol;
                                    bestsecondRow = secondClickRow;
                                    bestsecondCol = secondClickCol;
                                    bestmiddleRow = null;
                                    bestmiddleCol = null;
                                }
                            }
                            tempArray = JSON.parse(JSON.stringify(AllNum)), firstClickRow = x, firstClickCol = y, secondClickRow = x - 2, secondClickCol = y + 2;
                            if (secondClickRow >= 0) {
                                if (SecondCheckRightEat(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                    //checks if new king
                                    if (secondClickRow == 0) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                    }
                                    else {
                                        tempArray[secondClickRow][secondClickCol] = 2;
                                    }
                                    //
                                    tempArray[firstClickRow][firstClickCol] = 0;
                                    //removes eaten piece
                                    if (tempArray[firstClickRow - 1][firstClickCol + 1] == 1) {
                                        tempArray[firstClickRow - 1][firstClickCol + 1] = 0;
                                        tempEatenRow = firstClickRow - 1;
                                        tempEatenCol = firstClickCol + 1;
                                    }
                                    else if (tempArray[firstClickRow - 1][firstClickCol + 1] == 3) {
                                        tempArray[firstClickRow - 1][firstClickCol + 1] = 0;
                                        tempEatenRow = firstClickRow - 1;
                                        tempEatenCol = firstClickCol + 1;
                                    }
                                    //
                                    tempTurn++;
                                    oldComparePoints = comparePoints;
                                    if (RecursionCounter < RecursionAmount)
                                        ComputerThink();
                                    RecursionCounter--;
                                    if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                        bestfirstRow = firstClickRow;
                                        bestfirstCol = firstClickCol;
                                        bestsecondRow = secondClickRow;
                                        bestsecondCol = secondClickCol;
                                        bestmiddleRow = tempEatenRow;
                                        bestmiddleCol = tempEatenCol;
                                    }
                                }
                                tempArray = JSON.parse(JSON.stringify(AllNum)), firstClickRow = x, firstClickCol = y, secondClickRow = x - 2, secondClickCol = y - 2;
                                if (SecondCheckLeftEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                    //checks if new king
                                    if (secondClickRow == 0) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                    }
                                    else {
                                        tempArray[secondClickRow][secondClickCol] = 2;
                                    }
                                    //
                                    tempArray[firstClickRow][firstClickCol] = 0;
                                    //removes eaten piece
                                    if (tempArray[firstClickRow - 1][firstClickCol - 1] == 1) {
                                        tempArray[firstClickRow - 1][firstClickCol - 1] = 0;
                                        tempEatenRow = firstClickRow - 1;
                                        tempEatenCol = firstClickCol - 1;
                                    }
                                    else if (tempArray[firstClickRow - 1][firstClickCol - 1] == 3) {
                                        tempArray[firstClickRow - 1][firstClickCol - 1] = 0;
                                        tempEatenRow = firstClickRow - 1;
                                        tempEatenCol = firstClickCol - 1;
                                    }
                                    //
                                    tempTurn++;
                                    oldComparePoints = comparePoints;
                                    if (RecursionCounter < RecursionAmount)
                                        ComputerThink();
                                    RecursionCounter--;
                                    if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                        bestfirstRow = firstClickRow;
                                        bestfirstCol = firstClickCol;
                                        bestsecondRow = secondClickRow;
                                        bestsecondCol = secondClickCol;
                                        bestmiddleRow = tempEatenRow;
                                        bestmiddleCol = tempEatenCol;
                                    }
                                }
                            } //
                        }
                        else if (tempArray[firstClickRow][firstClickCol] == 4) {
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow < 8; secondClickRow++) {
                                for (secondClickCol = firstClickCol; secondClickCol < 8; secondClickCol++) {
                                    tempArray = JSON.parse(JSON.stringify(AllNum));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        tempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = pieceEatenByKingRow;
                                            bestmiddleCol = pieceEatenByKingCol;
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        tempTurn++;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = null;
                                            bestmiddleCol = null;
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow >= 0; secondClickRow--) {
                                for (secondClickCol = firstClickCol; secondClickCol < 8; secondClickCol++) {
                                    tempArray = JSON.parse(JSON.stringify(AllNum));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        tempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = pieceEatenByKingRow;
                                            bestmiddleCol = pieceEatenByKingCol;
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = null;
                                            bestmiddleCol = null;
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow < 8; secondClickRow++) {
                                for (secondClickCol = firstClickCol; secondClickCol >= 0; secondClickCol--) {
                                    tempArray = JSON.parse(JSON.stringify(AllNum));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        tempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = pieceEatenByKingRow;
                                            bestmiddleCol = pieceEatenByKingCol;
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = null;
                                            bestmiddleCol = null;
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow >= 0; secondClickRow--) {
                                for (secondClickCol = firstClickCol; secondClickCol >= 0; secondClickCol--) {
                                    tempArray = JSON.parse(JSON.stringify(AllNum));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        tempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = pieceEatenByKingRow;
                                            bestmiddleCol = pieceEatenByKingCol;
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        tempArray[secondClickRow][secondClickCol] = 4;
                                        tempArray[firstClickRow][firstClickCol] = 0;
                                        tempTurn++;
                                        oldComparePoints = comparePoints;
                                        if (RecursionCounter < RecursionAmount)
                                            ComputerThink();
                                        RecursionCounter--;
                                        if (comparePoints <= oldComparePoints && comparePoints >= CountPoints(tempArray)) {
                                            bestfirstRow = firstClickRow;
                                            bestfirstCol = firstClickCol;
                                            bestsecondRow = secondClickRow;
                                            bestsecondCol = secondClickCol;
                                            bestmiddleRow = null;
                                            bestmiddleCol = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log(AllNum);
            ComputerMove();
        }
        else {
            for (var x = 0; x < 7; x++) {
                for (var y = 0; y < 7; y++) {
                    if (AllNum[x][y] != null) {
                        doubleTempArray = JSON.parse(JSON.stringify(tempArray)), firstClickRow = x, firstClickCol = y, secondClickRow = x + 1, secondClickCol = y + 1;
                        if (doubleTempArray[firstClickRow][firstClickCol] == 1) {
                            doubleTempArray = JSON.parse(JSON.stringify(tempArray)), firstClickRow = x, firstClickCol = y, secondClickRow = x + 1, secondClickCol = y + 1;
                            if (FirstCheckMove(doubleTempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                //checks if new king
                                if (secondClickRow == 7) {
                                    doubleTempArray[secondClickRow][secondClickCol] = 3;
                                }
                                else {
                                    doubleTempArray[secondClickRow][secondClickCol] = 1;
                                }
                                //
                                doubleTempArray[firstClickRow][firstClickCol] = 0;
                                if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                    doubleComparePoints = CountPoints(tempArray);
                                }
                            }
                            doubleTempArray = JSON.parse(JSON.stringify(tempArray)), firstClickRow = x, firstClickCol = y, secondClickRow = x + 1, secondClickCol = y - 1;
                            if (SecondCheckMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                //checks if new king
                                if (secondClickRow == 7) {
                                    doubleTempArray[secondClickRow][secondClickCol] = 3;
                                }
                                else {
                                    doubleTempArray[secondClickRow][secondClickCol] = 1;
                                }
                                //
                                doubleTempArray[firstClickRow][firstClickCol] = 0;
                                if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                    doubleComparePoints = CountPoints(tempArray);
                                }
                            }
                            doubleTempArray = JSON.parse(JSON.stringify(tempArray)), firstClickRow = x, firstClickCol = y, secondClickRow = x + 2, secondClickCol = y + 2;
                            if (secondClickRow >= 0) {
                                if (SecondCheckRightEat(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                    //checks if new king
                                    if (secondClickRow == 7) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                    }
                                    else {
                                        doubleTempArray[secondClickRow][secondClickCol] = 1;
                                    }
                                    //
                                    doubleTempArray[firstClickRow][firstClickCol] = 0;
                                    //removes eaten piece
                                    if (doubleTempArray[firstClickRow + 1][firstClickCol + 1] == 1) {
                                        doubleTempArray[firstClickRow + 1][firstClickCol + 1] = 0;
                                        tempEatenRow = firstClickRow + 1;
                                        tempEatenCol = firstClickCol + 1;
                                    }
                                    else if (doubleTempArray[firstClickRow + 1][firstClickCol + 1] == 3) {
                                        doubleTempArray[firstClickRow + 1][firstClickCol + 1] = 0;
                                        tempEatenRow = firstClickRow + 1;
                                        tempEatenCol = firstClickCol + 1;
                                    }
                                    //
                                    if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                        doubleComparePoints = CountPoints(tempArray);
                                    }
                                }
                                doubleTempArray = JSON.parse(JSON.stringify(tempArray)), firstClickRow = x, firstClickCol = y, secondClickRow = x + 2, secondClickCol = y - 2;
                                if (SecondCheckLeftEat(AllNum, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                    //checks if new king
                                    if (secondClickRow == 7) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                    }
                                    else {
                                        doubleTempArray[secondClickRow][secondClickCol] = 1;
                                    }
                                    //
                                    doubleTempArray[firstClickRow][firstClickCol] = 0;
                                    //removes eaten piece
                                    if (doubleTempArray[firstClickRow + 1][firstClickCol - 1] == 1) {
                                        doubleTempArray[firstClickRow + 1][firstClickCol - 1] = 0;
                                        tempEatenRow = firstClickRow + 1;
                                        tempEatenCol = firstClickCol - 1;
                                    }
                                    else if (doubleTempArray[firstClickRow - 1][firstClickCol - 1] == 3) {
                                        doubleTempArray[firstClickRow - 1][firstClickCol - 1] = 0;
                                        tempEatenRow = firstClickRow - 1;
                                        tempEatenCol = firstClickCol - 1;
                                    }
                                    //
                                    if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                        doubleComparePoints = CountPoints(tempArray);
                                    }
                                }
                            } //
                        }
                        else if (doubleTempArray[firstClickRow][firstClickCol] == 3) {
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow < 8; secondClickRow++) {
                                for (secondClickCol = firstClickCol; secondClickCol < 8; secondClickCol++) {
                                    doubleTempArray = JSON.parse(JSON.stringify(tempArray));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        doubleTempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow >= 0; secondClickRow--) {
                                for (secondClickCol = firstClickCol; secondClickCol < 8; secondClickCol++) {
                                    doubleTempArray = JSON.parse(JSON.stringify(tempArray));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        doubleTempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow < 8; secondClickRow++) {
                                for (secondClickCol = firstClickCol; secondClickCol >= 0; secondClickCol--) {
                                    doubleTempArray = JSON.parse(JSON.stringify(tempArray));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        doubleTempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    }
                                }
                            }
                            firstClickRow = x, firstClickCol = y;
                            for (secondClickRow = firstClickRow; secondClickRow >= 0; secondClickRow--) {
                                for (secondClickCol = firstClickCol; secondClickCol >= 0; secondClickCol--) {
                                    doubleTempArray = JSON.parse(JSON.stringify(tempArray));
                                    if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 1) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 3;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        //removes eaten piece
                                        doubleTempArray[pieceEatenByKingRow][pieceEatenByKingCol] = 0;
                                        //
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    } else if (SecondCheckKingMove(tempArray, firstClickRow, firstClickCol, secondClickRow, secondClickCol) == 2) {
                                        doubleTempArray[secondClickRow][secondClickCol] = 4;
                                        doubleTempArray[firstClickRow][firstClickCol] = 0;
                                        if (CountPoints(doubleTempArray) > doubleComparePoints) {
                                            doubleComparePoints = CountPoints(tempArray);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            tempTurn--;
            RecursionCounter++;
        }
    }

    function ComputerMove() {
        if (bestfirstRow == null || bestfirstCol == null || bestsecondRow == null || bestsecondCol == null) {
            if (prompt("The game has reached a stalemate, meaning one of the players can't move. Play again? Type 'yes' if you'd like to play again!") == "yes")
                EndOfGame();
        }
        else {
            tdNum1 = bestfirstRow * 8 + bestfirstCol;
            tdNum2 = bestsecondRow * 8 + bestsecondCol;
            if (AllNum[bestfirstRow][bestfirstCol] == 2) {
                if (bestsecondRow == 0) {
                    document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[bestsecondRow][bestsecondCol] = 4;
                    redPawnCount--;
                    showRedPlayerAmount = "There are currently " + redPawnCount + " red pawns left (not counting kings).";
                    document.getElementById("redplayeramount").innerHTML = showRedPlayerAmount;
                    CheckWin();
                }
                else {
                    document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersPawn.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                    AllNum[bestsecondRow][bestsecondCol] = 2;
                }
            }
            else {
                document.getElementById(tdNum2).innerHTML = "<img src='RedCheckersKing.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                AllNum[bestsecondRow][bestsecondCol] = 4;
            }
            document.getElementById(tdNum1).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
            AllNum[bestfirstRow][bestfirstCol] = 0;
            if (bestmiddleRow != null && bestmiddleCol != null) {
                tdNum3 = bestmiddleRow * 8 + bestmiddleCol;
                if (AllNum[bestmiddleRow][bestmiddleCol] == 1) {
                    blackPawnCount--;
                    showBlackPlayerAmount = "There are currently " + blackPawnCount + " black pieces left (not counting kings).";
                    document.getElementById("blackplayeramount").innerHTML = showBlackPlayerAmount;
                    CheckWin();
                }
                document.getElementById(tdNum3).innerHTML = "<img src='BlackTile.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
                AllNum[bestmiddleRow][bestmiddleCol] = 0;
            }
            comparePoints = 100, doubleComparePoints = -100, RecursionCounter = 1;
            ChangeTurn();
        }
    }
}