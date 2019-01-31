import { songsList } from '../data/songs.js';
import PlayInfo from './play-info.js';
import TrackBar from './track-bar.js';

const Playlist = (_ => {
    // Data or State
    let songs = songsList;
    let currentlyPlayingIndex = 0;
    let currentSong = new Audio(songs[currentlyPlayingIndex].url);

    // Cache The DOM
    const playlistEl = document.querySelector(".playlist");

    const init = _ => {
        render();
        listeners();
        PlayInfo.setState({
            songsLength: songs.length,
            isPlaying: !currentSong.paused
        })
    }

    const flip = _ => {
        togglePlayPause();
        render();
    }

    const changeAudioSrc = _ => {
        currentSong.src = songs[currentlyPlayingIndex].url;
    }

    const togglePlayPause = _ => {
        return currentSong.paused ? currentSong.play() : currentSong.pause();
    }
    const mainPlay = (clickedIndex) => {
        if (currentlyPlayingIndex === clickedIndex) {
            //  Toggle Play || Pause
            console.log('same song')
            togglePlayPause();
        } else {
            console.log('new')
            currentlyPlayingIndex = clickedIndex;
            changeAudioSrc();
            togglePlayPause();
        }
        PlayInfo.setState({
            songsLength : songs.length,
            isPlaying: !currentSong.paused
        })
    }

    const playNext = _ => {
        if (songs[currentlyPlayingIndex + 1]) {
            currentlyPlayingIndex++;
            changeAudioSrc();
            togglePlayPause();
            render();
        } else {
            currentlyPlayingIndex = 0;
            changeAudioSrc();
            togglePlayPause();
            render();
        }
    }
    const listeners = _ => {
        playlistEl.addEventListener('click', _ => {
            if (event.target && event.target.matches('.fa')) {
                const listElem = event.target.parentNode.parentNode;
                const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);
                mainPlay(listElemIndex);
                render();
            }
        })
        currentSong.addEventListener('ended', _ => {
            playNext();
        })
    }

    currentSong.addEventListener("timeupdate", _ => {
        TrackBar.setState(currentSong);
    })

    const render = _ => {
        let markup = '';

        const toggleIcon = itemIndex => {
            if (currentlyPlayingIndex === itemIndex) {
                return currentSong.paused ? 'fa-play' : 'fa-pause';
            } else {
                return 'fa-music';
            }
        }
        songs.forEach((songObj, index) => {
            markup += `
             <li class="playlist__song ${index === currentlyPlayingIndex ? 'playlist__song--active' : ''}">
                  <div class="play-pause">
                    <i class="fa ${toggleIcon(index)} pp-icon"></i>
                  </div>
                    <div class="playlist__song-details">
                      <span class="playlist__song-name">${songObj.title}</span>
                      <br>
                      <span class="playlist__song-artist">${songObj.artist}</span>
                    </div>
                      <span class="playlist__song-duration">
                      ${songObj.time}
                      </span>
                </li>
            `;
        })
        playlistEl.innerHTML = markup;
    }

    return {
        init,
        flip
    }
})();

export default Playlist;