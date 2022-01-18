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

// "interface.js"...

var NumberOfOnscreenButtons = 0;
var OriginalButtonSprite;
var ButtonsWithTextCanvases = [];
var ctxButtonsWithTextCanvases = [];

var GUIArrowsSprites = [];
var GUIButton = [];
var GUIButtonScreenX = [];
var GUIButtonScreenY = [];

var ButtonThatWasSelected = -1;
var ButtonSelectedAnimationTimer = -1;
var ButtonSelectedByKeyboard = 0;

var NumberOfOnscreenArrowSets = 0;
var GUISelectorLineSprite;
var ArrowSetSelectedByKeyboard = -1;
var ArrowSetArrowSelected = -1;
var GUIArrowSets = [];
var ArrowSetThatWasSelected = -1;
var ArrowSetSelectedAnimationTimer = -1;
var GUIArrowSetScreenX = [];
var GUIArrowSetScreenY = [];

var ButtonsWithCharsCanvases = [];
var ctxButtonsWithCharsCanvases = [];

var NumberOfOnscreenIcons = 0
var IconIndex = [];
var IconSpriteIndex = [];
var IconScreenX = [];
var IconScreenY = [];
var IconAnimationTimer = [];
var IconScale = [];
var IconSelectedByPlayer;

//--------------------------------------------------------------------------------------------------------------
function CreateArrowSet(index, x, y)
{
    GUIArrowSets[NumberOfOnscreenArrowSets] = index;

    GUIArrowSetScreenX[NumberOfOnscreenArrowSets] = x;
    GUIArrowSetScreenY[NumberOfOnscreenArrowSets] = y;

    NumberOfOnscreenArrowSets++;

    ArrowSetThatWasSelected = 0;
    ArrowSetArrowSelected = -1;
    ArrowSetSelectedAnimationTimer = -1;
    ArrowSetSelectedByKeyboard = 0;

    MouseButtonClicked = false;
    JoystickDirection = CENTER;
    JoystickButtonOne = false;
    JoystickButtonTwo = false;
}

