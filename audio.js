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

// "audio.js"...

var SoundVolume = .5;
var MusicVolume = .5;

var SoundType;
var NumberOfSoundEffects = 10;
var SoundArray = new Array(NumberOfSoundEffects);
var NumberOfMusics = 8;
var MusicArray = new Array(NumberOfMusics);

var CurrentlyPlayingMusicTrack = 0;

var MusicIsCompletelyLoaded = new Array(NumberOfMusics);

var FirstRunCheckAudio = false;

//--------------------------------------------------------------------------------------------------------------
function MusicLoaded(index)
{
    MusicIsCompletelyLoaded[index] = true;
}

//--------------------------------------------------------------------------------------------------------------
function LoopMusicFixForFirefox()
{
    if (RandomizeMusicTrack === true)  PlayerSelectedMusic = Math.floor( (Math.random() * 8) );
    PlayMusic(PlayerSelectedMusic);
}

//--------------------------------------------------------------------------------------------------------------
function LoadSound()
{
var index;

    for (index = 0; index < NumberOfMusics; index++)  MusicIsCompletelyLoaded[index] = false;
	
    if (SoundType === "ogg" || SoundType === "mp3")
    {
        for (index = 0; index < NumberOfSoundEffects; index++)
            SoundArray[index] = document.createElement("Audio");

        SoundArray[0].src = "./data/audio/Click." + SoundType;
        SoundArray[1].src = "./data/audio/Undo." + SoundType;
        SoundArray[2].src = "./data/audio/Clear." + SoundType;
        SoundArray[3].src = "./data/audio/Word-Bad." + SoundType;
        SoundArray[4].src = "./data/audio/Word-Good." + SoundType;
        SoundArray[5].src = "./data/audio/Bomb-Up." + SoundType;
        SoundArray[6].src = "./data/audio/Bomb-Launched." + SoundType;
        SoundArray[7].src = "./data/audio/Bomb-Explosion." + SoundType;
        SoundArray[8].src = "./data/audio/Cheer." + SoundType;
        SoundArray[9].src = "./data/audio/Level-Up." + SoundType;

        for (index = 0; index < NumberOfSoundEffects; index++)  { SoundArray[index].preLoad = "auto"; }

        for (index = 0; index < NumberOfMusics; index++)
        {
            MusicArray[index] = document.createElement("Audio");
            MusicArray[index].src = ("./data/audio/Track-0"+(index+1)+"-BGM." + SoundType);
            MusicArray[index].volume = MusicVolume;
            MusicArray[index].preload = "auto";
            MusicArray[index].addEventListener( "canplay", MusicLoaded.bind(window, index) );
        }
    }
}

//--------------------------------------------------------------------------------------------------------------
function PlaySoundEffect(index)
{
    if (SoundType === "null")  return;    

    SoundArray[index].volume = SoundVolume;
    SoundArray[index].currentTime = 0;
    SoundArray[index].play();
}

//--------------------------------------------------------------------------------------------------------------
function PlayMusic(index)
{
    if (SoundType === "null")  return;

    MusicArray[CurrentlyPlayingMusicTrack].pause();

    CurrentlyPlayingMusicTrack = index;
    MusicArray[index].addEventListener("ended", LoopMusicFixForFirefox, false);

    MusicArray[index].currentTime = 0;
    
    MusicArray[index].volume = MusicVolume;

    MusicArray[index].play();
}
