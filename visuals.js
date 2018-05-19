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

// "visuals.js'...

var NumberOfSprites = 200;
var ImageSprites = new Array(NumberOfSprites);
var NumberOfLoadedImages = 0;

var BrowserWidth = 640;
var BrowserHeight = 480;

var NumberOfPreloadedStaffTexts = -1;
var PreloadedTextsBG;
var PreloadedStaffTexts = new Array(100);
var PreloadedStaffTextsBlue = new Array(100);
var PreloadedStaffTextsScreenY = new Array(100);

var CursorSprite = new Array(2);

var TextCacheImageCanvas = new Array(100);
var TextCacheImageCanvasCTX = new Array(100);
var TextCacheText = new Array(100);
var TextCacheJustification = new Array(100);
var TextCacheScreenXOriginal = new Array(100);
var TextCacheScreenX = new Array(100);
var TextCacheScreenY = new Array(100);
var TextCacheIndex = 0;

//--------------------------------------------------------------------------------------------------------------
function BrowserResize()
{
var widthToHeight = 640 / 480;
var browserWidthTemp;
var browserHeightTemp;

    var canvas = document.getElementById('ScreenCanvas');
    var canvasFallingLetters = document.getElementById('ScreenCanvasFallingLetters');

    if ( Browser === "Google Android" || Browser === "Apple iOS" || Browser === "Mobile Unknown" )
    {
        BrowserWidth = window.innerWidth;
        BrowserHeight = window.innerHeight;

        canvas.style.width = BrowserWidth + 'px';
        canvas.style.height = BrowserHeight + 'px';

        canvasFallingLetters.style.width = BrowserWidth + 'px';
        canvasFallingLetters.style.height = BrowserHeight + 'px';
    }
    else
    {
        BrowserWidth = window.innerWidth;
        BrowserHeight = window.innerHeight;
        
        var newWidthToHeight = BrowserWidth / BrowserHeight;
        browserWidthTemp = BrowserWidth;
        browserHeightTemp = BrowserHeight;
    
        if (newWidthToHeight > widthToHeight)
        {
            browserWidthTemp = browserHeightTemp * widthToHeight;
            canvas.style.height = browserHeightTemp + 'px';
            canvas.style.width = browserWidthTemp + 'px';

            canvasFallingLetters.style.height = browserHeightTemp + 'px';
            canvasFallingLetters.style.width = browserWidthTemp + 'px';
	}
        else
        {
            browserHeightTemp = browserWidthTemp / widthToHeight;
            canvas.style.width = browserWidthTemp + 'px';
            canvas.style.height = browserHeightTemp + 'px';

	    canvasFallingLetters.style.width = browserWidthTemp + 'px';
            canvasFallingLetters.style.height = browserHeightTemp + 'px';
        }

        canvas.style.marginTop = (-browserHeightTemp / 2) + 'px';
        canvas.style.marginLeft = (-browserWidthTemp / 2) + 'px';
 
        canvasFallingLetters.style.marginTop = (-browserHeightTemp / 2) + 'px';
        canvasFallingLetters.style.marginLeft = (-browserWidthTemp / 2) + 'px';
       
        BrowserWidth = browserWidthTemp;
        BrowserHeight = browserHeightTemp;
    }
}

