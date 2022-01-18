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

// "screens.js"...

var DEBUG = false;
var ScreenIsDirty = true;

var ctxCanvas;
var ctx;
var ctxCanvasFallingLetters;
var ctxFallingLetters;

var screenWidth;
var screenHeight;

var canvas;
var context;

var ScreenFadeAlpha = 1;
var ScreenFadeStatus = 0;
var ScreenToDisplay = 0;
var NextScreenToDisplay = 1;

var frameCount = 0;
var FPS = 0;

var NowLoadingTextBlink = 0;
var LoadTimer = 0;

var ArrowButtonAnimation = 0;

var CursorIsArrow = true;

var SixteenBitSoftScreenTimer;

var NewHighScoreCharButtonScreenX = new Array(67);
var NewHighScoreCharButtonScreenY = new Array(67);
var NewHighScoreCharButtonScale = new Array(67);

//--------------------------------------------------------------------------------------------------------------
function ApplyScreenFade()
{
    if (ScreenFadeStatus === -1)  return;

    if (ScreenFadeStatus === 0)
    {
        ScreenFadeAlpha-=.33;

        ScreenIsDirty = true;

        if (ScreenFadeAlpha < 0)
        {
            ScreenFadeStatus = -1;
            ScreenFadeAlpha = 0;

            if (ScreenToDisplay === 3)  SaveOptions();
        }
    }
    else if (ScreenFadeStatus === 1)
    {
        ScreenFadeAlpha+=.33;

        if (ScreenFadeAlpha > 1)  ScreenIsDirty = true;

        if (ScreenFadeAlpha > 1)
        {
            ScreenFadeStatus = 0;
            ScreenFadeAlpha = 1;
		
			DestroyAllButtons();
			DestroyAllIcons();
			DestroyAllArrowSets();

			CursorIsArrow = true;
			
            ScreenToDisplay = NextScreenToDisplay;
            NumberOfOnscreenButtons = 0;
            NumberOfOnscreenArrowSets = 0;
            
            ClearTextCache();
        }
    }

    DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, ScreenFadeAlpha, 255, 255, 255)
}

//--------------------------------------------------------------------------------------------------------------
function GameLoop()
{
    frameCount++;

    var CurrentTime = new Date().getTime();
    if (CurrentTime > NextSecond)
    {
        FPS = frameCount;
        frameCount = 0;
        NextSecond = CurrentTime+1000;
    }

	if (NumberOfOnscreenIcons > 0)  ProcessAllIcons();
    
    if (DEBUG === true)  ScreenIsDirty = true;
	

		
	CursorIsArrow = MouseOnGUI() !== true;
	
    if (ScreenToDisplay === 0)  DisplayLoadingNowScreen();
    else if (ScreenToDisplay === 1)  Display1stRunAudioOption();
    else if (ScreenToDisplay === 2)  DisplaySixteenBitSoftScreen();
    else if (ScreenToDisplay === 3)  DisplayTitleScreen();
    else if (ScreenToDisplay === 4)  DisplayOptionsScreen();
    else if (ScreenToDisplay === 5)  DisplayHowToPlayScreen();
    else if (ScreenToDisplay === 6)  DisplayHighScoresScreen();
    else if (ScreenToDisplay === 7)  DisplayAboutScreen();
    else if (ScreenToDisplay === 8)  DisplayPlayingGameScreen();
    else if (ScreenToDisplay === 9)  DisplayNewHighScoreNameInputScreen();

	SpacebarPressed = false;
	
	if (NumberOfOnscreenButtons > 0)  DrawAllIButtons();
	if (NumberOfOnscreenIcons > 0)  DrawAllIcons();		

    if (DEBUG === true && PAUSEgame === false)
    {
	if (MusicIsCompletelyLoaded[7] === true)  DrawTextOntoCanvas(12, "Track 7: OK", 4, 295, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[6] === true)  DrawTextOntoCanvas(12, "Track 6: OK", 4, 310, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[5] === true)  DrawTextOntoCanvas(12, "Track 5: OK", 4, 325, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[4] === true)  DrawTextOntoCanvas(12, "Track 4: OK", 4, 340, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[3] === true)  DrawTextOntoCanvas(12, "Track 3: OK", 4, 355, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[2] === true)  DrawTextOntoCanvas(12, "Track 2: OK", 4, 370, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[1] === true)  DrawTextOntoCanvas(12, "Track 1: OK", 4, 385, "left", 0, 0, 0, 141, 81, 0, 1);
	if (MusicIsCompletelyLoaded[0] === true)  DrawTextOntoCanvas(12, "Track 0: OK", 4, 400, "left", 0, 0, 0, 141, 81, 0, 1);

	if (HTML5LocalStorageSupported === false)
		DrawTextOntoCanvas(12, "HTML5 Local Storage = N.A.", 4, 425, "left", 0, 0, 0, 141, 81, 0, 1);
	else
		DrawTextOntoCanvas(12, "HTML5 Local Storage = Available", 4, 425, "left", 0, 0, 0, 141, 81, 0, 1);

	DrawTextOntoCanvas(12, ""+navigator.userAgent+"", 4, 440, "left", 0, 0, 0, 141, 81, 0, 1);
    
        DrawTextOntoCanvas(12, "["+Math.floor(BrowserWidth)+","+Math.floor(BrowserHeight)+"]-Audio["+SoundType+"/"+CurrentlyPlayingMusicTrack+"/"+MusicVolume+","+SoundVolume+"]", 4, 455, "left", 0, 0, 0, 141, 81, 0, 1);
    
        DrawTextOntoCanvas(12, "FPS="+FPS+" ["+MouseX+","+MouseY+"]-"+Browser+"", 4, 470, "left", 0, 0, 0, 141, 81, 0, 1);
    }

    ScreenIsDirty = false;

	if (CursorIsArrow === true)  document.body.style.cursor = "default";
    else if (CursorIsArrow === false)  document.body.style.cursor = "pointer";
    
    ApplyScreenFade();

    if (DelayAllUserInput > 0)
    {
        DelayAllUserInput--;
    }

    if (KeyboardCharacterPressed === "~")
    {
		NextScreenToDisplay = 3;
		ScreenFadeStatus = 1;
    }
    
    if (KeyboardCharacterPressed === "D" && ScreenToDisplay === 2)
    {
        DEBUG = !DEBUG;
        PlaySoundEffect(0);
        ScreenIsDirty = true;
    }

    KeyboardCharacterPressed = "";
    MouseButtonClicked = false;
}

