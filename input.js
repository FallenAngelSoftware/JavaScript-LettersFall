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

// "input.js"...

var DelayAllUserInput = 0;

var MouseX = 0;
var MouseY = 0;
var MouseButtonClicked = false;

var KeyboardCharacterPressed = " ";
var SpacebarPressed = false;

var CENTER = 0;
var UP     = 1;
var RIGHT  = 2;
var DOWN   = 3;
var LEFT   = 4;
var JoystickDirection = CENTER;
var JoystickButtonOne = false;
var JoystickButtonTwo = false;

//--------------------------------------------------------------------------------------------------------------
function CheckForMouseButtonClick()
{
    if (DelayAllUserInput === 0)  MouseButtonClicked = true;
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyPress(evt)
{
    if (DelayAllUserInput === 0)
    {
        if (String.fromCharCode(evt.keyCode) !== " ")  KeyboardCharacterPressed =  String.fromCharCode(evt.which || evt.keyCode);
	
        switch (evt.keyCode)
        {
            case 8:
            KeyboardCharacterPressed = "=";
            break;

            case 13:
            KeyboardCharacterPressed = "/";
            break;

            case 27:
            KeyboardCharacterPressed = "~";
            break;

            default:
            break;
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyDown(evt)
{
	SpacebarPressed = false;

    if (DelayAllUserInput === 0)
    {
        if (evt.keyCode === 8)  KeyboardCharacterPressed = "=";
        else if (evt.keyCode === 13)  KeyboardCharacterPressed = "/";
        else if (evt.keyCode === 27)  KeyboardCharacterPressed = "~";
        else if (evt.keyCode === 32)  SpacebarPressed = true;
	
        if (evt.keyCode === 38)  JoystickDirection = UP;
        else if (evt.keyCode === 39)  JoystickDirection = RIGHT;
        else if (evt.keyCode === 40)  JoystickDirection = DOWN;
        else if (evt.keyCode === 37)  JoystickDirection = LEFT;

        if (evt.keyCode === 90)  JoystickButtonOne = true;
        else if (evt.keyCode === 88)  JoystickButtonTwo = true;
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckForKeyRelease(evt)
{
    if (evt.keyCode === 38)       JoystickDirection = CENTER;
    else if (evt.keyCode === 39)  JoystickDirection = CENTER;
    else if (evt.keyCode === 40)  JoystickDirection = CENTER;
    else if (evt.keyCode === 37)  JoystickDirection = CENTER;

    if (evt.keyCode === 90)  JoystickButtonOne = false;
    else if (evt.keyCode === 88)  JoystickButtonTwo = false;
}