//--------------------------------------------------------------------------------------------------------------
function LoadImages()
{
var index;

    for (index = 0; index < 100; index++)
    {
        TextCacheImageCanvas[index] = document.createElement("canvas");
        TextCacheImageCanvas[index].width = "640";
        TextCacheImageCanvas[index].height = "150";
        TextCacheImageCanvasCTX[index] = TextCacheImageCanvas[index].getContext('2d');
        TextCacheImageCanvasCTX[index].clearRect(0, 0, 640, 150);
    }

    ClearTextCache();
    
    CursorSprite[0] = new Image();
    CursorSprite[0].src = "data/visuals/Cursor-Arrow.png"; NumberOfLoadedImages++;
    CursorSprite[1] = new Image();
    CursorSprite[1].src = "data/visuals/Cursor-Hand.png"; NumberOfLoadedImages++;
	
    OriginalButtonSprite = new Image();
    OriginalButtonSprite.src = "data/visuals/Button.png"; NumberOfLoadedImages++;

    GUIArrowsSprites[0] = new Image();
    GUIArrowsSprites[0].src = "data/visuals/Button-Selector-Left.png"; NumberOfLoadedImages++;
    GUIArrowsSprites[1] = new Image();
    GUIArrowsSprites[1].src = "data/visuals/Button-Selector-Right.png"; NumberOfLoadedImages++;

    GUISelectorLineSprite = new Image;
    GUISelectorLineSprite.src = "data/visuals/Selector-Line.png"; NumberOfLoadedImages++;

    PreloadedTextsBG = new Image();
    PreloadedTextsBG.src = "data/visuals/PreLoad-Text-Image.png"; NumberOfLoadedImages++;
  
    for (index = 0; index < NumberOfSprites; index++)  ImageSprites[index] = new Image();
	
    ImageSprites[0].src = "data/visuals/Screen-Fade-Black-Box.png"; NumberOfLoadedImages++;
    ImageSprites[1].src = "data/visuals/Red-BG.png"; NumberOfLoadedImages++;
    ImageSprites[2].src = "data/visuals/Green-BG.png"; NumberOfLoadedImages++;
    ImageSprites[3].src = "data/visuals/Blue-BG.png"; NumberOfLoadedImages++;

    ImageSprites[5].src = "data/visuals/Speaker-OFF.png"; NumberOfLoadedImages++;
    ImageSprites[6].src = "data/visuals/Speaker-ON.png"; NumberOfLoadedImages++;

    ImageSprites[9].src = "data/visuals/HTML5-Logo.png"; NumberOfLoadedImages++;
    
    ImageSprites[10].src = "data/visuals/FAS-Statue.png"; NumberOfLoadedImages++;
    
    ImageSprites[15].src = "data/visuals/Download-Source-Button.png"; NumberOfLoadedImages++;
    
    ImageSprites[20].src = "data/visuals/Waterfall-BG.png"; NumberOfLoadedImages++;
    ImageSprites[21].src = "data/visuals/Water-BG.png"; NumberOfLoadedImages++;
    ImageSprites[22].src = "data/visuals/Kittens-BG.png"; NumberOfLoadedImages++;
    ImageSprites[23].src = "data/visuals/Puppies-BG.png"; NumberOfLoadedImages++;
    ImageSprites[24].src = "data/visuals/Chalkboard-BG.png"; NumberOfLoadedImages++;
    ImageSprites[25].src = "data/visuals/Sunset-BG.png"; NumberOfLoadedImages++;

    ImageSprites[29].src = "data/visuals/HowToPlay.png"; NumberOfLoadedImages++;
    
    ImageSprites[30].src = "data/visuals/LettersFall-Logo.png"; NumberOfLoadedImages++;

    ImageSprites[40].src = "data/visuals/Playfield-Board.png"; NumberOfLoadedImages++;
    ImageSprites[41].src = "data/visuals/X-Button.png"; NumberOfLoadedImages++;
    
    ImageSprites[45].src = "data/visuals/Next-Text.png"; NumberOfLoadedImages++;
    ImageSprites[46].src = "data/visuals/Level-Text.png"; NumberOfLoadedImages++;
    ImageSprites[47].src = "data/visuals/Score-Text.png"; NumberOfLoadedImages++;

    ImageSprites[50].src = "data/visuals/Bomb-Bonus-Meter.png"; NumberOfLoadedImages++;
    ImageSprites[51].src = "data/visuals/Bomb-Bonus-Meter-Green-Line.png"; NumberOfLoadedImages++;
    ImageSprites[52].src = "data/visuals/Bomb.png"; NumberOfLoadedImages++;
    ImageSprites[53].src = "data/visuals/Bomb-Button.png"; NumberOfLoadedImages++;
    ImageSprites[54].src = "data/visuals/Bomb-Explosion.png"; NumberOfLoadedImages++;
    
    ImageSprites[60].src = "data/visuals/Left-Arrow.png"; NumberOfLoadedImages++;
    ImageSprites[61].src = "data/visuals/Down-Arrow.png"; NumberOfLoadedImages++;
    ImageSprites[62].src = "data/visuals/Right-Arrow.png"; NumberOfLoadedImages++;
    
    ImageSprites[70].src = "data/visuals/Clear-Button.png"; NumberOfLoadedImages++;
    ImageSprites[71].src = "data/visuals/Undo-Button.png"; NumberOfLoadedImages++;
    ImageSprites[72].src = "data/visuals/Check-Word-Button.png"; NumberOfLoadedImages++;
    
    ImageSprites[80].src = "data/visuals/Game-Over-Text.png"; NumberOfLoadedImages++;

    ImageSprites[99].src = "data/visuals/Letter-Tile.png"; NumberOfLoadedImages++;
    
}

