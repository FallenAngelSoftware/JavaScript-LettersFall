/*
"LettersFall" - Open-source cross-platform educational word spelling game.
Copyright (C) 2018  Jesse Palser

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

Email the author at: "JessePalser@Gmail.com"
*/

// "logic.js"...

var GameMode = 1;

var SelectedBackground = 0;

var PlayerSelectedMusic = 0;
var RandomizeMusicTrack = 1;

var PAUSEgame = false;
var GameOver;

var NumberOfLetters = 26;

var Score = 0;
var Level = 0;
var Bombs = 0;

var Playfield = new Array(11);
    Playfield[0]=new Array(18);
    Playfield[1]=new Array(18);
    Playfield[2]=new Array(18);
    Playfield[3]=new Array(18);
    Playfield[4]=new Array(18);
    Playfield[5]=new Array(18);
    Playfield[6]=new Array(18);
    Playfield[7]=new Array(18);
    Playfield[8]=new Array(18);
    Playfield[9]=new Array(18);
    Playfield[10]=new Array(18);

var NextLetters = new Array(3);
var FallingLetters = new Array(3);

var FallingLettersPlayfieldX = new Array(3);
var FallingLettersPlayfieldY = new Array(3);
var FallingLettersScreenX = new Array(3);
var FallingLettersScreenY = new Array(3);
var FallingLettersOffsetY;
var FallingLettersNextPlayfieldX;

var DownArrowScale;
var DownArrowPressedTimer;
var LeftArrowScale;
var LeftArrowPressedTimer;
var RightArrowScale;
var RightArrowPressedTimer;

var DroppingFast;

var BombButtonPressedTimer;
var BombButtonScale;
var ExplosionScale;
var ExplosionTransparency;

var SelectedLetterPlayfieldX = new Array(11);
var SelectedLetterPlayfieldY = new Array(11);

var ClearButtonScale;
var ClearButtonPressedTimer;
var UndoButtonScale;
var UndoButtonPressedTimer;

var CheckButtonScale;
var CheckButtonPressedTimer;
var CheckButtonRedHue;
var CheckButtonGreenHue;
var CheckButtonBlueHue;

var ClearWordTransparency;

var BombBonusMeterValue;
var LevelAdvancementValue;

var ExitButtonScale;

var InitialGameSpeed = new Array(4);
var CurrentGameSpeed;

var TimeAttackMinutes;
var TimeAttackSeconds;
var TimeAttackNextSecondTick;

var CursorIsArrow = true;

//-------------------------------------------------------------------------------------------------
/**
 * @return {number}
 */
function GetRandomLetter()
{
    return( Math.floor(Math.random() * NumberOfLetters) + 1 );
}

//-------------------------------------------------------------------------------------------------
function SetupNextLetters()
{
    if (Level < 10)
    {
        FallingLetters[0] = NextLetters[0];
        FallingLetters[1] = NextLetters[1];
        FallingLetters[2] = NextLetters[2];

        NextLetters[0] = GetRandomLetter();
        NextLetters[1] = 0;
        NextLetters[2] = 0;
    }
    else if (Level < 20)
    {
        FallingLetters[0] = NextLetters[0];
        FallingLetters[1] = NextLetters[1];
        FallingLetters[2] = NextLetters[2];

        NextLetters[0] = GetRandomLetter();
        NextLetters[1] = GetRandomLetter();
        NextLetters[2] = 0;
    }
    else if (Level < 30)
    {
        FallingLetters[0] = NextLetters[0];
        FallingLetters[1] = NextLetters[1];
        FallingLetters[2] = NextLetters[2];

        NextLetters[0] = GetRandomLetter();
        NextLetters[1] = GetRandomLetter();
        NextLetters[2] = GetRandomLetter();
    }

    FallingLettersPlayfieldX[0] = FallingLettersNextPlayfieldX;
    FallingLettersPlayfieldY[0] = 2;
    FallingLettersScreenX[0] = 27 + (FallingLettersNextPlayfieldX * 41);
    FallingLettersScreenY[0] = -4;

    FallingLettersPlayfieldX[1] = FallingLettersNextPlayfieldX;
    FallingLettersPlayfieldY[1] = 1;
    FallingLettersScreenX[1] = 27 + (FallingLettersNextPlayfieldX * 41);
    FallingLettersScreenY[1] = -4 - 30;

    FallingLettersPlayfieldX[2] = FallingLettersNextPlayfieldX;
    FallingLettersPlayfieldY[2] = 0;
    FallingLettersScreenX[2] = 27 + (FallingLettersNextPlayfieldX * 41);
    FallingLettersScreenY[2] = -4 - (2*30);

    FallingLettersOffsetY = 0;

    ClearWordTransparency = 1;

    if (FallingLettersNextPlayfieldX < 10)  FallingLettersNextPlayfieldX++;
    else if (FallingLettersNextPlayfieldX === 10)  FallingLettersNextPlayfieldX = 0;

    if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] > 0)
    {
        GameOver = 150;
		
		ScreenIsDirty = true;
    }
}