//--------------------------------------------------------------------------------------------------------------
function DisplayLoadingNowScreen()
{
var allResourcesLoaded = false;
var percent;
var index;

    if (VisualsLoaded === false)
    {
        allResourcesLoaded = true;
        LoadTimer = 0;

        if (CursorSprite[0].complete === false)  allResourcesLoaded = false;
        else LoadTimer++;

        if (CursorSprite[1].complete === false)  allResourcesLoaded = false;
        else LoadTimer++;
		
        if (OriginalButtonSprite.complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;
        
        if (GUIArrowsSprites[0].complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        if (GUIArrowsSprites[1].complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        if (GUISelectorLineSprite.complete === false)  allResourcesLoaded = false;
        else  LoadTimer++;

        for (index = 0; index < NumberOfSprites; index++)
        {
            if (ImageSprites[index].src !== '')
            {
            if (ImageSprites[index].complete === false)  allResourcesLoaded = false;
            else  LoadTimer++;
            }
        }
		
        if (allResourcesLoaded === true)
        {
            VisualsLoaded = true;

            LoadSound();
        }
    }
    else if (AudioCacheLoaded === false)
    {
        allResourcesLoaded = false;
		
        LoadTimer = NumberOfLoadedImages;
        for (index = 0; index < NumberOfMusics; index++)
        {
            if (MusicIsCompletelyLoaded[index] === true)  LoadTimer++;
            if (SoundType === "null")  LoadTimer = NumberOfLoadedImages+NumberOfMusics;
        }

        if (  LoadTimer > (NumberOfLoadedImages+NumberOfMusics-1)  )  allResourcesLoaded = true;

        if (allResourcesLoaded === true && ScreenFadeStatus === -1)
        {
            AudioCacheLoaded = true;
        }
    }
    else
    {
        LoadTimer = 0;

        var importedJSOne = document.createElement('script');
        importedJSOne.src = 'dictionaryAM.js';
        document.head.appendChild(importedJSOne);

        var importedJSTwo = document.createElement('script');
        importedJSTwo.src = 'dictionaryNZ.js';
        document.head.appendChild(importedJSTwo);

        if (FirstRunCheckAudio === true)  NextScreenToDisplay = 1;
		else  NextScreenToDisplay = 2;
        
        ScreenFadeStatus = 1;
    }

    NowLoadingTextBlink = 0;

//    if (ScreenIsDirty === true)
    {
        ctx.clearRect(0, 0, screenWidth, screenHeight);

        percent = ( LoadTimer / (NumberOfLoadedImages+NumberOfMusics) ) * 100;
        percent = Math.floor(percent);
        if ( LoadTimer === (NumberOfLoadedImages+NumberOfMusics) )  percent = 100;
        
        DrawTextOntoCanvas(25, "Loading now...Please wait!", 320+NowLoadingTextBlink, 240-20, "center", 255, 255, 255, 100, 100, 100, 1);

        if (AudioCacheLoaded === false)  DrawTextOntoCanvas(25, ""+percent+"%", 320, 240+20, "center", 255, 255, 255, 100, 100, 100, 1);
        else  DrawTextOntoCanvas(25, "100%", 320, 240+20, "center", 255, 255, 255, 100, 100, 100, 1);
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        CreateButtonsWithText();

        PreloadAllStaffTexts();
    }
}

//--------------------------------------------------------------------------------------------------------------
function Display1stRunAudioOption()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
	
    }
    
    if (SoundType === "null")
    {
        ScreenFadeStatus = 1;
        NextScreenToDisplay = 2;
    }
    
    if ( MouseX > ( (320-130)-(16*7) ) && MouseX < ( (320-130)+(16*7) ) && MouseY > ( 300-(16*7) ) && MouseY < ( 300+(16*7) ) )
    {
        CursorIsArrow = false;

        if (MouseButtonClicked === true)
        {
            ScreenFadeStatus = 1;
            NextScreenToDisplay = 2;

            MusicVolume = 0;
            SoundVolume = 0;

            SaveOptions();
        }
    }
    else if ( MouseX > ( (320+130)-(16*7) ) && MouseX < ( (320+130)+(16*7) ) && MouseY > ( 300-(16*7) ) && MouseY < ( 300+ (16*7) ) )
    {
        CursorIsArrow = false;

        if (MouseButtonClicked === true)
        {
            ScreenFadeStatus = 1;
            NextScreenToDisplay = 2;

            MusicVolume = .5;
            SoundVolume = .5;

            SaveOptions();
        }
    }
    else  CursorIsArrow = true;

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawTextOntoCanvas(25, "1st Time Run", 320, 50, "center", 255, 255, 255, 100, 100, 100, 1);
        DrawTextOntoCanvas(25, "Choose Audio Preference:", 320, 130, "center", 255, 255, 255, 100, 100, 100, 1);

        DrawSpriteOntoCanvas(5, 320-130, 300, 7, 7, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, "AUDIO OFF", 320-130, 460, "center", 255, 255, 255, 100, 100, 100, 1);
        DrawSpriteOntoCanvas(6, 320+130, 300, 7, 7, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, "AUDIO ON", 320+130, 460, "center", 255, 255, 255, 100, 100, 100, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {

	}
}

//--------------------------------------------------------------------------------------------------------------
function DisplaySixteenBitSoftScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        SixteenBitSoftScreenTimer = 200;

        if (RandomizeMusicTrack === true)  PlayerSelectedMusic = Math.floor( (Math.random() * 8) );
        PlayMusic(PlayerSelectedMusic);
    }

    if (MouseButtonClicked === true || SpacebarPressed === true/*KeyboardCharacterPressed === "_"*/ || KeyboardCharacterPressed === "/")
    {
        SixteenBitSoftScreenTimer = 0;
        DelayAllUserInput = 20;
    }
    
    if (SixteenBitSoftScreenTimer > 0)  SixteenBitSoftScreenTimer--;
    else
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }
      
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(10, 320, 240, 1, 1, 0, 1, 255, 255, 255);
    
        DrawTextOntoCanvas(20, "www.FallenAngelSoftware.com", 320, 475-25, "center", 0, 255, 0, 0, 100, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {

	}
}