//--------------------------------------------------------------------------------------------------------------
function PreloadStaffText(size, text, x, y, justification, colorR, colorG, colorB, outlineColorR, outlineColorG, outlineColorB, outlineBold)
{
var ctxPreloadedStaffTexts = new Array(100);

    NumberOfPreloadedStaffTexts++;

    PreloadedStaffTexts[NumberOfPreloadedStaffTexts] = document.createElement("canvas");
    PreloadedStaffTexts[NumberOfPreloadedStaffTexts].width = "640";
    PreloadedStaffTexts[NumberOfPreloadedStaffTexts].height = "150";
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts] = PreloadedStaffTexts[NumberOfPreloadedStaffTexts].getContext('2d');
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].clearRect(0, 0, 640, 150);
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].drawImage(PreloadedTextsBG, 0, 0, 640, 150);
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].save();

    if (size === 55)  ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = "bold 55px Font-01";
    else if (size === 25)  ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = "bold 25px Font-01";
    else if (size === 20)  ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = "bold 20px Font-01";
    else if (size === 15)  ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = "bold 15px Font-01";
    else if (size === 12)  ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].font = "bold 12px Font-01";

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].textAlign = justification;

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillStyle = "rgba("+outlineColorR+", "+outlineColorG+", "+outlineColorB+", 1)";

    if (outlineBold === 0)
    {
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y-1);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x+1, y);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y+1);
        ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x-1, y);
    }
    else if (outlineBold === 1)
    {
        for (var yOffset = -2; yOffset < 3; yOffset++)
            for (var xOffset = -2; xOffset < 3; xOffset++)
                ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x+xOffset, y+yOffset);
    }

    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillStyle = "rgba("+colorR+", "+colorG+", "+colorB+", 1)";
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].fillText(text, x, y);

    PreloadedStaffTextsBlue[NumberOfPreloadedStaffTexts] = colorB;
    
    ctxPreloadedStaffTexts[NumberOfPreloadedStaffTexts].restore();
}