//-------------------------------------------------------------------------------------------------
function SetupForNewGame()
{
var y;
var x;

    PAUSEgame = false;

    GameOver = -1;

    if (GameMode === 0)  Framerate = 15;
    else if (GameMode === 1)  Framerate = 30;
    else if (GameMode === 2)  Framerate = 45;
    else if (GameMode === 4)  Framerate = 30;

    if (DEBUG === false)
    {
        Score = 0;
        Level = 0;
        Bombs = 1;

        BombBonusMeterValue = 0;
    }
    else
    {
        Score = 45793;
        Level = 13;
        Bombs = 5;

        BombBonusMeterValue = 75;
    }
   
    for (y = 0; y < 17; y++)
    {
        for (x = 0; x < 11; x++)
        {
            Playfield[x][y] = 0;
        }
    }

    for (y = 12; y < 17; y++)
    {
        for (x = 0; x < 11; x++)
        {
            Playfield[x][y] = GetRandomLetter();
        }
    }

    for (x = 0; x < 11; x++)  Playfield[x][17] = 255;

    NextLetters[0] = GetRandomLetter();
    NextLetters[1] = 0;
    NextLetters[2] = 0;

    FallingLettersNextPlayfieldX = 0;
    SetupNextLetters();

    DownArrowScale = 1;
    DownArrowPressedTimer = -1;
    LeftArrowScale = 1;
    LeftArrowPressedTimer = -1;
    RightArrowScale = 1;
    RightArrowPressedTimer = -1;

    DroppingFast = false;

    BombButtonPressedTimer = -1;
    BombButtonScale = 1;
    ExplosionScale = -1;
    ExplosionTransparency = 1;

    for (var index = 0; index < 11; index++)
    {
        SelectedLetterPlayfieldX[index] = -1;
        SelectedLetterPlayfieldY[index] = -1;
    }

    ClearButtonScale = 1;
    ClearButtonPressedTimer = -1;
    UndoButtonScale = 1;
    UndoButtonPressedTimer = -1;

    CheckButtonScale = 1;
    CheckButtonPressedTimer = -1;
    CheckButtonRedHue = 1;
    CheckButtonGreenHue = 1;
    CheckButtonBlueHue = 1;

    ClearWordTransparency = 1;

    LevelAdvancementValue = 0;

    ExitButtonScale = 1;

    if (GameMode === 3)
    {
        TimeAttackMinutes = 14;
        TimeAttackSeconds = 59;
    }
    else
    {
        TimeAttackMinutes = -1;
        TimeAttackSeconds = -1;
    }

    TimeAttackNextSecondTick = new Date().getTime()+1000;

    Playfield[0][16] = 10; // J
    Playfield[1][13] = 15; // O
    Playfield[2][14] = 25; // Y
    Playfield[3][16] = 6;  // F
    Playfield[4][13] = 21; // U
    Playfield[5][16] = 12; // L
    Playfield[6][14] = 12; // L
    Playfield[7][15] = 25; // Y
}