//--------------------------------------------------------------------------------------------------------------
function DisplayTitleScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        var startScreenY = 195;
        var screenYOffset = 43;

        CreateButton(0, 320, startScreenY);
        CreateButton( 1, 320, startScreenY+(screenYOffset) );
        CreateButton( 2, 320, startScreenY+(2*screenYOffset) );
        CreateButton( 3, 320, startScreenY+(3*screenYOffset) );
        CreateButton( 4, 320, startScreenY+(4*screenYOffset) );
        CreateButton( 5, 320, startScreenY+(5*screenYOffset) );

		if (SoundVolume > 0 || MusicVolume > 0)  CreateIcon(6, 15, 15);
		else  CreateIcon(5, 15, 15);
		
		CreateIcon(15, 65, 480-65);
	}
    
    if (ThisButtonWasPressed(0) === true)
    {
        NextScreenToDisplay = 8;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(1) === true)
    {
        NextScreenToDisplay = 4;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(2) === true)
    {
        NextScreenToDisplay = 5;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(3) === true)
    {
        NextScreenToDisplay = 6;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(4) === true)
    {
        NextScreenToDisplay = 7;
        ScreenFadeStatus = 1;
    }     
    else if (ThisButtonWasPressed(5) === true)
    {
        NextScreenToDisplay = -1;
        ScreenFadeStatus = 1;
    }
	
	if (IconSelectedByPlayer === 0)
	{
		if (SoundVolume > 0 || MusicVolume > 0) { SoundVolume = 0; MusicVolume = 0; IconSpriteIndex[0] = 5;}
		else  { SoundVolume = .5; MusicVolume = .5; IconSpriteIndex[0] = 6; }

		PlaySoundEffect(0);
		MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
		if (MusicArray[CurrentlyPlayingMusicTrack].isPlaying === false)  MusicArray[CurrentlyPlayingMusicTrack].play();
		
		SaveOptions();

		ScreenIsDirty = true;
	}
	else if (IconSelectedByPlayer === 1)
	{
		window.open('https://github.com/FallenAngelSoftware/JavaScript-LettersFall','_self');
	}
	
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(30, 320, 70, 1, 1, 0, 1, 255, 255, 255);

        DrawTextOntoCanvas(25, "''"+HighScoresName[GameMode][0]+"'' Scored: "+HighScoresScore[GameMode][0]+"", 320, 168, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawSpriteOntoCanvas(9, 600, 410, 1, 1, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(15, "Version 5.0+", 640-5, 475, "right", 255, 255, 255, 0, 0, 0, 1);
	
        DrawTextOntoCanvas(20, "\u00A92018, By Team Fallen Angel Software", 320, 475-24, "center", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "www.FallenAngelSoftware.com", 320, 475, "center", 255, 255, 255, 0, 0, 0, 1);
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (NextScreenToDisplay === -1)  window.open('https://fallenangelsoftware.com','_self');
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayOptionsScreen()
{
var screenX;
var offsetX;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateArrowSet(0, 320, 85);
        CreateArrowSet(1, 320, 125);
        CreateArrowSet(2, 320, 180);
        CreateArrowSet(3, 320, 220);
        CreateArrowSet(4, 320, 260);
        CreateArrowSet(5, 320, 300);

        CreateButton(6, 320, 455);
    }

    if (ThisArrowSetArrowWasPressed(0) === true)
    {
        if (MusicVolume > 0)  MusicVolume-=.25;
        else  MusicVolume = 1;

        MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;

        if (MusicArray[CurrentlyPlayingMusicTrack].isPlaying === false)  MusicArray[CurrentlyPlayingMusicTrack].play();
    }
    else if (ThisArrowSetArrowWasPressed(.5) === true)
    {
        if (MusicVolume < 1)  MusicVolume+=.25;
        else  MusicVolume = 0;

        MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
        if (MusicArray[CurrentlyPlayingMusicTrack].isPlaying === false)  MusicArray[CurrentlyPlayingMusicTrack].play();
    }
    else if (ThisArrowSetArrowWasPressed(1) === true)
    {
        if (SoundVolume > 0)  SoundVolume-=.25;
        else  SoundVolume = 1;

        PlaySoundEffect(0);
    }
    else if (ThisArrowSetArrowWasPressed(1.5) === true)
    {
        if (SoundVolume < 1)  SoundVolume+=.25;
        else  SoundVolume = 0;

        PlaySoundEffect(0);
    }
    else if (ThisArrowSetArrowWasPressed(2) === true)
    {
        if (GameMode > 0)  GameMode--;
        else  GameMode = 3;
    }
    else if (ThisArrowSetArrowWasPressed(2.5) === true)
    {
        if (GameMode < 3)  GameMode++;
        else  GameMode = 0;
    }
    else if (ThisArrowSetArrowWasPressed(3) === true)
    {
        if (SelectedBackground > 0)  SelectedBackground--;
        else  SelectedBackground = 5;
    }
    else if (ThisArrowSetArrowWasPressed(3.5) === true)
    {
        if (SelectedBackground < 5)  SelectedBackground++;
        else  SelectedBackground = 0;
    }
    else if (ThisArrowSetArrowWasPressed(4) === true)
    {
        if (MusicVolume > 0 && RandomizeMusicTrack === 0)
        {
            if (PlayerSelectedMusic > 0)  PlayerSelectedMusic--;
            else  PlayerSelectedMusic = 7;

            PlayMusic(PlayerSelectedMusic);
        }
    }
    else if (ThisArrowSetArrowWasPressed(4.5) === true)
    {
        if (MusicVolume > 0 && RandomizeMusicTrack === 0)
        {
            if (PlayerSelectedMusic < 7)  PlayerSelectedMusic++;
            else  PlayerSelectedMusic = 0;

            PlayMusic(PlayerSelectedMusic);
        }
    }
    else if (ThisArrowSetArrowWasPressed(5) === true)
    {
        if (MusicVolume > 0)
        {
            if (RandomizeMusicTrack === 0)  RandomizeMusicTrack = 1;
            else  RandomizeMusicTrack = 0;

            if (RandomizeMusicTrack === true)  PlayerSelectedMusic = Math.floor( (Math.random() * 8) );
            PlayMusic(PlayerSelectedMusic);
        }
    }
    else if (ThisArrowSetArrowWasPressed(5.5) === true)
    {
        if (MusicVolume > 0)
        {
            if (RandomizeMusicTrack === 0)  RandomizeMusicTrack = 1;
            else  RandomizeMusicTrack = 0;

            if (RandomizeMusicTrack === true)  PlayerSelectedMusic = Math.floor( (Math.random() * 8) );
            PlayMusic(PlayerSelectedMusic);
        }
    }
  
    if (ThisButtonWasPressed(0) === true)
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }     

    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "O P T I O N S:", 320, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "______________________________________", 320, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawAllArrowSets();

        DrawTextOntoCanvas(20, "Music Volume:", 50, 85-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (MusicVolume === 0)  DrawTextOntoCanvas(20, "OFF", 640-50, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .25)  DrawTextOntoCanvas(20, "25%", 640-50, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .5)  DrawTextOntoCanvas(20, "50%", 640-50, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === .75)  DrawTextOntoCanvas(20, "75%", 640-50, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (MusicVolume === 1)  DrawTextOntoCanvas(20, "100%", 640-50, 85-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Sound Effects Volume:", 50, 125-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (SoundVolume === 0)  DrawTextOntoCanvas(20, "OFF", 640-50, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .25)  DrawTextOntoCanvas(20, "25%", 640-50, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .5)  DrawTextOntoCanvas(20, "50%", 640-50, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === .75)  DrawTextOntoCanvas(20, "75%", 640-50, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SoundVolume === 1)  DrawTextOntoCanvas(20, "100%", 640-50, 125-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "______________________________________", 320, 127, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Game Mode:", 50, 180-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (GameMode === 0)  DrawTextOntoCanvas(20, "Child Neverending", 640-50, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 1)  DrawTextOntoCanvas(20, "Teenager Neverending", 640-50, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 2)  DrawTextOntoCanvas(20, "Adult Neverending", 640-50, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 3)  DrawTextOntoCanvas(20, "Time Attack 15 Minutes", 640-50, 180-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Background Image:", 50, 220-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (SelectedBackground === 0)  DrawTextOntoCanvas(20, "Waterfall", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SelectedBackground === 1)  DrawTextOntoCanvas(20, "Water Droplets", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SelectedBackground === 2)  DrawTextOntoCanvas(20, "Kittens", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SelectedBackground === 3)  DrawTextOntoCanvas(20, "Puppies", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SelectedBackground === 4)  DrawTextOntoCanvas(20, "Chalkboard", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);
        else if (SelectedBackground === 5)  DrawTextOntoCanvas(20, "Beach Sunset", 640-50, 220-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Music Track:", 50, 260-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (MusicVolume > 0)
        {
            if (RandomizeMusicTrack === 0)
            {
            if (PlayerSelectedMusic === 0)  DrawTextOntoCanvas(20, "Music Track #1", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 1)  DrawTextOntoCanvas(20, "Music Track #2", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 2)  DrawTextOntoCanvas(20, "Music Track #3", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 3)  DrawTextOntoCanvas(20, "Music Track #4", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 4)  DrawTextOntoCanvas(20, "Music Track #5", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 5)  DrawTextOntoCanvas(20, "Music Track #6", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 6)  DrawTextOntoCanvas(20, "Music Track #7", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (PlayerSelectedMusic === 7)  DrawTextOntoCanvas(20, "Music Track #8", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
            }
            else  DrawTextOntoCanvas(20, "Random", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);
        }
        else  DrawTextOntoCanvas(20, "Music Volume OFF", 640-50, 260-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "Music Jukebox:", 50, 300-15, "left", 255, 255, 255, 0, 0, 0, 1);
        if (MusicVolume > 0)
        {
            if (RandomizeMusicTrack === 0)  DrawTextOntoCanvas(20, "Repeat Above Music Track", 640-50, 300-15, "right", 255, 255, 255, 0, 0, 0, 1);
            else if (RandomizeMusicTrack === 1)  DrawTextOntoCanvas(20, "Random Music Track", 640-50, 300-15, "right", 255, 255, 255, 0, 0, 0, 1);
        }
        else  DrawTextOntoCanvas(20, "Music Volume OFF", 640-50, 300-15, "right", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(25, "______________________________________", 320, 304, "center", 255, 255, 255, 0, 0, 0, 1);

        screenX = 58;
        offsetX = 80;
        DrawSpriteOntoCanvas(100+8, screenX, 370, 2.1, 2.1, 0, .75, 255, 64, 255);
        DrawSpriteOntoCanvas(100+1, screenX+(offsetX), 370, 2.1, 2.1, 0, .75, 255, 64, 255);
        DrawSpriteOntoCanvas(100+22, screenX+(2*offsetX), 370, 2.1, 2.1, 0, .75, 255, 64, 255);
        DrawSpriteOntoCanvas(100+5, screenX+(3*offsetX), 370, 2.1, 2.1, 0, .75, 255, 64, 255);

        screenX = 420;
        offsetX = 80;
        DrawSpriteOntoCanvas(100+6, screenX, 370, 2.1, 2.1, 0, .75, 255, 64, 255);
        DrawSpriteOntoCanvas(100+21, screenX+(offsetX), 370, 2.1, 2.1, 0, .75, 255, 64, 255);
        DrawSpriteOntoCanvas(100+14, screenX+(2*offsetX), 370, 2.1, 2.1, 0, .75, 255, 64, 255);

        DrawTextOntoCanvas(25, "______________________________________", 320, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }
    
    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
		
    }
}    

//--------------------------------------------------------------------------------------------------------------
function DisplayHowToPlayScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
		CreateButton(6, 320, 455);
    }
            
    if (ThisButtonWasPressed(0) === true)
    {
		NextScreenToDisplay = 3;
		ScreenFadeStatus = 1;
    }     
        
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "H O W   T O   P L A Y:", 320, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "______________________________________", 320, 30, "center", 255, 255, 0, 0, 0, 0, 1);

		DrawSpriteOntoCanvas(29, 320, 220, 1, 1, 0, 1, 255, 255, 255);

		DrawTextOntoCanvas(25, "______________________________________", 320, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
		
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayHighScoresScreen()
{
    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateArrowSet(0, 320, 85);

        CreateButton(6, 320, 455);
    }
            
    if (ThisArrowSetArrowWasPressed(0) === true)
    {
        if (GameMode > 0)  GameMode--;
        else  GameMode = 3;
    }
    else if (ThisArrowSetArrowWasPressed(.5) === true)
    {
        if (GameMode < 3)  GameMode++;
        else  GameMode = 0;
    }

    if (KeyboardCharacterPressed === "C")
    {
        InitializeHighScores();
        DelayAllUserInput = 20;
        PlaySoundEffect(7);
        ScreenIsDirty = true;
    }
    
    if (ThisButtonWasPressed(0) === true)
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }     
        
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "H I G H   S C O R E S:", 320, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "______________________________________", 320, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawAllArrowSets();

        if (GameMode === 0)  DrawTextOntoCanvas(20, "Child Neverending Mode", 320, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 1)  DrawTextOntoCanvas(20, "Teenager Neverending Mode", 320, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 2)  DrawTextOntoCanvas(20, "Adult Neverending Mode", 320, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);
        else if (GameMode === 3)  DrawTextOntoCanvas(20, "Time Attack 15 Minutes Mode", 320, 85-15, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "NAME:", 36, 106, "left", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "LEVEL:", 406, 106, "left", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "SCORE:", 506, 106, "left", 255, 255, 255, 0, 0, 0, 1);

        var greenBlue = 255;
        var y = 130;
        for (var index = 1; index < 11; index++)
        {
            var indexAdjusted = index - 1;

            if ( Score === parseInt(HighScoresScore[GameMode][indexAdjusted]) && Level === parseInt(HighScoresLevel[GameMode][indexAdjusted]) )
            {
				greenBlue= 0;
            }
            else
            {
				greenBlue = 255;
            }

            DrawTextOntoCanvas(20, ""+index+".", 6, y, "left", 255, 255, 255, 0, 0, 0, 1);

            DrawTextOntoCanvas(20, HighScoresName[GameMode][indexAdjusted], 36, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            DrawTextOntoCanvas(20, ""+HighScoresLevel[GameMode][indexAdjusted]+"", 406, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            DrawTextOntoCanvas(20, ""+HighScoresScore[GameMode][indexAdjusted]+"", 506, y, "left", 255, greenBlue, greenBlue, 0, 0, 0, 1);

            y+=32;
        }

        DrawTextOntoCanvas(25, "______________________________________", 320, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
		
    }
}

//--------------------------------------------------------------------------------------------------------------
function SetupStaffTextsScreenY()
{
var screenY = 450;

    for (var index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
    {
        if (PreloadedStaffTextsBlue[index] === 0)
        {
            screenY+=70;
            PreloadedStaffTextsScreenY[index] = screenY;
        }
        else if (PreloadedStaffTextsBlue[index] === 255)
        {
            screenY+=30;
            PreloadedStaffTextsScreenY[index] = screenY;
        }

        PreloadedStaffTextsScreenY[NumberOfPreloadedStaffTexts]+=240;
    }
}
    
//--------------------------------------------------------------------------------------------------------------
function DisplayAboutScreen()
{
var index;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        SetupStaffTextsScreenY();
        Framerate = 30;
    }

    for (index = 0; index < (NumberOfPreloadedStaffTexts+1); index++)
    {
        PreloadedStaffTextsScreenY[index]-=2;
    }
   
    if (PreloadedStaffTextsScreenY[NumberOfPreloadedStaffTexts] < -30 || MouseButtonClicked === true || SpacebarPressed === true/*KeyboardCharacterPressed === "_"*/ || KeyboardCharacterPressed === "/")
    {
        NextScreenToDisplay = 3;
        ScreenFadeStatus = 1;
    }
      
//    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 255, 255, 255);
    
        DrawPreloadedStaffTextOntoCanvas(0, 387, PreloadedStaffTextsScreenY[0]+50);
        for (index = 1; index < (NumberOfPreloadedStaffTexts+1); index++)  DrawPreloadedStaffTextOntoCanvas(index, 320, PreloadedStaffTextsScreenY[index]);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        Framerate = 60;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayPlayingGameScreen()
{
var index;

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        SetupForNewGame();

		if (SoundVolume > 0 || MusicVolume > 0)  CreateIcon(6, 480, 15);
		else  CreateIcon(5, 480, 15);
    }
    
    if (PAUSEgame === false && GameOver === -1)  RunGameplayEngine();

    if (SpacebarPressed === true/*KeyboardCharacterPressed === "_"*/ && GameOver === -1)
    {
        if (PAUSEgame === false)  PAUSEgame = true;
		else if (PAUSEgame === true)  PAUSEgame = false;
        DelayAllUserInput = 20;
		ScreenIsDirty = true;
	}

	if (IconSelectedByPlayer === 0)
	{
		if (SoundVolume > 0 || MusicVolume > 0) { SoundVolume = 0; MusicVolume = 0; IconSpriteIndex[0] = 5;}
		else  { SoundVolume = .5; MusicVolume = .5; IconSpriteIndex[0] = 6; }

		PlaySoundEffect(0);
		MusicArray[CurrentlyPlayingMusicTrack].volume = MusicVolume;
		if (MusicArray[CurrentlyPlayingMusicTrack].isPlaying === false)  MusicArray[CurrentlyPlayingMusicTrack].play();
		
		SaveOptions();

		ScreenIsDirty = true;
	}
  
    if (FallingLettersScreenY[0] > 90)
    {
        ctxFallingLetters.drawImage( ImageSprites[20+SelectedBackground], FallingLettersScreenX[0]-19, FallingLettersScreenY[0]-90, 39, 30*3
                      , FallingLettersScreenX[0]-19, FallingLettersScreenY[0]-90, 39, 30*3 );

        ctxFallingLetters.globalAlpha = .75;

        ctxFallingLetters.drawImage( ImageSprites[0], FallingLettersScreenX[0]-19, FallingLettersScreenY[0]-90, 39, 30*3
                      , FallingLettersScreenX[0]-19, FallingLettersScreenY[0]-90, 39, 30*3 );

        ctxFallingLetters.globalAlpha = 1;

        if (FallingLetters[0] === 255 && ExplosionScale === -1)
        {
            ctxFallingLetters.drawImage( ImageSprites[52], (FallingLettersScreenX[0] - 15), (FallingLettersScreenY[0] - 16), 31, 32 );
        }
        else if (FallingLetters[0] > 0 && FallingLetters[0] < 255)
        {
            if (FallingLetters[1] === 0)
            {
                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[0] ], (FallingLettersScreenX[0] - 19), (FallingLettersScreenY[0] - 15), 39, 30 );
            }
            else if (FallingLetters[2] === 0)
            {
                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[1] ], (FallingLettersScreenX[1] - 19), (FallingLettersScreenY[1] - 15), 39, 30 );

                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[0] ], (FallingLettersScreenX[0] - 19), (FallingLettersScreenY[0] - 15), 39, 30 );
            }
            else
            {
                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[2] ], (FallingLettersScreenX[2] - 19), (FallingLettersScreenY[2] - 15), 39, 30 );

                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[1] ], (FallingLettersScreenX[1] - 19), (FallingLettersScreenY[1] - 15), 39, 30 );

                ctxFallingLetters.drawImage( ButtonsWithCharsCanvases[ FallingLetters[0] ], (FallingLettersScreenX[0] - 19), (FallingLettersScreenY[0] - 15), 39, 30 );
            }
        }
    }
    else  ScreenIsDirty = true;
    
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
	
        DrawSpriteOntoCanvas(41, 640-16, 16, 1, 1, 0, 1, 255, 255, 255);
	
        DrawSpriteOntoCanvas(40, 320, 218, 1, 1, 0, .75, 255, 255, 255);

        if (GameMode === 3)
        {
            if (TimeAttackSeconds > 9)  DrawTextOntoCanvas(25, ""+TimeAttackMinutes+":"+TimeAttackSeconds+"", 550, 24, "center", 255, 255, 255, 0, 0, 0, 1);
            else  DrawTextOntoCanvas(25, ""+TimeAttackMinutes+":0"+TimeAttackSeconds+"", 550, 24, "center", 255, 255, 255, 0, 0, 0, 1);
        }

        if (FallingLetters[0] === 255 && ExplosionScale === -1)
        {
            DrawSpriteOntoCanvas(52, FallingLettersScreenX[0], FallingLettersScreenY[0], 1, 1, 0, 1, 255, 255, 255);
        }
        else if (FallingLetters[0] > 0 && FallingLetters[0] < 255)
        {
            if (FallingLetters[1] === 0)
            {
                DrawSpriteOntoCanvas(100+FallingLetters[0], FallingLettersScreenX[0], FallingLettersScreenY[0], 1, 1, 0, 1, 255, 255, 255);
            }
            else if (FallingLetters[2] === 0)
            {
                DrawSpriteOntoCanvas(100+FallingLetters[1], FallingLettersScreenX[1], FallingLettersScreenY[1], 1, 1, 0, 1, 255, 255, 255);

                DrawSpriteOntoCanvas(100+FallingLetters[0], FallingLettersScreenX[0], FallingLettersScreenY[0], 1, 1, 0, 1, 255, 255, 255);
            }
            else
            {
                DrawSpriteOntoCanvas(100+FallingLetters[2], FallingLettersScreenX[2], FallingLettersScreenY[2], 1, 1, 0, 1, 255, 255, 255);

                DrawSpriteOntoCanvas(100+FallingLetters[1], FallingLettersScreenX[1], FallingLettersScreenY[1], 1, 1, 0, 1, 255, 255, 255);

                DrawSpriteOntoCanvas(100+FallingLetters[0], FallingLettersScreenX[0], FallingLettersScreenY[0], 1, 1, 0, 1, 255, 255, 255);
            }
        }

        var tileX = 27;
        var tileY = 26-(30*3);
        var redHue = 255;
        var greenHue = 255;
        var blueHue = 255;
        var transparency = 1;
        for (var y = 0; y < 17; y++)
        {
            for (var x = 0; x < 11; x++)
            {
                if (Playfield[x][y] > 0)
                {
                    redHue = 255;
                    greenHue = 255;
                    blueHue = 255;

                    for (index = 0; index < 11; index++)
                    {
                        if (SelectedLetterPlayfieldX[index] === x && SelectedLetterPlayfieldY[index] === y)
                        {
                        redHue = 0;
                        greenHue = 128;
                        blueHue = 0;
                        transparency = ClearWordTransparency;
                        }
                    }

                    if (Playfield[x][y] > 0 && Playfield[x][y] < 255)
                    DrawSpriteOntoCanvas(100+Playfield[x][y], tileX, tileY, 1, 1, 0, transparency, redHue, greenHue, blueHue);

                    redHue = 255;
                    greenHue = 255;
                    blueHue = 255;
                    transparency = 1;
                }

                tileX+=41;
            }

            tileX = 27;
            tileY+=30;
        }

        var screenX = 27;
        for (index = 0; index < 11; index++)
        {
        if (SelectedLetterPlayfieldX[index] !== -1 && SelectedLetterPlayfieldY[index] !== -1)
        {
            DrawSpriteOntoCanvas(100+Playfield[SelectedLetterPlayfieldX[index]][SelectedLetterPlayfieldY[index]], screenX, 457, 1, 1, 0, ClearWordTransparency, 255, 255, 255);
        }
            else index = 999;

            screenX+=41;
        }

        DrawSpriteOntoCanvas(45, 550, 52, 1, 1, 0, 1, 255, 255, 255);

        if (NextLetters[0] === 255 && ExplosionScale === -1)
        {
            DrawSpriteOntoCanvas(52, 550, 91, 1, 1, 0, 1, 255, 255, 255);
        }
        else if (NextLetters[1] === 0)
        {
            DrawSpriteOntoCanvas(100+NextLetters[0], 550, 91, 1, 1, 0, 1, 255, 255, 255);
        }
        else if (NextLetters[2] === 0)
        {
            DrawSpriteOntoCanvas(100+NextLetters[1], 550-20, 91, 1, 1, 0, 1, 255, 255, 255);

            DrawSpriteOntoCanvas(100+NextLetters[0], 550+20, 91, 1, 1, 0, 1, 255, 255, 255);
        }
        else
        {
            DrawSpriteOntoCanvas(100+NextLetters[2], 550-40, 91, 1, 1, 0, 1, 255, 255, 255);

            DrawSpriteOntoCanvas(100+NextLetters[1], 550, 91, 1, 1, 0, 1, 255, 255, 255);

            DrawSpriteOntoCanvas(100+NextLetters[0], 550+40, 91, 1, 1, 0, 1, 255, 255, 255);
        }

        DrawSpriteOntoCanvas(46, 550, 123, 1, 1, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, ""+Level+"", 550, 136+30, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawSpriteOntoCanvas(47, 550, 188, 1, 1, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, ""+Score+"", 550, 201+30, "center", 255, 255, 255, 0, 0, 0, 1);

        DrawSpriteOntoCanvas(50, 550, 250, 1, 1, 0, 1, 255, 255, 255);
        for (var greenLineX = 477; greenLineX < (477+BombBonusMeterValue); greenLineX++)
        {
            DrawSpriteOntoCanvas(51, greenLineX, 250, 1, 1, 0, .75, 255, 255, 255);
        }

        DrawSpriteOntoCanvas(52, 496, 290, 1, 1, 0, 1, 255, 255, 255);
        DrawTextOntoCanvas(25, "x"+Bombs+"", 514+20, 270+30, "center", 255, 255, 255, 0, 0, 0, 1);

        if (Bombs > 0)
        {
            DrawSpriteOntoCanvas(53, 598, 290, BombButtonScale, BombButtonScale, 0, 1, 255, 255, 255);
        }

        DrawSpriteOntoCanvas(61, 550, 350, DownArrowScale, DownArrowScale, 0, 1, 255, 255, 255);

        if (FallingLetters[0] === 255)
        {
        DrawSpriteOntoCanvas(60, 495, 336, LeftArrowScale, LeftArrowScale, 0, 1, 255, 255, 255);

        DrawSpriteOntoCanvas(62, 605, 336, RightArrowScale, RightArrowScale, 0, 1, 255, 255, 255);
        }

        if (SelectedLetterPlayfieldX[1] !== -1 && SelectedLetterPlayfieldY[1] !== -1)
        {
            DrawSpriteOntoCanvas(70, 550, 406, ClearButtonScale, ClearButtonScale, 0, 1, 255, 255, 255);
        }

        if (SelectedLetterPlayfieldX[0] !== -1 && SelectedLetterPlayfieldY[0] !== -1)
        {
            DrawSpriteOntoCanvas(71, 496, 457, UndoButtonScale, UndoButtonScale, 0, 1, 255, 255, 255);
        }

        if (SelectedLetterPlayfieldX[2] !== -1 && SelectedLetterPlayfieldY[2] !== -1)
        {
            DrawSpriteOntoCanvas(72, 598, 457, CheckButtonScale, CheckButtonScale, 0, 1, CheckButtonRedHue, CheckButtonGreenHue, CheckButtonBlueHue);
        }

        if (ExplosionScale > -1)
        {
            DrawSpriteOntoCanvas(54, FallingLettersScreenX[0], FallingLettersScreenY[0], ExplosionScale, ExplosionScale, 0, ExplosionTransparency, 255, 255, 255);
        }

        if (GameOver > 0)
        {
            DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 128, 255, 255);
            DrawSpriteOntoCanvas(80, 320, 240, 1, 1, 0, 1, 255, 255, 255);

            GameOver--;
        }
        else if (GameOver === 0)
        {
            ScreenFadeStatus = 1;
        }

        if (PAUSEgame === true && DEBUG === false)
        {
            DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .75, 255, 255, 255);
            DrawTextOntoCanvas(55, "Game Paused!", 320, 240, "center", 255, 255, 255, 0, 0, 0, 1);
            DrawTextOntoCanvas(25, "Press [Spacebar] To Continue.", 320, 240+40, "center", 255, 255, 255, 0, 0, 0, 1);
        }
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        Framerate = 60;

        CheckForNewHighScores();

        if (NewHighScoreRank < 10)  NextScreenToDisplay = 9;
        else  NextScreenToDisplay = 6;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DisplayNewHighScoreNameInputScreen()
{
var screenX;
var index;
var characters //= new Array(65);
characters = "~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";

    if (ScreenFadeAlpha === 1 && ScreenFadeStatus === 0)
    {
        CreateButton(5, 320, 455);

        NewHighScoreNameIndex = 0;
        NewHighScoreTempName = "";

        screenX = 80;
        for (index = 1; index < 14; index++) // A-M
        {
            NewHighScoreCharButtonScreenX[index] = screenX;
            NewHighScoreCharButtonScreenY[index] = 200;

            screenX+=40;
        }

        screenX = 80;
        for (index = 14; index < 27; index++) // N-Z
        {
            NewHighScoreCharButtonScreenX[index] = screenX;
            NewHighScoreCharButtonScreenY[index] = 240;

            screenX+=40;
        }

        screenX = 80;
        for (index = 27; index < 40; index++) // a-m
        {
            NewHighScoreCharButtonScreenX[index] = screenX;
            NewHighScoreCharButtonScreenY[index] = 280;

            screenX+=40;
        }

        screenX = 80;
        for (index = 40; index < 53; index++) // n-z
        {
            NewHighScoreCharButtonScreenX[index] = screenX;
            NewHighScoreCharButtonScreenY[index] = 320;

            screenX+=40;
        }

        screenX = 80;
        for (index = 53; index < 66; index++) // 0-9
        {
            NewHighScoreCharButtonScreenX[index] = screenX;
            NewHighScoreCharButtonScreenY[index] = 360;

            screenX+=40;
        }

        NewHighScoreCharButtonScreenX[index] = 320;
        NewHighScoreCharButtonScreenY[index] = 400;

        for (index = 0; index < 67; index++)  NewHighScoreCharButtonScale[index] = 1;
    }

    for (index = 1; index < 67; index++)
    {
        if ( MouseY > (NewHighScoreCharButtonScreenY[index]-15)
        && MouseY < (NewHighScoreCharButtonScreenY[index]+15)
        && MouseX > (NewHighScoreCharButtonScreenX[index]-19)
        && MouseX < (NewHighScoreCharButtonScreenX[index]+19) )
        {
            CursorIsArrow = false;

            if (MouseButtonClicked === true)
            {
				NewHighScoreCharButtonScale[index] = 0.75;

				PlaySoundEffect(0);
				ScreenIsDirty = true;
            }
        }
    }

    for (index = 0; index < 67; index++)
    {
        if (NewHighScoreCharButtonScale[index] < 0.95)  NewHighScoreCharButtonScale[index]+=0.05;
        else if (NewHighScoreCharButtonScale[index] < 1)
        {
            if (index === 66)  ScreenFadeStatus = 1;
            else if (index === 65)
            {
                NewHighScoreTempName = NewHighScoreTempName.substring(0, NewHighScoreTempName.length - 1);
                if (NewHighScoreNameIndex > 0)  NewHighScoreNameIndex--;
            }

            if (index > 0 && index < 65 && NewHighScoreNameIndex < 13)
            {
                if (index > 0 && index < 27)  NewHighScoreTempName += String.fromCharCode(65+index-1);
                else if (index > 26 && index < 53)  NewHighScoreTempName += String.fromCharCode(97+index-26-1);
                else if (index > 52 && index < 63)  NewHighScoreTempName += String.fromCharCode(48+index-52-1);
                else if (index === 63)  NewHighScoreTempName += "+";
                else if (index === 64)  NewHighScoreTempName += " ";
				
                if (NewHighScoreNameIndex < 13)  NewHighScoreNameIndex++;
            }

            NewHighScoreCharButtonScale[index] = 1;

            ScreenIsDirty = true;
        }
    }

    if (KeyboardCharacterPressed !== "")
    {
		if (KeyboardCharacterPressed === "/")   ScreenFadeStatus = 1;
		else if (KeyboardCharacterPressed === "=")
		{
			NewHighScoreCharButtonScale[65] = 0.75;
			ScreenIsDirty = true;
		}
		else if (NewHighScoreNameIndex < 13)
		{
			if (SpacebarPressed === true)//KeyboardCharacterPressed === "_")
			{
				NewHighScoreCharButtonScale[64] = 0.75;
				
				ScreenIsDirty = true;
			}
			else
			{
				for (index = 1; index < 64; index++)
				{
					if (characters[index] === KeyboardCharacterPressed)  NewHighScoreCharButtonScale[index] = 0.75;
					ScreenIsDirty = true;
				}
			}
		}
    }

    if (ThisButtonWasPressed(0) === true)
    {
		ScreenFadeStatus = 1;
    }     
     
    if (ScreenIsDirty === true)
    {
        DrawSpriteOntoCanvas(20+SelectedBackground, 320, 240, 1, 1, 0, 1, 255, 255, 255);
        DrawSpriteOntoCanvas(0, 320, 240, 1, 1, 0, .5, 255, 255, 255);

        DrawTextOntoCanvas(25, "N E W   H I G H   S C O R E   N A M E   I N P U T:", 320, 26, "center", 255, 255, 0, 0, 0, 0, 1);
        DrawTextOntoCanvas(25, "______________________________________", 320, 30, "center", 255, 255, 0, 0, 0, 0, 1);

        DrawTextOntoCanvas(20, "You achieved a new high score!", 320, 60, "center", 255, 255, 255, 0, 0, 0, 1);
        DrawTextOntoCanvas(20, "Please enter your name using the mouse or keyboard:", 320, 85, "center", 255, 255, 255, 0, 0, 0, 1);

        if (NewHighScoreTempName[0] !== "")  DrawTextOntoCanvas(55, ""+NewHighScoreTempName+"", 320, 148, "center", 255, 255, 255, 0, 0, 0, 1);

        for (index = 1; index < 67; index++)
        {
            DrawSpriteOntoCanvas(100+index, NewHighScoreCharButtonScreenX[index], NewHighScoreCharButtonScreenY[index], NewHighScoreCharButtonScale[index], NewHighScoreCharButtonScale[index], 0, 1, 255, 255, 255);
        }

        DrawTextOntoCanvas(25, "______________________________________", 320, 424, "center", 255, 255, 0, 0, 0, 0, 1);
    }

    if (ScreenFadeAlpha === .99 && ScreenFadeStatus === 1)
    {
        if (NewHighScoreTempName === "")  NewHighScoreTempName = " ";

        HighScoresName[GameMode][NewHighScoreRank] = NewHighScoreTempName;

        NextScreenToDisplay = 6
    }
}
