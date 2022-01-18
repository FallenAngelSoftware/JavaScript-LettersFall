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

// "initialize.js"...

var InitLoaded = false; 
 
var VisualsLoaded = false;
var AudioCacheLoaded = false;

var SoundType = null;

var MouseX = 0;
var MouseY = 0;

var Browser = "null";

var AppHasFocus = true;

var WebsiteRunOnServer = false;

var AppStart = new Date().getTime();
var NextSecond = AppStart+1000;

var Framerate = 60;

//--------------------------------------------------------------------------------------------------------------
function InitSettings()
{
    if ( navigator.userAgent.toLowerCase().indexOf('android') > -1 )
        Browser = "Google Android";
    else if ( navigator.userAgent.toLowerCase().indexOf('iphone') > -1
        || navigator.userAgent.toLowerCase().indexOf('ipad') > -1
        || navigator.userAgent.toLowerCase().indexOf('ipod') > -1 )
        Browser = "Apple iOS";
    else if ( navigator.userAgent.toLowerCase().indexOf('mobile') > -1 )
        Browser = "Mobile Unknown";
    else if ( navigator.userAgent.toLowerCase().indexOf('viera') > -1 )
        Browser = "Viera Smart T.V.";
    else if ( navigator.userAgent.toLowerCase().indexOf('edge') > -1 )
        Browser = "MS Edge";
    else if ( navigator.userAgent.toLowerCase().indexOf('opera') > -1
        || navigator.userAgent.toLowerCase().indexOf('opr') > -1 )
        Browser = "Opera";
    else if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )
        Browser = "Chrome";
    else if ( navigator.userAgent.toLowerCase().indexOf('firefox') > -1 )
        Browser = "Firefox";
    else if ( navigator.userAgent.toLowerCase().indexOf('ie') > -1
        || navigator.userAgent.toLowerCase().indexOf('trident') > -1 )
        Browser = "MS IE";
    else if ( navigator.userAgent.toLowerCase().indexOf('safari') > -1 )
        Browser = "Safari";
    else
        Browser = "UNKNOWN Browser";


    SoundType = "null";
    var audioTest = document.createElement('audio');
    if ( audioTest.canPlayType('audio/mpeg;') )  SoundType = "mp3";
    else  if ( audioTest.canPlayType('audio/ogg;') )  SoundType = "ogg";
    
   var canvas = document.createElement('canvas');
   var canvasFallingLetters = document.createElement('canvas');
   if ( Browser === "Google Android" || Browser === "Apple iOS" || Browser === "Mobile Unknown" )
   {     
        canvas.id = "ScreenCanvas";
        canvas.width = 640;
        canvas.height = 480;
        canvas.style.zIndex  = 0;
        canvas.style.position = "absolute";
        canvas.style.border = "0px solid";
        canvas.style.top = "0%";
        canvas.style.left = "0%";

        canvasFallingLetters.id = "ScreenCanvasFallingLetters";
        canvasFallingLetters.width = 640;
        canvasFallingLetters.height = 480;
        canvasFallingLetters.style.zIndex  = 1;
        canvasFallingLetters.style.position = "absolute";
        canvasFallingLetters.style.border = "0px solid";
        canvasFallingLetters.style.top = "0%";
        canvasFallingLetters.style.left = "0%";
   }
   else
   {
        canvas.id = "ScreenCanvas";
        canvas.width = 640;
        canvas.height = 480;
        canvas.style.zIndex  = 0;
        canvas.style.position = "absolute";
        canvas.style.border = "0px solid";
        canvas.style.top = "50%";
        canvas.style.left = "50%";

	canvasFallingLetters.id = "ScreenCanvasFallingLetters";
        canvasFallingLetters.width = 640;
        canvasFallingLetters.height = 480;
        canvasFallingLetters.style.zIndex  = 1;
        canvasFallingLetters.style.position = "absolute";
        canvasFallingLetters.style.border = "0px solid";
        canvasFallingLetters.style.top = "50%";
        canvasFallingLetters.style.left = "50%";
    }
    document.body.appendChild(canvas);
    document.body.appendChild(canvasFallingLetters);

    ctxCanvas = document.getElementById("ScreenCanvas");
    ctx = ctxCanvas.getContext("2d");

    ctxCanvasFallingLetters = document.getElementById("ScreenCanvasFallingLetters");
    ctxFallingLetters = ctxCanvas.getContext("2d");

    screenWidth = 640;
    screenHeight = 480;

//    WebsiteRunOnServer = window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

//--------------------------------------------------------------------------------------------------------------
function AppLostFocus()
{
    if (AppHasFocus === false)  return;
    AppHasFocus = false; 

    if (ScreenToDisplay > 1 && SoundType !== "null" && MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].pause();
}

//--------------------------------------------------------------------------------------------------------------
function AppGainedFocus()
{
    if (AppHasFocus === true)  return;
    AppHasFocus = true; 

    if (ScreenToDisplay > 1 && SoundType !== "null" && MusicVolume > 0)  MusicArray[CurrentlyPlayingMusicTrack].play();
}

//--------------------------------------------------------------------------------------------------------------
function HandleVisibilityChange()
{
    if (document.hidden)
    {
        AppLostFocus();
    }
    else
    {
        AppGainedFocus();
    }
}

//--------------------------------------------------------------------------------------------------------------
function Init()
{
    if (InitLoaded === true)  return;
    InitLoaded = true;
  
    var test_canvas = document.createElement("canvas");
    var canvascheck=!!(test_canvas.getContext);
//    var canvascheck=(test_canvas.getContext)? true : false;
    if (canvascheck === false)  alert("This browser does not support HTML5, get Mozilla Firefox or Google Chrome!");

    InitSettings();
    LoadOptions();
    LoadImages();

    var canvasFallingLetters = document.getElementById("ScreenCanvasFallingLetters");

    canvasFallingLetters.addEventListener("mousemove", function(event)
    {
        var rect = canvasFallingLetters.getBoundingClientRect();
        MouseX = Math.floor(event.clientX - rect.left);
        MouseY = Math.floor(event.clientY - rect.top);

        if (BrowserWidth !== 640)  MouseX = (  Math.floor( MouseX * (640/BrowserWidth) )  );

        if (BrowserHeight !== 480)  MouseY = (  Math.floor( MouseY * (480/BrowserHeight) )  );
    });

    window.addEventListener('resize', BrowserResize, false);
    BrowserResize();

    canvasFallingLetters.addEventListener("click", CheckForMouseButtonClick, false);
    document.addEventListener("keypress", CheckForKeyPress, true);
    document.addEventListener("keydown", CheckForKeyDown, true);
    document.addEventListener("keyup", CheckForKeyRelease, true);
    
    document.addEventListener("visibilitychange", HandleVisibilityChange, false);

    document.body.style.backgroundColor = "Black";
    
    draw();
}

//--------------------------------------------------------------------------------------------------------------
function RequestAnimFrame(func, fps)
{
	window.setTimeout(func, 1000 / fps);
}

//--------------------------------------------------------------------------------------------------------------
function draw()
{
    GameLoop();
    RequestAnimFrame(draw, Framerate);
}