//--------------------------------------------------------------------------------------------------------------
function PreloadAllStaffTexts()
{
    PreloadStaffText(20, "TM", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "LettersFall", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "\u00A92018, By Fallen Angel Software", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "www.FallenAngelSoftware.com", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Original Game Concept By:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Merkredy''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "''Mustang GT 5.0 SuperCharged'' HTML5/JS Game Engine By:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Designer:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Programmer:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Game Tester:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Graphic Artist:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''The Fallen Angel''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Lead Music Composer/Sound Effects Artist:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''D.J. Fading Twilight''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "JavaScript Source Code Typed Into:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''NotePad++''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "www.NotePad-Plus-Plus.org", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Support Game Designers/Programmers/Testers:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "''Daotheman''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''mattmatteh''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "Support Game Beta Testers:", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
    PreloadStaffText(20, "Diane ''Dee'' P.", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "John P.", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''ultimatematchthree''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''OadT''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''VizuaaLOG''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''oshunluvr''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''jlittle''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''woodsmoke''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''whatthefunk''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''vinnywright''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''anika200''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''mparillo''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''Snowhog''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''MoonRise''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''vsreeser''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''kernelbasher''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    PreloadStaffText(20, "''ericjbasti''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);
    
    PreloadStaffText(20, "''You!''", 320, 75, "center", 255, 255, 255, 0, 0, 0, 1);

    PreloadStaffText(20, "''A 110% By Team Fallen Angel Software!''", 320, 75, "center", 255, 255, 0, 0, 0, 0, 1);
}

//--------------------------------------------------------------------------------------------------------------
function DrawPreloadedStaffTextOntoCanvas(index, x, y)
{
    ctx.save();

    var computedCenterX = Math.floor(PreloadedStaffTexts[index].width / 2);
    var computedCenterY = Math.floor(PreloadedStaffTexts[index].height / 2);

	ctx.drawImage(  PreloadedStaffTexts[index], (x - computedCenterX), (y - computedCenterY)
	, PreloadedStaffTexts[index].width, PreloadedStaffTexts[index].height  );

    ctx.restore();
}

//-------------------------------------------------------------------------------------------------
/**
 * @return {number}
 */
function DegToRad(d)
{
    return d * 0.0174532925199432957;
}

//--------------------------------------------------------------------------------------------------------------
// "Retro Blast Tech"
function DrawSpriteOntoCanvas(index, x, y, scaleX, scaleY, rotationDegree, alpha, red, green, blue)
{
    if (scaleX === 0 || scaleY === 0)  return;
    
    var imageToDraw;
    var imageToDrawWidth = 0;
    var imageToDrawHeight = 0;
    
    if (index < 101 || index > 166)
    {
        imageToDraw = ImageSprites[index];
        imageToDrawWidth = ImageSprites[index].width;
        imageToDrawHeight = ImageSprites[index].height;
    }
    else
    {
        imageToDraw = document.createElement("canvas");
        imageToDraw.width = "39";
        imageToDraw.height = "30";
        imageToDrawWidth = 39;
        imageToDrawHeight = 30;
        imageToDraw = ButtonsWithCharsCanvases[index-100];
    }

    ctx.save();

    ctx.globalAlpha = alpha;

    if (red !== 255 || green !== 255 || blue !== 255)
    {
	var buff = document.createElement("canvas");
	buff.width  = imageToDrawWidth;
	buff.height = imageToDrawHeight;

	if (red !== 255)
	{
	    var ctxR  = buff.getContext("2d");
	    ctxR.drawImage(imageToDraw, 0, 0);

	    ctxR.globalAlpha = (red / 255);
	    ctxR.globalCompositeOperation = 'source-atop';
	    ctxR.drawImage(ImageSprites[1], 0, 0);
	    
	    ctxR.globalAlpha = 1;
	    
	    imageToDraw = buff;
	}

	if (green !== 255)
	{
	    var ctxG  = buff.getContext("2d");
        ctxG.drawImage(imageToDraw, 0, 0);

        ctxG.globalAlpha = (green / 255);
        ctxG.globalCompositeOperation = 'source-atop';
        ctxG.drawImage(ImageSprites[2], 0, 0);

        ctxG.globalAlpha = 1;
	    
	    imageToDraw = buff;
	}

	if (blue !== 255)
	{
	    var ctxB  = buff.getContext("2d");
        ctxB.drawImage(imageToDraw, 0, 0);

        ctxB.globalAlpha = (blue / 255);
        ctxB.globalCompositeOperation = 'source-atop';
        ctxB.drawImage(ImageSprites[3], 0, 0);

        ctxB.globalAlpha = 1;
	    
	    imageToDraw = buff;
	}
        
        buff = null;
    }

    ctx.translate(x, y);

    if (rotationDegree !== 0)  ctx.rotate( DegToRad(rotationDegree) );
    
    if (scaleX !== 1 || scaleY !== 1)  ctx.scale(scaleX, scaleY);

    ctx.drawImage( imageToDraw, -(imageToDrawWidth / 2), -(imageToDrawHeight / 2) );

    ctx.globalAlpha = 1;
    ctx.restore();
}
//                                                                                            "Retro Blast Tech"                                                                                       
//--------------------------------------------------------------------------------------------------------------
function ClearTextCache()
{
    for (var index = 0; index < 100; index++)
    {
        TextCacheImageCanvasCTX[index].clearRect(0, 0, 800, 150);
	TextCacheText[index] = " ";
        TextCacheJustification[index] = " ";
        TextCacheScreenXOriginal[index] = -999;
	TextCacheScreenX[index] = -999;
	TextCacheScreenY[index] = -999;
	TextCacheIndex = 0;
    }
}

//--------------------------------------------------------------------------------------------------------------
function DrawTextOntoCanvas(size, text, x, y, justification, colorR, colorG, colorB, outlineColorR, outlineColorG, outlineColorB, outlineBold)
{
var computedCenterX;
var computedCenterY;

    for (var indexToCheck = 0; indexToCheck < 100; indexToCheck++)
    {
        if (  text === TextCacheText[indexToCheck]
        && y === TextCacheScreenY[indexToCheck] && x === TextCacheScreenXOriginal[indexToCheck] )
        {
            ctx.save();

            computedCenterX = Math.floor(TextCacheImageCanvas[indexToCheck].width / 2);
            computedCenterY = Math.floor(TextCacheImageCanvas[indexToCheck].height / 2);

            ctx.drawImage(  TextCacheImageCanvas[indexToCheck], (TextCacheScreenX[indexToCheck] - computedCenterX)
            , (TextCacheScreenY[indexToCheck] - computedCenterY)
            , TextCacheImageCanvas[indexToCheck].width, TextCacheImageCanvas[indexToCheck].height  );

            ctx.restore();

            return;
        }
    }

    if (TextCacheIndex < 99)  TextCacheIndex++;
    else  TextCacheIndex = 0;

    TextCacheImageCanvasCTX[TextCacheIndex].clearRect(0, 0, 640, 150);
    TextCacheImageCanvasCTX[TextCacheIndex].drawImage(PreloadedTextsBG, 0, 0, 800, 150);
    TextCacheText[TextCacheIndex] = text;
    TextCacheJustification[TextCacheIndex] = justification;
    TextCacheScreenXOriginal[TextCacheIndex] = x;
    TextCacheScreenX[TextCacheIndex] = 320;
    TextCacheScreenY[TextCacheIndex] = y;

    TextCacheImageCanvasCTX[TextCacheIndex].save();

    if (size === 55)  TextCacheImageCanvasCTX[TextCacheIndex].font = "55px Font-01";
    else if (size === 25)  TextCacheImageCanvasCTX[TextCacheIndex].font = "25px Font-01";
    else if (size === 20)  TextCacheImageCanvasCTX[TextCacheIndex].font = "20px Font-01";
    else if (size === 15)  TextCacheImageCanvasCTX[TextCacheIndex].font = "15px Font-01";
    else if (size === 12)  TextCacheImageCanvasCTX[TextCacheIndex].font = "12px Font-01";
    else if (size === 10)  TextCacheImageCanvasCTX[TextCacheIndex].font = "10px Font-01";

    TextCacheImageCanvasCTX[TextCacheIndex].textAlign = justification;

    TextCacheImageCanvasCTX[TextCacheIndex].fillStyle = "rgba("+outlineColorR+", "+outlineColorG+", "+outlineColorB+", 1)";

    y = 75;

    if (outlineBold === 0)
    {
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y-1);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x+1, y);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y+1);
        TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x-1, y);
    }
    else if (outlineBold === 1)
    {
        for (var yOffset = -2; yOffset < 3; yOffset++)
            for (var xOffset = -2; xOffset < 3; xOffset++)
                TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x+xOffset, y+yOffset);
    }

    TextCacheImageCanvasCTX[TextCacheIndex].fillStyle = "rgba("+colorR+", "+colorG+", "+colorB+", 1)";
    TextCacheImageCanvasCTX[TextCacheIndex].fillText(text, x, y);

    TextCacheImageCanvasCTX[TextCacheIndex].restore();
	
    ctx.save();

    computedCenterX = Math.floor(TextCacheImageCanvas[TextCacheIndex].width / 2);
    computedCenterY = Math.floor(TextCacheImageCanvas[TextCacheIndex].height / 2);

    ctx.drawImage(  TextCacheImageCanvas[TextCacheIndex], (TextCacheScreenX[TextCacheIndex] - computedCenterX)
    , (TextCacheScreenY[TextCacheIndex] - computedCenterY)
    , TextCacheImageCanvas[TextCacheIndex].width, TextCacheImageCanvas[TextCacheIndex].height  );

    ctx.restore();
}