//-------------------------------------------------------------------------------------------------
function DeleteLettersInPlayfieldFromExplosion()
{
var y;
var x;

    ClearSelectedLetters();

    for (y = -2; y < 3; y++)
    {
        for (x = -2; x < 3; x++)
        {
            if (  ( (FallingLettersPlayfieldY[0]+y) > -1 ) && ( (FallingLettersPlayfieldY[0]+y) < 17 )
                 && ( (FallingLettersPlayfieldX[0]+x) > -1 ) && ( (FallingLettersPlayfieldX[0]+x) < 11 )  )
                Playfield[ FallingLettersPlayfieldX[0]+x ][ FallingLettersPlayfieldY[0]+y ] = 0;
        }
    }

    for (x = -1; x < 2; x++)
    {
        if (  ( (FallingLettersPlayfieldY[0]-3) > -1 ) && ( (FallingLettersPlayfieldY[0]-3) < 17 )
             && ( (FallingLettersPlayfieldX[0]+x) > -1 ) && ( (FallingLettersPlayfieldX[0]+x) < 11 )  )
            Playfield[ FallingLettersPlayfieldX[0]+x ][ FallingLettersPlayfieldY[0]-3 ] = 0;
    }

    for (x = -1; x < 2; x++)
    {
        if (  ( (FallingLettersPlayfieldY[0]+3) > -1 ) && ( (FallingLettersPlayfieldY[0]+3) < 17 )
             && ( (FallingLettersPlayfieldX[0]+x) > -1 ) && ( (FallingLettersPlayfieldX[0]+x) < 11 )  )
            Playfield[ FallingLettersPlayfieldX[0]+x ][ FallingLettersPlayfieldY[0]+3 ] = 0;
    }

    for (y = -1; y < 2; y++)
    {
        if (  ( (FallingLettersPlayfieldY[0]+y) > -1 ) && ( (FallingLettersPlayfieldY[0]+y) < 17 )
             && ( (FallingLettersPlayfieldX[0]-3) > -1 ) && ( (FallingLettersPlayfieldX[0]-3) < 11 )  )
            Playfield[ FallingLettersPlayfieldX[0]-3 ][ FallingLettersPlayfieldY[0]+y ] = 0;
    }

    for (y = -1; y < 2; y++)
    {
        if (  ( (FallingLettersPlayfieldY[0]+y) > -1 ) && ( (FallingLettersPlayfieldY[0]+y) < 17 )
             && ( (FallingLettersPlayfieldX[0]+3) > -1 ) && ( (FallingLettersPlayfieldX[0]+3) < 11 )  )
            Playfield[ FallingLettersPlayfieldX[0]+3 ][ FallingLettersPlayfieldY[0]+y ] = 0;
    }
}

//-------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function ApplyGravityToPlayfield()
{
var returnValue = false;

    for (var y = 16; y > 0; y--)
    {
        for (var x = 0; x < 11; x++)
        {
            if (Playfield[x][y] === 0 && Playfield[x][y-1] > 0)
            {
                Playfield[x][y] = Playfield[x][y-1];
                Playfield[x][y-1] = 0;

                returnValue = true;
            }
        }
    }

    return(returnValue);
}

//-------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function CheckSelectedLettersForWord()
{
var playerWordToCheck = "";
var currentDictionaryWord = "";
var index;

    for (index = 0; index < 11; index++)
    {
	if (SelectedLetterPlayfieldX[index] != -1 && SelectedLetterPlayfieldY[index] != -1)
	    playerWordToCheck += String.fromCharCode( 96 + Playfield[ SelectedLetterPlayfieldX[index] ][ SelectedLetterPlayfieldY[index] ] );
	else  break;
    }

    index = 0;
    while (currentDictionaryWord != "1")
    {
        if      (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  1)  currentDictionaryWord = Awords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  2)  currentDictionaryWord = Bwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  3)  currentDictionaryWord = Cwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  4)  currentDictionaryWord = Dwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  5)  currentDictionaryWord = Ewords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  6)  currentDictionaryWord = Fwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  7)  currentDictionaryWord = Gwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  8)  currentDictionaryWord = Hwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] ===  9)  currentDictionaryWord = Iwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 10)  currentDictionaryWord = Jwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 11)  currentDictionaryWord = Kwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 12)  currentDictionaryWord = Lwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 13)  currentDictionaryWord = Mwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 14)  currentDictionaryWord = Nwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 15)  currentDictionaryWord = Owords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 16)  currentDictionaryWord = Pwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 17)  currentDictionaryWord = Qwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 18)  currentDictionaryWord = Rwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 19)  currentDictionaryWord = Swords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 20)  currentDictionaryWord = Twords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 21)  currentDictionaryWord = Uwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 22)  currentDictionaryWord = Vwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 23)  currentDictionaryWord = Wwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 24)  currentDictionaryWord = Xwords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 25)  currentDictionaryWord = Ywords[index];
        else if (Playfield[ SelectedLetterPlayfieldX[0] ][ SelectedLetterPlayfieldY[0] ] === 26)  currentDictionaryWord = Zwords[index];

        if (currentDictionaryWord === playerWordToCheck)  return(true);

        index++;
    }

    return(false);
}

