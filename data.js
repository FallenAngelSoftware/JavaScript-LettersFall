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

// "data.js"...

var Version = 5.00;

var HTML5LocalStorageSupported = true;

var NewHighScoreRank = 999;
var NewHighScoreNameIndex = 0;
var NewHighScoreTempName = new Array(20);

var HighScoresName = new Array(4);
    HighScoresName[0]=new Array(10);
    HighScoresName[1]=new Array(10);
    HighScoresName[2]=new Array(10);
    HighScoresName[3]=new Array(10);

var HighScoresLevel = new Array(4);
    HighScoresLevel[0] = new Array(10);
    HighScoresLevel[1] = new Array(10);
    HighScoresLevel[2] = new Array(10);
    HighScoresLevel[3] = new Array(10);

var HighScoresScore = new Array(4);
    HighScoresScore[0] = new Array(10);
    HighScoresScore[1] = new Array(10);
    HighScoresScore[2] = new Array(10);
    HighScoresScore[3] = new Array(10);

//--------------------------------------------------------------------------------------------------------------
function CreateCookie(name,value,days)
{
var expires;

    if (days)
    {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toUTCString();
    }
    else expires = "";

    document.cookie = name+"="+value+expires+"; path=/";
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function ReadCookie(name)
{
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
	var c = ca[i];
	while (c.charAt(0)===' ') c = c.substring(1,c.length);
	if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
}

//--------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function CheckHTML5LocalStorage()
{
    try
    {
		return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e)
    {
		return false;
    }
}

//--------------------------------------------------------------------------------------------------------------
function LoadOptions()
{
var temp;
var tempTwo;
var tempThree;
var gameMode;
var rank;

    InitializeHighScores();

    if ( CheckHTML5LocalStorage() === false )  HTML5LocalStorageSupported = false;

    if ( (Browser === "MS IE" && WebsiteRunOnServer === false) || HTML5LocalStorageSupported === false )
    {
		temp = ReadCookie('LettersFall5-Alpha-MusicVolume');
		if (!temp)  FirstRunCheckAudio = true;
		else  MusicVolume = parseFloat(temp);

		temp = ReadCookie('LettersFall5-Alpha-SoundVolume');
		if (!temp)  FirstRunCheckAudio = true;
		else  SoundVolume = parseFloat(temp);

		temp = ReadCookie('LettersFall5-Alpha-GameMode');
		if (temp)  GameMode = parseInt(temp);

		temp = ReadCookie('LettersFall5-Alpha-SelectedBackground');
		if (temp)  SelectedBackground = parseInt(temp);

		temp = ReadCookie('LettersFall5-Alpha-PlayerSelectedMusic');
		if (temp)  PlayerSelectedMusic = parseInt(temp);

		temp = ReadCookie('LettersFall5-Alpha-RandomizeMusicTrack');
		if (temp)  RandomizeMusicTrack = parseInt(temp);

		for (gameMode = 0; gameMode < 4; gameMode++)
		{
			for (rank = 0; rank < 10; rank++)
			{
			temp = ReadCookie('LettersFall5-Alpha-HighScoresName'+gameMode+''+rank+'');
			if (temp)  HighScoresName[gameMode][rank] = temp;

			tempTwo = ReadCookie('LettersFall5-Alpha-HighScoresLevel'+gameMode+''+rank+'');
			if (tempTwo)  HighScoresLevel[gameMode][rank] = parseInt(tempTwo);

			tempThree = ReadCookie('LettersFall5-Alpha-HighScoresScore'+gameMode+''+rank+'');
			if (tempThree)  HighScoresScore[gameMode][rank] = parseInt(tempThree);
			}
		}

		if (WebsiteRunOnServer === true)
		{
			temp = ReadCookie('LettersFall5-Alpha-Version');
			if (temp != Version)
			{
				CreateCookie('LettersFall5-Alpha-Version', Version, 9999);
				window.location.reload(true);
			}
		}
    }
    else if (HTML5LocalStorageSupported === true)
    {
		temp = localStorage.getItem("LettersFall5-Alpha-MusicVolume");
		if (!temp)  FirstRunCheckAudio = true;
		else  MusicVolume = parseFloat(temp);

		temp = localStorage.getItem("LettersFall5-Alpha-SoundVolume");
		if (!temp)  FirstRunCheckAudio = true;
		else  SoundVolume = parseFloat(temp);

		temp = localStorage.getItem("LettersFall5-Alpha-GameMode");
		if (temp)  GameMode = parseInt(temp);

		temp = localStorage.getItem("LettersFall5-Alpha-SelectedBackground");
		if (temp)  SelectedBackground = parseInt(temp);

		temp = localStorage.getItem("LettersFall5-Alpha-PlayerSelectedMusic");
		if (temp)  PlayerSelectedMusic = parseInt(temp);

		temp = localStorage.getItem("LettersFall5-Alpha-RandomizeMusicTrack");
		if (temp)  RandomizeMusicTrack = parseInt(temp);

		for (gameMode = 0; gameMode < 4; gameMode++)
		{
			for (rank = 0; rank < 10; rank++)
			{
				temp = localStorage.getItem('LettersFall5-Alpha-HighScoresName'+gameMode+''+rank+'');
				if (temp)  HighScoresName[gameMode][rank] = temp;

				tempTwo = localStorage.getItem('LettersFall5-Alpha-HighScoresLevel'+gameMode+''+rank+'');
				if (tempTwo)  HighScoresLevel[gameMode][rank] = parseInt(tempTwo);

				tempThree = localStorage.getItem('LettersFall5-Alpha-HighScoresScore'+gameMode+''+rank+'');
				if (tempThree)  HighScoresScore[gameMode][rank] = parseInt(tempThree);
			}
		}

		if (WebsiteRunOnServer === true)
		{
			temp = localStorage.getItem("LettersFall5-Alpha-Version");
			if (temp != Version)
			{
				localStorage.setItem("LettersFall5-Alpha-Version", Version);
				window.location.reload(true);
			}
		}
    }
}

//--------------------------------------------------------------------------------------------------------------
function SaveOptions()
{
var gameMode;
var rank;

    if ( (Browser === "MS IE" && WebsiteRunOnServer === false) || HTML5LocalStorageSupported === false )
    {
		CreateCookie('LettersFall5-Alpha-MusicVolume', MusicVolume, 9999);

		CreateCookie('LettersFall5-Alpha-SoundVolume', SoundVolume, 9999);

		CreateCookie('LettersFall5-Alpha-GameMode', GameMode, 9999);

		CreateCookie('LettersFall5-Alpha-SelectedBackground', SelectedBackground, 9999);

		CreateCookie('LettersFall5-Alpha-PlayerSelectedMusic', PlayerSelectedMusic, 9999);

		CreateCookie('LettersFall5-Alpha-RandomizeMusicTrack', RandomizeMusicTrack, 9999);

		for (gameMode = 0; gameMode < 4; gameMode++)
		{
			for (rank = 0; rank < 10; rank++)
			{
			CreateCookie('LettersFall5-Alpha-HighScoresName'+gameMode+''+rank+'', HighScoresName[gameMode][rank], 9999);

			CreateCookie('LettersFall5-Alpha-HighScoresLevel'+gameMode+''+rank+'', HighScoresLevel[gameMode][rank], 9999);

			CreateCookie('LettersFall5-Alpha-HighScoresScore'+gameMode+''+rank+'', HighScoresScore[gameMode][rank], 9999);
			}
		}

		CreateCookie('LettersFall5-Alpha-Version', Version, 9999);
    }
    else if (HTML5LocalStorageSupported === true)
    {
		localStorage.setItem("LettersFall5-Alpha-MusicVolume", MusicVolume);

		localStorage.setItem("LettersFall5-Alpha-SoundVolume", SoundVolume);

		localStorage.setItem("LettersFall5-Alpha-GameMode", GameMode);

		localStorage.setItem("LettersFall5-Alpha-SelectedBackground", SelectedBackground);

		localStorage.setItem("LettersFall5-Alpha-PlayerSelectedMusic", PlayerSelectedMusic);

		localStorage.setItem("LettersFall5-Alpha-RandomizeMusicTrack", RandomizeMusicTrack);

		for (gameMode = 0; gameMode < 4; gameMode++)
		{
			for (rank = 0; rank < 10; rank++)
			{
			localStorage.setItem('LettersFall5-Alpha-HighScoresName'+gameMode+''+rank+'', HighScoresName[gameMode][rank]);

			localStorage.setItem('LettersFall5-Alpha-HighScoresLevel'+gameMode+''+rank+'', HighScoresLevel[gameMode][rank]);

			localStorage.setItem('LettersFall5-Alpha-HighScoresScore'+gameMode+''+rank+'', HighScoresScore[gameMode][rank]);
			}
		}

		localStorage.setItem("LettersFall5-Alpha-Version", Version);
    }
}

//--------------------------------------------------------------------------------------------------------------
function InitializeHighScores()
{
    for (var gameMode = 0; gameMode < 4; gameMode++)
    {
		HighScoresName[gameMode][0] = "The Fallen Angel";
		HighScoresName[gameMode][1] = "Doatheman";
		HighScoresName[gameMode][2] = "mattmatteh";
		HighScoresName[gameMode][3] = "You!";
		HighScoresName[gameMode][4] = "You!";
		HighScoresName[gameMode][5] = "You!";
		HighScoresName[gameMode][6] = "You!";
		HighScoresName[gameMode][7] = "You!";
		HighScoresName[gameMode][8] = "You!";
		HighScoresName[gameMode][9] = "You!";

		HighScoresLevel[gameMode][0] = "10";
		HighScoresLevel[gameMode][1] = "9";
		HighScoresLevel[gameMode][2] = "8";
		HighScoresLevel[gameMode][3] = "7";
		HighScoresLevel[gameMode][4] = "6";
		HighScoresLevel[gameMode][5] = "5";
		HighScoresLevel[gameMode][6] = "4";
		HighScoresLevel[gameMode][7] = "3";
		HighScoresLevel[gameMode][8] = "2";
		HighScoresLevel[gameMode][9] = "1";

		HighScoresScore[gameMode][0] = "10000";
		HighScoresScore[gameMode][1] = "9000";
		HighScoresScore[gameMode][2] = "8000";
		HighScoresScore[gameMode][3] = "7000";
		HighScoresScore[gameMode][4] = "6000";
		HighScoresScore[gameMode][5] = "5000";
		HighScoresScore[gameMode][6] = "4000";
		HighScoresScore[gameMode][7] = "3000";
		HighScoresScore[gameMode][8] = "2000";
		HighScoresScore[gameMode][9] = "1000";
    }
}

//--------------------------------------------------------------------------------------------------------------
function CheckForNewHighScores()
{
var rank;
var i;

    NewHighScoreRank = 999;

    for (rank = 9; rank > -1; rank--)
    {
		if ( Score >= parseInt(HighScoresScore[GameMode][rank]) )  NewHighScoreRank = rank;
    }

    if (NewHighScoreRank != 999)
    {
		for (rank = 8; rank > NewHighScoreRank; rank--)
		{
			for (i = 0; i < HighScoresName[GameMode][rank].length; i++)
			{
				HighScoresName[GameMode][rank+1][i] = HighScoresName[GameMode][rank][i].slice(0);
			}

			for (i = 0; i < HighScoresLevel[GameMode][rank].length; i++)
			{
				HighScoresLevel[GameMode][rank+1][i] = HighScoresLevel[GameMode][rank][i].slice(0);
			}

			for (i = 0; i < HighScoresScore[GameMode][rank].length; i++)
			{
				HighScoresScore[GameMode][rank+1][i] = HighScoresScore[GameMode][rank][i].slice(0);
			}
		}

		HighScoresName[GameMode][NewHighScoreRank] = " ";

		HighScoresLevel[GameMode][NewHighScoreRank] = ""+Level+"";

		HighScoresScore[GameMode][NewHighScoreRank] = ""+Score+"";
    }
}	
