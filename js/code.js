const wrapper = document.querySelector('.wrapper'),
    musicImage = document.querySelector('.music_image img'),
    musicName = document.querySelector('.song_name span'),
    artist = document.querySelector('.singer span'),
    mainAudio = document.querySelector('#main_audio'),
    play_pause = document.querySelector('.play_pause'),
    prevBtn = document.querySelector('#prev'),
    nextBtn = document.querySelector('#next'),
    repeat = document.querySelector('#repeat'),
    moreMusic = document.querySelector('#more'),
    progressBar = document.querySelector('.progress_bar'),
    progressArea = document.querySelector('.progress_area'),
    current = document.querySelector('.current'),
    totalTime = document.querySelector('.duration'),
    musicList = document.querySelector('.music_list'),
    close = document.querySelector('#close');

let musicIndex = 1;

window.addEventListener("load", () => {
    musicLoad(musicIndex);
    playing();
});

function musicLoad(index) {
    musicName.innerHTML = allMusic[index - 1].name;
    artist.innerHTML = allMusic[index - 1].artist;
    musicImage.src = `image/${allMusic[index-1].image}.jpeg`;
    mainAudio.src = `music/${allMusic[index-1].src}.mp3`;
}

//play music function
function playMusic() {
    //play btn ko click yin pause class ko add ml dr ma nout ta kr click yin pauseMusic ko loat mr
    wrapper.classList.add('pause');
    //icon change tr
    play_pause.querySelector('i').innerHTML = "pause";

    mainAudio.play();
}


function pauseMusic() {
    wrapper.classList.remove('pause');
    play_pause.querySelector('i').innerHTML = "play_arrow";
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    musicLoad(musicIndex);
    playing();
    playMusic();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    musicLoad(musicIndex);
    playing();
    playMusic();
}

//play pause button
play_pause.addEventListener("click", () => {
    //wrapper classist mr pause pr yin true ma pr yin flase
    const isplay = wrapper.classList.contains('pause');
    //ture phit yin pauseMusc ko loat
    isplay ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
})

prevBtn.addEventListener("click", () => {
    prevMusic();
})

mainAudio.addEventListener("timeupdate", (e) => {
    //get current time get data when u run music
    const currentTime = e.target.currentTime;
    //get duration when u run music
    const duration = e.target.duration;
    //100% in duration so how much in current
    let proWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${proWidth}%`;
    //format change Math.floor ka 2letter pl u
    let min = Math.floor(currentTime / 60);
    let sec = Math.floor(currentTime % 60);

    sec < 10 ? sec = `0${sec}` : sec = sec;

    current.innerText = `${min}:${sec}`;

    mainAudio.addEventListener('loadeddata', () => {
        let audioDuration = mainAudio.duration;
        let min = Math.floor(audioDuration / 60);
        let sec = Math.floor(audioDuration % 60);
        sec < 10 ? sec = `0${sec}` : sec = sec;

        totalTime.innerText = `${min}:${sec}`;
    })



})

//get currenttime by pregress bar width (music htal mr kyaw tr)
progressArea.addEventListener("click", (e) => {
    //get total width of pregress area
    let maxWidth = progressArea.clientWidth;
    //get clicked width of progress area if offsetY then it's height (output with px)
    let clickedX = e.offsetX;
    let musicduration = mainAudio.duration;

    mainAudio.currentTime = (clickedX / maxWidth) * musicduration;
})

// progressBar.onmousedown = (e) => {
//     let max = progressArea.clientWidth - progressBar.clientWidth;
//     let l = progressBar.offsetLeft;
//     let x = e.offsetX;
//     let musicdur = mainAudio.duration;
//     this.onmousemove = (e) => {
//         let moveX = e.offsetX;
//     }
//     console.log(to);
//     this.onmouseup = (e) => {
//         let upX = e.offsetX;
//     }
// }

//work loop or loop one or shuffle
repeat.onclick = () => {
    let text = repeat.innerText;

    switch (text) {
        case 'repeat':
            repeat.innerText = 'repeat_one';
            repeat.setAttribute('title', 'Loop_one');
            break;

        case 'repeat_one':
            repeat.innerText = 'shuffle';
            repeat.setAttribute('title', 'Shuffle');
            break;

        case 'shuffle':
            repeat.innerText = 'repeat';
            repeat.setAttribute('title', 'Loop_All');
            break;
    }
}

//actual work for loop or loop one or shuffle
mainAudio.onended = () => {
    let getText = repeat.innerText;

    switch (getText) {
        case 'repeat':
            nextMusic();
            break;

        case 'repeat_one':
            mainAudio.currentTime = 0;
            musicLoad(musicIndex);
            playMusic();
            break;

        case 'shuffle':
            let randomNum = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randomNum = Math.floor((Math.random() * allMusic.length) + 1)
            } while (randomNum == musicIndex)
            musicIndex = randomNum;
            musicLoad(musicIndex);
            playMusic();
            break;
    }
}

moreMusic.onclick = () => {
    musicList.classList.toggle('show');
}

close.onclick = () => {
    moreMusic.click();
}

// console.log(mainAudio);

const ulTag = wrapper.querySelector('ul');

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i+1}">
                        <div class="rows">
                            <span>${allMusic[i].name}</span>
                            <p>${allMusic[i].artist}</p>
                        </div>
                        <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                        <span id="${allMusic[i].src}" class="audio_duration"></span>
                    </li>`
    ulTag.insertAdjacentHTML('beforeend', liTag);


    //get elemetn by querey note::idk why `` is invalid with '' in querySelector
    //so becareful
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    liAudioTag.addEventListener('loadeddata', () => {
        let fixDuration = liAudioTag.duration;
        let totalMin = Math.floor(fixDuration / 60);
        let totalSec = Math.floor(fixDuration % 60);
        totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = totalSec;
        liAudioDuration.innerText = `${totalMin}:${totalSec}`
        liAudioDuration.setAttribute('duration', `${totalMin}:${totalSec}`)
    })
}

// get li tags
const liAll = ulTag.querySelectorAll('li');

function playing() {
    for (let j = 0; j < allMusic.length; j++) {
        let audiotext = liAll[j].querySelector(`#${allMusic[j].src}`)
        if (liAll[j].classList.contains('playing')) {
            liAll[j].classList.remove('playing');
            audiotext.innerHTML = audiotext.getAttribute('duration');
        }
        if (liAll[j].getAttribute('li-index') == musicIndex) {
            liAll[j].classList.add('playing');
            audiotext.innerText = "playing";
        }
        //add onclick attribute to all li tag
        liAll[j].setAttribute('onclick', 'clicked(this)');
    }
}

function clicked(element) {
    //get li-index attribute
    let liTagIndex = element.getAttribute("li-index");
    //set musicIndex as litagindex
    musicIndex = liTagIndex;
    musicLoad(musicIndex);
    playMusic();
    playing();
}