//-------------------------------------------------------------------------------------------------
function ClearSelectedLetters()
{
    for (var index = 0; index < 11; index++)
    {
        SelectedLetterPlayfieldX[index] = -1;
        SelectedLetterPlayfieldY[index] = -1;
    }
}

//-------------------------------------------------------------------------------------------------
function ClearSelectedLettersInPlayfield()
{
var index;

    var wordLength = 0;
    for (index = 0; index < 11; index++)
    {
        if (SelectedLetterPlayfieldX[index] != -1 && SelectedLetterPlayfieldY[index] != -1)  wordLength++;
    }

    Score+=( 25*wordLength*(Level+1) );

    if (wordLength > 7)
    {
        Score+=( 1000 * (Level+1) );

	    PlaySoundEffect(8);
    }

    BombBonusMeterValue+=( (wordLength-2)*4 );
    if (BombBonusMeterValue > 147)
    {
        BombBonusMeterValue = 0;
        Score+=1000*Level;
        Bombs++;
	    PlaySoundEffect(5);
    }

    LevelAdvancementValue++;
    if (LevelAdvancementValue > 6)
    {
        Level++;
        LevelAdvancementValue = 0;

        if (Level % 10 === 0)
        {
            CurrentGameSpeed = InitialGameSpeed[GameMode];
        }
        else
        {
            CurrentGameSpeed--;
        }

	    PlaySoundEffect(9);
    }

    for (index = 0; index < 11; index++)
    {
        if (SelectedLetterPlayfieldX[index] != -1 && SelectedLetterPlayfieldY[index] != -1)
            Playfield[ SelectedLetterPlayfieldX[index] ][ SelectedLetterPlayfieldY[index] ] = 0;
    }
}