//--------------------------------------------------------------------------------------------------------------
function DrawAllArrowSets()
{
    var scaleOne = 1;
    var scaleTwo = 1;

    ctx.save();

    for (var index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
        scaleOne = 1;
        scaleTwo = 1;

        var computedCenterX = GUISelectorLineSprite.width / 2 +.5;
        var computedCenterY = GUISelectorLineSprite.height / 2 + .5;

        var computedCenterXtwo = GUIArrowsSprites[0].width / 2 + .5;
        var computedCenterYtwo = GUIArrowsSprites[0].height / 2 + .5;

        var x = GUIArrowSetScreenX[index];
        var y = GUIArrowSetScreenY[index];

        y-=21;

        if (index === ArrowSetThatWasSelected && ArrowSetSelectedAnimationTimer > 5)
        {
            if (ArrowSetArrowSelected === ArrowSetThatWasSelected)  scaleOne = 0.8;
            else  scaleOne = 1;

            if (ArrowSetArrowSelected === ArrowSetThatWasSelected+0.5)  scaleTwo = 0.8;
            else  scaleTwo = 1;
        }

        ctx.globalAlpha = 0.6;

        if (index === ArrowSetThatWasSelected)
        {
            ctx.drawImage(  GUISelectorLineSprite, (x - ((computedCenterX)) ), (y - ((computedCenterY)) )
            , (GUISelectorLineSprite.width), (GUISelectorLineSprite.height)  );
        }

        ctx.globalAlpha = 1;

        if (ArrowButtonAnimation < 10 || scaleOne !== 1 || scaleTwo !== 1)
        {
            ctx.drawImage(  GUIArrowsSprites[0], ((x - (computedCenterXtwo * scaleOne)) - 295), ((y - (computedCenterYtwo * scaleOne)))
            , (GUIArrowsSprites[0].width * scaleOne), (GUIArrowsSprites[0].height * scaleOne)  );

            ctx.drawImage(  GUIArrowsSprites[1], ((x - (computedCenterXtwo * scaleTwo)) + 295), ((y - (computedCenterYtwo * scaleTwo)))
            , (GUIArrowsSprites[0].width * scaleTwo), (GUIArrowsSprites[0].height * scaleTwo)  );
        }
    }

    ctx.globalAlpha = 1;
    ctx.restore();
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function ThisArrowSetArrowWasPressed(index)
{
var returnValue = false;
   
    if (DelayAllUserInput === 0)
    {
        if (JoystickDirection === UP)
        {
            if (ArrowSetThatWasSelected > 0)  ArrowSetThatWasSelected--;
            else  ArrowSetThatWasSelected = (NumberOfOnscreenArrowSets-1);

            ScreenIsDirty = true;

            PlaySoundEffect(0);
            DelayAllUserInput = 10;
        }
        else if (JoystickDirection === DOWN)
        {
            if ( ArrowSetThatWasSelected < (NumberOfOnscreenArrowSets-1) )  ArrowSetThatWasSelected++;
            else  ArrowSetThatWasSelected = 0;

            ScreenIsDirty = true;

            PlaySoundEffect(0);
            DelayAllUserInput = 10;
        }

        if (JoystickDirection === LEFT && ArrowSetSelectedAnimationTimer === -1)
        {
            ArrowSetArrowSelected = ArrowSetThatWasSelected;
            ArrowSetSelectedAnimationTimer = 10;

            ScreenIsDirty = true;

            PlaySoundEffect(0);
            DelayAllUserInput = 10;
        }
        else if (JoystickDirection === RIGHT && ArrowSetSelectedAnimationTimer === -1)
        {
            ArrowSetArrowSelected = ArrowSetThatWasSelected+.5;
            ArrowSetSelectedAnimationTimer = 10;

            ScreenIsDirty = true;

            PlaySoundEffect(0);
            DelayAllUserInput = 10;
        }

        var x = GUIArrowSetScreenX[index];
        var y = GUIArrowSetScreenY[index];

        var arrowOneCenterX = (x - 295);
        var arrowOneCenterY = (y-23);
        var arrowTwoCenterX = (x + 295);
        var arrowTwoCenterY = (y-23);

        if (MouseButtonClicked === true && ArrowSetSelectedAnimationTimer === -1)
        {
            if ( MouseX > (arrowOneCenterX - (46/2)) && MouseX < (arrowOneCenterX + (46/2))
            && MouseY > (arrowOneCenterY - (38/2)) && MouseY < (arrowOneCenterY + (38/2)) )
            {
            ArrowSetThatWasSelected = Math.floor(index);
            ArrowSetArrowSelected = ArrowSetThatWasSelected;
            ArrowSetSelectedAnimationTimer = 10;

            PlaySoundEffect(0);

            ScreenIsDirty = true;
            DelayAllUserInput = 10;
            }
            else if ( MouseX > (arrowTwoCenterX - (46/2)) && MouseX < (arrowTwoCenterX + (46/2))
            && MouseY > (arrowTwoCenterY - (38/2)) && MouseY < (arrowTwoCenterY + (38/2)) )
            {
            ArrowSetThatWasSelected = Math.floor(index);
            ArrowSetArrowSelected = ArrowSetThatWasSelected+.5;
            ArrowSetSelectedAnimationTimer = 10;

            PlaySoundEffect(0);

            ScreenIsDirty = true;
            DelayAllUserInput = 10;
            }
        }
    }
	
    if (ArrowSetSelectedAnimationTimer > 0 && index === ArrowSetArrowSelected)  ArrowSetSelectedAnimationTimer--;
    else if (ArrowSetSelectedAnimationTimer === 0 && index === ArrowSetArrowSelected)
    {
        ArrowSetSelectedAnimationTimer = -1;
        returnValue = true;
        ScreenIsDirty = true;
    }

    return(returnValue);
}

//--------------------------------------------------------------------------------------------------------------
function DestroyAllArrowSets()
{
    for (var index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
        GUIArrowSets[index] = -1;

        GUIArrowSetScreenX[index] = -9999;
        GUIArrowSetScreenY[index] = -9999;
    }
	
    NumberOfOnscreenArrowSets = 0;

    ArrowSetThatWasSelected = 0;
    ArrowSetArrowSelected = -1;
    ArrowSetSelectedAnimationTimer = -1;
    ArrowSetSelectedByKeyboard = 0;

    MouseButtonClicked = false;
    JoystickDirection = CENTER;
    JoystickButtonOne = false;
    JoystickButtonTwo = false;
}

//--------------------------------------------------------------------------------------------------------------
function CreateButtonsWithText()
{
var index;
var text;
var yOffSet;
var xOffSet;
var characters //= new Array(65);
characters = "~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_";

    for (index = 0; index < 7; index++)
    {
        ButtonsWithTextCanvases[index] = document.createElement("canvas");
        ButtonsWithTextCanvases[index].width = "251";
        ButtonsWithTextCanvases[index].height = "40";
        ctxButtonsWithTextCanvases[index] = ButtonsWithTextCanvases[index].getContext('2d');
    }

    for (index = 0; index < 7; index++)
    {
        if (index === 0)  text = "START!";
        else if (index === 1)  text = "Options";
        else if (index === 2)  text = "How To Play";
        else if (index === 3)  text = "High Scores";
        else if (index === 4)  text = "About";
        else if (index === 5)  text = "Exit";
        else if (index === 6)  text = "Back";

        ctxButtonsWithTextCanvases[index].clearRect(0, 0, 251, 40);

        ctxButtonsWithTextCanvases[index].drawImage(OriginalButtonSprite, 0, 0, 251, 40);

        ctxButtonsWithTextCanvases[index].font = "bold 25px Font-01";
        ctxButtonsWithTextCanvases[index].textAlign = "center";

        ctxButtonsWithTextCanvases[index].fillStyle = "rgba(222, 140, 0, 1)";
        for (yOffSet = -1; yOffSet < 2; yOffSet+=2)
        {
            for (xOffSet = -1; xOffSet < 2; xOffSet+=2)
            {
                ctxButtonsWithTextCanvases[index].fillText(text, 125+xOffSet, 29+yOffSet);
            }
        }

        ctxButtonsWithTextCanvases[index].fillStyle = "rgba(0, 0, 0, 1)";
        ctxButtonsWithTextCanvases[index].fillText(text, 125, 29);
    }

    for (index = 0; index < 67; index++)
    {
        ButtonsWithCharsCanvases[index] = document.createElement("canvas");
        ButtonsWithCharsCanvases[index].width = "39";
        ButtonsWithCharsCanvases[index].height = "30";
        ctxButtonsWithCharsCanvases[index] = ButtonsWithCharsCanvases[index].getContext('2d');
        
        ImageSprites[index+100] = document.createElement("canvas");
        ImageSprites[index+100].width = "39";
        ImageSprites[index+100].height = "30";
    }

    for (index = 1; index < 67; index++)
    {
		if (index < 65)  text = characters[index];
        else if (index === 65)  text = "<";
        else if (index === 66)  text = "End";

        ctxButtonsWithCharsCanvases[index].clearRect(0, 0, 251, 40);

        ctxButtonsWithCharsCanvases[index].drawImage(ImageSprites[99], 0, 0, 39, 30);

        if (index < 66)  ctxButtonsWithCharsCanvases[index].font = "bold 20px Font-01";
		else  ctxButtonsWithCharsCanvases[index].font = "bold 15px Font-01";
	
        ctxButtonsWithCharsCanvases[index].textAlign = "center";

        ctxButtonsWithCharsCanvases[index].fillStyle = "rgba(222, 140, 0, 1)";
        for (yOffSet = -1; yOffSet < 2; yOffSet+=2)
        {
            for (xOffSet = -1; xOffSet < 2; xOffSet+=2)
            {
                ctxButtonsWithCharsCanvases[index].fillText(text, 19+xOffSet, 15+7+yOffSet);
            }
        }

        ctxButtonsWithCharsCanvases[index].fillStyle = "rgba(0, 0, 0, 1)";
        ctxButtonsWithCharsCanvases[index].fillText(text, 19, 15+7);
    }
}

//--------------------------------------------------------------------------------------------------------------
function CreateButton(index, x, y)
{
    GUIButton[NumberOfOnscreenButtons] = index;

    GUIButtonScreenX[NumberOfOnscreenButtons] = x;
    GUIButtonScreenY[NumberOfOnscreenButtons] = y;

    NumberOfOnscreenButtons++;

    ButtonThatWasSelected = -1;
    ButtonSelectedAnimationTimer = -1;
    ButtonSelectedByKeyboard = 0;

    MouseButtonClicked = false;
    JoystickDirection = CENTER;
    JoystickButtonOne = false;
    JoystickButtonTwo = false;
}

//--------------------------------------------------------------------------------------------------------------
function DrawAllIButtons()
{
    var scale = 1;

    for (var index = 0; index < NumberOfOnscreenButtons; index++)
    {
        var computedCenterX = OriginalButtonSprite.width / 2;
        var computedCenterY = OriginalButtonSprite.height / 2;

        var x = GUIButtonScreenX[index];
        var y = GUIButtonScreenY[index];

        if (index === ButtonThatWasSelected && ButtonSelectedAnimationTimer > 5)
        {
            scale = 0.9;
        }
        else  scale = 1;

        ctx.drawImage(  ButtonsWithTextCanvases[GUIButton[index]], (x - ((computedCenterX) * scale) ), (y - ((computedCenterY) * scale) )
        , (OriginalButtonSprite.width * scale), (OriginalButtonSprite.height * scale)  );

	if (index === ButtonSelectedByKeyboard && ScreenToDisplay === 3)
        {
            ctx.drawImage(GUIArrowsSprites[0], x + 128, y - 20, GUIArrowsSprites[0].width, GUIArrowsSprites[0].height);
            ctx.drawImage(GUIArrowsSprites[1], x - 175, y - 20, GUIArrowsSprites[1].width, GUIArrowsSprites[1].height);
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function ThisButtonWasPressed(index)
{
    if (DelayAllUserInput === 0)
    {
	if (JoystickDirection === UP)
	{
	    if (ButtonSelectedByKeyboard < 1)  ButtonSelectedByKeyboard = (NumberOfOnscreenButtons-1);
	    else  ButtonSelectedByKeyboard--;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}
	else if (JoystickDirection === DOWN)
	{
	    if ( ButtonSelectedByKeyboard > (NumberOfOnscreenButtons - 2) )  ButtonSelectedByKeyboard = 0;
	    else  ButtonSelectedByKeyboard++;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	var returnValue = false;

	if ( (SpacebarPressed === true/*KeyboardCharacterPressed === "_"*/ || KeyboardCharacterPressed === "/") && ScreenToDisplay !== 9)
	{
	    ButtonThatWasSelected = ButtonSelectedByKeyboard;
	    ButtonSelectedAnimationTimer = 10;

	    ScreenIsDirty = true;

	    PlaySoundEffect(0);
	    DelayAllUserInput = 10;
	}

	if (MouseButtonClicked === true && ButtonSelectedAnimationTimer === -1)
	{
	    if ( MouseX > (GUIButtonScreenX[index] - 125) && MouseX < (GUIButtonScreenX[index] + 125)
	    && MouseY > (GUIButtonScreenY[index] - 20) &&  MouseY < (GUIButtonScreenY[index] + 20) )
	    {
		ButtonThatWasSelected = index;
		ButtonSelectedAnimationTimer = 10;
		ButtonSelectedByKeyboard = index;

		ScreenIsDirty = true;

		PlaySoundEffect(0);
		DelayAllUserInput = 10;
	    }
	}
    }

    if (ButtonSelectedAnimationTimer > 0 && index === ButtonThatWasSelected)  ButtonSelectedAnimationTimer--;
    else if (ButtonSelectedAnimationTimer === 0 && index === ButtonThatWasSelected)
    {
        ButtonSelectedAnimationTimer = -1;
        ScreenIsDirty = true;
        returnValue = true;
    }

    return(returnValue);
}
//--------------------------------------------------------------------------------------------------------------
function DestroyAllButtons()
{
    for (var index = 0; index < NumberOfOnscreenButtons; index++)
    {
        GUIButton[index] = -1;

        GUIButtonScreenX[index] = -9999;
        GUIButtonScreenY[index] = -9999;
    }
	
        NumberOfOnscreenButtons = 0;

        ButtonThatWasSelected = -1;
        ButtonSelectedAnimationTimer = -1;
        ButtonSelectedByKeyboard = 0;
}

//--------------------------------------------------------------------------------------------------------------
function CreateIcon(spriteIndex, screenX, screenY)
{
    IconSelectedByPlayer = -1;
	
	IconIndex[NumberOfOnscreenIcons] = NumberOfOnscreenIcons;
	IconSpriteIndex[NumberOfOnscreenIcons] = spriteIndex;
	IconScreenX[NumberOfOnscreenIcons] = screenX;
	IconScreenY[NumberOfOnscreenIcons] = screenY;
	IconAnimationTimer[NumberOfOnscreenIcons] = -1;
	IconScale[NumberOfOnscreenIcons] = 1;

	NumberOfOnscreenIcons++;
}

//--------------------------------------------------------------------------------------------------------------
function DrawAllIcons()
{
    for (var index = 0; index < NumberOfOnscreenIcons; index++)
    {
        if (IconIndex[index] > -1)
        {	
			var scale = 1;

			var computedCenterX = ImageSprites[IconSpriteIndex[index]].width / 2;
			var computedCenterY = ImageSprites[IconSpriteIndex[index]].height / 2;

			var x = IconScreenX[index];
			var y = IconScreenY[index];

			if (IconAnimationTimer[index] > 5)
			{
				scale = 0.9;
			}
			else  scale = 1;
				
			ctx.drawImage(  ImageSprites[IconSpriteIndex[index]], (x - ((computedCenterX) * scale) ), (y - ((computedCenterY) * scale) )
			, (ImageSprites[IconSpriteIndex[index]].width * scale), (ImageSprites[IconSpriteIndex[index]].height * scale)  );
		}
	}
}

//--------------------------------------------------------------------------------------------------------------
function ProcessAllIcons()
{
	IconSelectedByPlayer = -1;
	
    for (var index = 0; index < NumberOfOnscreenIcons; index++)
    {
        if (IconIndex[index] > -1)
        {
			if (MouseButtonClicked === true && IconAnimationTimer[index] === -1)
			{
				if (  MouseX > ( IconScreenX[index] - (ImageSprites[IconSpriteIndex[index]].width/2) ) && MouseX < ( IconScreenX[index] + (ImageSprites[IconSpriteIndex[index]].width/2) )
				&& MouseY > ( IconScreenY[index] - (ImageSprites[IconSpriteIndex[index]].height/2) ) &&  MouseY < ( IconScreenY[index] + (ImageSprites[IconSpriteIndex[index]].height/2) )  )
				{
					IconAnimationTimer[index] = 10;
					IconSelectedByPlayer = index;
					PlaySoundEffect(0);
					ScreenIsDirty = true;
				}
			}
		}

		if (IconAnimationTimer[index] === 5)  ScreenIsDirty = true;
		
		if (IconAnimationTimer[index] > -1)  IconAnimationTimer[index]--;
	}
}

//--------------------------------------------------------------------------------------------------------------
function DestroyAllIcons()
{
    IconSelectedByPlayer = -1;
		
    for (var index = 0; index < NumberOfOnscreenIcons; index++)
    {
        if (IconIndex[index] > -1)
        {
			IconIndex[index] = -1;
			IconSpriteIndex[index] = -1;
			IconScreenX[index] = -9999;
			IconScreenY[index] = -9999;
			IconAnimationTimer[index] = -1;
			IconScale[index] = 1;
        }
    }
	
	NumberOfOnscreenIcons = 0;
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function MouseOnGUI()
{
var index;

    for (index = 0; index < NumberOfOnscreenArrowSets; index++)
    {
        var x = GUIArrowSetScreenX[index];
        var y = GUIArrowSetScreenY[index];

        var arrowOneCenterX = (x - 295);
        var arrowOneCenterY = (y-23);
        var arrowTwoCenterX = (x + 295);
        var arrowTwoCenterY = (y-23);

        if ( MouseX > (arrowOneCenterX - (46/2)) && MouseX < (arrowOneCenterX + (46/2))
        && MouseY > (arrowOneCenterY - (38/2)) && MouseY < (arrowOneCenterY + (38/2)) )
        {
            return true;
        }
        else if ( MouseX > (arrowTwoCenterX - (46/2)) && MouseX < (arrowTwoCenterX + (46/2))
        && MouseY > (arrowTwoCenterY - (38/2)) && MouseY < (arrowTwoCenterY + (38/2)) )
        {
            return true;
        }
    }

    for (index = 0; index < NumberOfOnscreenButtons; index++)
    {
        if ( MouseX > (GUIButtonScreenX[index] - 125) && MouseX < (GUIButtonScreenX[index] + 125)
        && MouseY > (GUIButtonScreenY[index] - 20) &&  MouseY < (GUIButtonScreenY[index] + 20) )
        {
            return true;
        }
    }
	
    for (index = 0; index < NumberOfOnscreenIcons; index++)
    {
		if (  MouseX > ( IconScreenX[index] - (ImageSprites[IconSpriteIndex[index]].width/2) ) && MouseX < ( IconScreenX[index] + (ImageSprites[IconSpriteIndex[index]].width/2) )
		&& MouseY > ( IconScreenY[index] - (ImageSprites[IconSpriteIndex[index]].height/2) ) &&  MouseY < ( IconScreenY[index] + (ImageSprites[IconSpriteIndex[index]].height/2) )  )
		{

			return true;
		}
	}
	
    return false;
}