//-------------------------------------------------------------------------------------------------
function RunGameplayEngine()
{
var movementY = 0;
var index;

    if (FallingLetters[0] === 255)  movementY = 1;
    else  movementY = 5;

    if (GameMode === 3)
    {
		var ticks = new Date().getTime();
	    if (ticks >= TimeAttackNextSecondTick)
        {
            if (TimeAttackSeconds > 0)
            {
                TimeAttackSeconds--;
            }
            else if (TimeAttackMinutes > 0)
            {
                TimeAttackMinutes--;
                TimeAttackSeconds = 59;
            }
            else
            {
                TimeAttackMinutes = 0;
                TimeAttackSeconds = 0;

                GameOver = 150;
            }

			TimeAttackNextSecondTick = new Date().getTime()+1000;
			
	    ScreenIsDirty = true;
        }
    }

    if (LeftArrowScale === 0.75)
    {
        if (LeftArrowPressedTimer > 0)  LeftArrowPressedTimer--;
        else
        {
			LeftArrowScale = 1;
			LeftArrowPressedTimer = -1;
			ScreenIsDirty = true;
        }
    }

    if (RightArrowScale === 0.75)
    {
        if (RightArrowPressedTimer > 0)  RightArrowPressedTimer--;
        else
        {
			RightArrowScale = 1;
			RightArrowPressedTimer = -1;
			ScreenIsDirty = true;
        }
    }

    if (BombButtonPressedTimer === 10)
    {
        BombButtonPressedTimer--;
    }
    else if (BombButtonPressedTimer > 5)
    {
        BombButtonScale = 0.75;

        BombButtonPressedTimer--;
		
		ScreenIsDirty = true;
    }
    else if (BombButtonPressedTimer > 0)
    {
        BombButtonScale = 1;

        BombButtonPressedTimer--;
	
		ScreenIsDirty = true;
    }
    else if (BombButtonPressedTimer === 0)
    {
        BombButtonPressedTimer = -1;

        Bombs--;

        ExplosionTransparency = 1;

        NextLetters[0] = 255;
        NextLetters[1] = 0;
        NextLetters[2] = 0;
    }

    if (ClearButtonPressedTimer > -1)  ClearButtonPressedTimer--;

    if (ClearButtonScale === 0.75)
    {
        if (ClearButtonPressedTimer === 9)
        {
        }
        else if (ClearButtonPressedTimer === 5)
        {
            ClearButtonScale = 1;
	    
			ScreenIsDirty = true;
        }
    }
    else if (ClearButtonPressedTimer === 0)
    {
        ClearButtonPressedTimer = -1;

        ClearSelectedLetters();
		
		ScreenIsDirty = true;
    }

    if (UndoButtonPressedTimer > -1)  UndoButtonPressedTimer--;

    if (UndoButtonScale === 0.75)
    {
        if (UndoButtonPressedTimer === 5)
        {
            UndoButtonScale = 1;
	    
			ScreenIsDirty = true;
        }
    }
    else if (UndoButtonPressedTimer === 0)
    {
        UndoButtonPressedTimer = -1;

        var indexToUndo = 0;
        for (index = 0; index < 11; index++)
        {
            if (SelectedLetterPlayfieldX[index] != -1 && SelectedLetterPlayfieldY[index] != -1)
                indexToUndo = index;
            else  index = 999;
        }

        SelectedLetterPlayfieldX[indexToUndo] = -1;
        SelectedLetterPlayfieldY[indexToUndo] = -1;
		
		ScreenIsDirty = true;
    }

    if (CheckButtonPressedTimer > -1)  CheckButtonPressedTimer--;

    if (CheckButtonScale === 0.75)
    {
        if (CheckButtonPressedTimer === 5)
        {
            CheckButtonScale = 1;
	    
			ScreenIsDirty = true;

            if ( CheckSelectedLettersForWord() === false )
            {
                CheckButtonRedHue = 128;
                CheckButtonGreenHue = 255;
                CheckButtonBlueHue = 255;

				PlaySoundEffect(3);
            }
            else if ( CheckSelectedLettersForWord() === true )
            {
                CheckButtonRedHue = 255;
                CheckButtonGreenHue = 128;
                CheckButtonBlueHue = 255;

                ClearWordTransparency = 0.95;

				PlaySoundEffect(4);
            }
        }
    }
    else if (CheckButtonPressedTimer === 0)
    {
        CheckButtonPressedTimer = -1;

        CheckButtonRedHue = 1;
        CheckButtonGreenHue = 1;
        CheckButtonBlueHue = 1;
		
		ScreenIsDirty = true;
    }

    if (ClearWordTransparency < 1)
    {
        if (ClearWordTransparency > 0.05)  { ClearWordTransparency-=0.05; ScreenIsDirty = true; }
        else
        {
            ClearSelectedLettersInPlayfield();
            ClearSelectedLetters();
            ClearWordTransparency = 1;
			
			ScreenIsDirty = true;
        }
    }
    else if ( ApplyGravityToPlayfield() === true )
    {
		ScreenIsDirty = true;
    }
    else if (ExplosionScale > -1)
    {
        if (ExplosionScale < 20)
        {
            ExplosionScale+=0.5;
        }
        else if (ExplosionScale === 20)
        {
            ExplosionScale+=0.5;

            DeleteLettersInPlayfieldFromExplosion();
        }
        else if (ExplosionTransparency > 0.1)
        {
            ExplosionScale+=0.5;
            if (ExplosionTransparency > 0.1)  ExplosionTransparency-=0.1;
        }
        else
        {
            ExplosionScale = -1;
            SetupNextLetters();
        }
        
        ScreenIsDirty = true;
    }
    else if (DroppingFast === true)
    {
        if (DownArrowPressedTimer > -1)  DownArrowPressedTimer--;
        else  DownArrowScale = 1;

        if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] === 0)
        {
            FallingLettersScreenY[0]+=30;
            FallingLettersScreenY[1]+=30;
            FallingLettersScreenY[2]+=30;

            FallingLettersPlayfieldY[0]++;
            FallingLettersPlayfieldY[1]++;
            FallingLettersPlayfieldY[2]++;
	    
			ScreenIsDirty = true;
        }
        if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] > 0)
        {
            Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0] ] = FallingLetters[0];
            Playfield[ FallingLettersPlayfieldX[1] ][ FallingLettersPlayfieldY[1] ] = FallingLetters[1];
            Playfield[ FallingLettersPlayfieldX[2] ][ FallingLettersPlayfieldY[2] ] = FallingLetters[2];

            DroppingFast = false;

            DownArrowScale = 1;

            if (FallingLetters[0] === 255)
            {
                ExplosionScale = 0.0;
				PlaySoundEffect(7);
            }
            else  SetupNextLetters();
        }
    }
    else
    {
        var tileX = 27;
        var tileY = 26-(30*3);
        for (var y = 0; y < 17; y++)
        {
            for (var x = 0; x < 11; x++)
            {
                if (  MouseY > ( tileY - (30/2) )
                && MouseY < ( tileY + (30/2) )
                && MouseX > ( tileX - (39/2) )
                && MouseX < ( tileX + (39/2) )  && Playfield[x][y] > 0 && Playfield[x][y] < 255 )
                {
                    CursorIsArrow = false;

                    if (MouseButtonClicked === true)
                    {
                        var letterNotAlreadySelected = false;
                        for (index = 0; index < 11; index++)
                        {
                            if (SelectedLetterPlayfieldX[index] === x && SelectedLetterPlayfieldY[index] === y)
                            letterNotAlreadySelected = true;
                        }

                        if (letterNotAlreadySelected === false && Playfield[x][y] > 0)
                        {
                            for (index = 0; index < 11; index++)
                            {
                                if (SelectedLetterPlayfieldX[index] === -1 && SelectedLetterPlayfieldY[index] === -1)
                                {
                                    SelectedLetterPlayfieldX[index] = x;
                                    SelectedLetterPlayfieldY[index] = y;

                                    index = 999;

                                    ScreenIsDirty = true;

                                    PlaySoundEffect(0);
                                }
                            }
                        }
                    }
                }

                tileX+=41;
            }

            tileX = 27;
            tileY+=30;
        }

        if (  MouseY > ( 350 - (59/2) )
        && MouseY < ( 350 + (59/2) )
        && MouseX > ( 550 - (60/2) )
        && MouseX < ( 550 + (60/2) )  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (DownArrowScale === 1)
                {
                    if (FallingLettersPlayfieldY[0] > 3
                    && DroppingFast === false)
                    {
                        PlaySoundEffect(0);

                        DownArrowScale = 0.75;
                        DownArrowPressedTimer = 10;

                        DroppingFast = true;

                        if (FallingLettersOffsetY > 0)
                        {
                            var offsetYMax;
                            if (FallingLetters[0] === 255)  offsetYMax = 33;
                            else  offsetYMax = 35;

                            for (var offsetY = FallingLettersOffsetY; offsetY < offsetYMax; offsetY+=movementY)
                            {
                            FallingLettersScreenY[0]+=movementY;
                            FallingLettersScreenY[1]+=movementY;
                            FallingLettersScreenY[2]+=movementY;
                            }
                        }

                        if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] === 0)
                        {
                            FallingLettersPlayfieldY[0]++;
                            FallingLettersPlayfieldY[1]++;
                            FallingLettersPlayfieldY[2]++;
                        }
                        else if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] > 0)
                        {
                            Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0] ] = FallingLetters[0];
                            Playfield[ FallingLettersPlayfieldX[1] ][ FallingLettersPlayfieldY[1] ] = FallingLetters[1];
                            Playfield[ FallingLettersPlayfieldX[2] ][ FallingLettersPlayfieldY[2] ] = FallingLetters[2];

                            DroppingFast = false;

                            SetupNextLetters();

                            DownArrowScale = 1;
                        }
                    }
                }
            }
        }

        if (  MouseY > ( 336 - (43/2) )
        && MouseY < ( 336 + (43/2) )
        && MouseX > ( 495 - (38/2) )
        && MouseX < ( 495 + (38/2) )  && FallingLetters[0] === 255 )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (LeftArrowScale === 1)
                {
                    PlaySoundEffect(0);

                    LeftArrowScale = 0.75;
                    LeftArrowPressedTimer = 10;

                    ScreenIsDirty = true;

                    if (FallingLettersPlayfieldX[0] > -1)
                    {
                        FallingLettersPlayfieldX[0]--;

                        FallingLettersScreenX[0]-=41;
                    }
                }
            }
        }

        if (  MouseY > ( 336 - (43/2) )
        && MouseY < ( 336 + (43/2) )
        && MouseX > ( 605 - (38/2) )
        && MouseX < ( 605 + (38/2) ) && FallingLetters[0] === 255  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (RightArrowScale === 1)
                {
                    PlaySoundEffect(0);

                    RightArrowScale = 0.75;
                    RightArrowPressedTimer = 10;

                    ScreenIsDirty = true;

                    if (FallingLettersPlayfieldX[0] < 10)
                    {
                        FallingLettersPlayfieldX[0]++;

                        FallingLettersScreenX[0]+=41;
                    }
                }
	        }
	    }

        if (  MouseY > ( 290 - (40/2) )
        && MouseY < ( 290 + (40/2) )
        && MouseX > ( 598 - (39/2) )
        && MouseX < ( 598 + (39/2) ) &&  Bombs > 0  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (BombButtonScale === 1 && NextLetters[0] != 255)
                {
                    PlaySoundEffect(6);

                    BombButtonPressedTimer = 20;

                    ScreenIsDirty = true;
                }
            }
        }

        if (  MouseY > ( 406 - (30/2) )
        && MouseY < ( 406 + (30/2) )
        && MouseX > ( 550 - (85/2) )
        && MouseX < ( 550 + (85/2) ) && SelectedLetterPlayfieldX[1] != -1 && SelectedLetterPlayfieldY[1] != -1  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (ClearButtonScale === 1)
                {
                    PlaySoundEffect(2);

                    ClearButtonScale = 0.75;
                    ClearButtonPressedTimer = 10;

                    ScreenIsDirty = true;
                }
            }
        }

        if (  MouseY > ( 457 - (46/2) )
        && MouseY < ( 457 + (46/2) )
        && MouseX > ( 496 - (35/2) )
        && MouseX < ( 496 + (35/2) ) && SelectedLetterPlayfieldX[0] != -1 && SelectedLetterPlayfieldY[0] != -1  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (UndoButtonScale === 1)
                {
                    PlaySoundEffect(1);

                    UndoButtonScale = 0.75;
                    UndoButtonPressedTimer = 10;

                    ScreenIsDirty = true;
                }
            }
        }

        if (  MouseY > ( 457 - (44/2) )
        && MouseY < ( 457 + (44/2) )
        && MouseX > ( 598 - (44/2) )
        && MouseX < ( 598 + (44/2) ) && SelectedLetterPlayfieldX[2] != -1 && SelectedLetterPlayfieldY[2] != -1  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                if (CheckButtonScale === 1)
                {
                    CheckButtonScale = 0.75;
                    CheckButtonPressedTimer = 10;

                    ScreenIsDirty = true;
                }
            }
        }

        if (  MouseY > ( 16 - (32/2) )
        && MouseY < ( 16 + (32/2) )
        && MouseX > ( 640 -16 - (32/2) )
        && MouseX < ( 640 -16 + (32/2) )  )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
                ScreenFadeStatus = 1;
            }
        }

        if (FallingLettersOffsetY === 0)
        {
            if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] === 0)
            {
                FallingLettersOffsetY = movementY;

                FallingLettersScreenY[0]+=movementY;
                FallingLettersScreenY[1]+=movementY;
                FallingLettersScreenY[2]+=movementY;

                FallingLettersPlayfieldY[0]++;
                FallingLettersPlayfieldY[1]++;
                FallingLettersPlayfieldY[2]++;
            }
            else if (Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0]+1 ] > 0)
            {
                if (FallingLetters[0] === 255)
                {
                    ExplosionScale = 0.0;
                    PlaySoundEffect(7);
                }
                else
                {
                    Playfield[ FallingLettersPlayfieldX[0] ][ FallingLettersPlayfieldY[0] ] = FallingLetters[0];
                    Playfield[ FallingLettersPlayfieldX[1] ][ FallingLettersPlayfieldY[1] ] = FallingLetters[1];
                    Playfield[ FallingLettersPlayfieldX[2] ][ FallingLettersPlayfieldY[2] ] = FallingLetters[2];

                    SetupNextLetters();
                }
            }
        }
        else if (FallingLettersOffsetY < 30)
        {
            FallingLettersScreenY[0]+=movementY;
            FallingLettersScreenY[1]+=movementY;
            FallingLettersScreenY[2]+=movementY;

            FallingLettersOffsetY+=movementY;
        }
        else if (FallingLettersOffsetY === 30)
        {
            FallingLettersOffsetY = 0;
        }
    }
}
