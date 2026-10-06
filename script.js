/* ==========================================
   PAGE SYSTEM
========================================== */

const pages = document.querySelectorAll(".page");
const pageNumber = document.getElementById("pageNumber");

let currentPage = 0;

function showPage(index) {

    if (index < 0 || index >= pages.length) {
        return;
    }

    pages.forEach((page, i) => {

        page.classList.remove("active");
        page.classList.remove("previous");

        if (i === index) {
            page.classList.add("active");
        }

        if (i < index) {
            page.classList.add("previous");
        }

    });

    currentPage = index;

    pageNumber.textContent =
        `${String(index + 1).padStart(2, "0")} / 10`;

    if (index === 9) {
        startFireworks();
    } else {
        stopFireworks();
    }

}


/* ==========================================
   NEXT / PREVIOUS
========================================== */

function nextPage() {

    if (currentPage < 9) {

        showPage(currentPage + 1);

    }

}


function previousPage() {

    if (currentPage > 0) {

        showPage(currentPage - 1);

    }

}


/* ==========================================
   KEYBOARD
========================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }

});


/* ==========================================
   MUSIC
========================================== */

const music =
    document.getElementById("birthdayMusic");

const musicButton =
    document.getElementById("musicButton");

const musicProgress =
    document.getElementById("musicProgress");

const musicTime =
    document.getElementById("musicTime");

let musicStarted = false;


/*
   Browser akan langsung mencoba autoplay.
*/

function startMusic() {

    if (!music) return;

    music.volume = 0.7;

    const promise =
        music.play();

    if (promise !== undefined) {

        promise
            .then(() => {

                musicStarted = true;

                updateMusicButton();

            })
            .catch(() => {

                musicStarted = false;

            });

    }

}


/*
   Autoplay saat website dibuka.
*/

window.addEventListener("load", function() {

    startMusic();

});


/*
   Kalau browser memblokir autoplay,
   interaksi pertama akan menyalakannya.
*/

document.addEventListener("click", function() {

    if (!musicStarted) {

        startMusic();

    }

}, false);


/* ==========================================
   MUSIC BUTTON
========================================== */

function toggleMusic() {

    if (!music) return;

    if (music.paused) {

        music.play();

        musicStarted = true;

    } else {

        music.pause();

    }

    updateMusicButton();

}


function updateMusicButton() {

    if (!musicButton || !music) return;

    musicButton.textContent =
        music.paused ? "▶" : "Ⅱ";

}


/* ==========================================
   MUSIC PROGRESS
========================================== */

if (music) {

    music.addEventListener(
        "timeupdate",
        function() {

            if (!music.duration) return;

            const percentage =
                (music.currentTime /
                    music.duration) *
                100;

            if (musicProgress) {

                musicProgress.style.width =
                    `${percentage}%`;

            }

            if (musicTime) {

                const minutes =
                    Math.floor(
                        music.currentTime / 60
                    );

                const seconds =
                    Math.floor(
                        music.currentTime % 60
                    );

                musicTime.textContent =
                    `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

            }

        }
    );

}


/* ==========================================
   BALLOON POP
========================================== */

const balloons =
    document.querySelectorAll(".pop-balloon");

const balloonCount =
    document.getElementById("balloonCount");

const balloonNext =
    document.getElementById("balloonNext");

let popped = 0;


balloons.forEach(function(balloon) {

    balloon.addEventListener(
        "click",
        function() {

            if (
                balloon.classList.contains("popped")
            ) {
                return;
            }

            balloon.classList.add("popped");

            popped++;

            balloonCount.textContent =
                popped;

            const message =
                balloon.dataset.message;

            if (message) {

                showPopup(message);

            }

            createConfetti(12);


            if (popped === balloons.length) {

                setTimeout(function() {

                    createConfetti(30);

                    showPopup(
                        "You found all the little messages. ♡"
                    );

                    balloonNext.classList.add("show");

                }, 700);

            }

        }
    );

});


/* ==========================================
   POPUP
========================================== */

const popup =
    document.getElementById("messagePopup");

let popupTimer;


function showPopup(message) {

    if (!popup) return;

    clearTimeout(popupTimer);

    popup.textContent =
        message;

    popup.classList.add("show");

    popupTimer =
        setTimeout(function() {

            popup.classList.remove("show");

        }, 2700);

}


/* ==========================================
   CONFETTI
========================================== */

function createConfetti(amount) {

    for (let i = 0; i < amount; i++) {

        const piece =
            document.createElement("div");

        piece.className =
            "confetti";

        const size =
            Math.random() * 6 + 5;

        piece.style.width =
            `${size}px`;

        piece.style.height =
            `${size * 1.6}px`;

        piece.style.left =
            `${Math.random() * 100}vw`;

        piece.style.top =
            `${-30 - Math.random() * 100}px`;

        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;

        piece.style.animationDuration =
            `${2 + Math.random() * 2}s`;

        document.body.appendChild(piece);

        setTimeout(function() {

            piece.remove();

        }, 4500);

    }

}


/* ==========================================
   CANDLE
========================================== */

const flame =
    document.getElementById("flame");

let candleBlown = false;


function blowCandle() {

    if (candleBlown) {
        return;
    }

    candleBlown = true;

    if (flame) {

        flame.classList.add("blown");

    }

    createConfetti(55);

    showPopup(
        "Your wish has been made. ♡"
    );


    /*
       Setelah api padam,
       masuk ke halaman 10.
    */

    setTimeout(function() {

        nextPage();

    }, 1800);

}


/* ==========================================
   FIREWORKS
========================================== */

const canvas =
    document.getElementById("fireworks");

const ctx =
    canvas ?
    canvas.getContext("2d") :
    null;

let fireworks = [];
let particles = [];

let fireworksRunning = false;
let fireworksFrame;


function resizeCanvas() {

    if (!canvas) return;

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* ==========================================
   CREATE FIREWORK
========================================== */

function createFirework() {

    if (!canvas) return;

    fireworks.push({

        x:
            Math.random() *
            canvas.width,

        y:
            canvas.height,

        targetY:
            Math.random() *
            canvas.height *
            .45 +
            50,

        speed:
            Math.random() * 4 + 6

    });

}


/* ==========================================
   EXPLOSION
========================================== */

function explode(firework) {

    const amount = 60;

    for (let i = 0; i < amount; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            Math.random() * 5 + 1;

        particles.push({

            x: firework.x,
            y: firework.y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            decay:
                Math.random() *
                .018 +
                .012,

            size:
                Math.random() * 2.5 + 1

        });

    }

}


/* ==========================================
   ANIMATION
========================================== */

function animateFireworks() {

    if (!fireworksRunning || !ctx) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       Rockets
    */

    for (
        let i = fireworks.length - 1;
        i >= 0;
        i--
    ) {

        const firework =
            fireworks[i];

        firework.y -=
            firework.speed;

        ctx.beginPath();

        ctx.arc(
            firework.x,
            firework.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,.9)";

        ctx.fill();


        if (
            firework.y <=
            firework.targetY
        ) {

            explode(firework);

            fireworks.splice(i, 1);

        }

    }


    /*
       Particles
    */

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            particles[i];

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.vy +=
            .035;

        particle.life -=
            particle.decay;


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${particle.life})`;

        ctx.fill();


        if (particle.life <= 0) {

            particles.splice(i, 1);

        }

    }


    if (Math.random() < .065) {

        createFirework();

    }


    fireworksFrame =
        requestAnimationFrame(
            animateFireworks
        );

}


/* ==========================================
   START FIREWORKS
========================================== */

function startFireworks() {

    if (!canvas || !ctx) return;

    if (fireworksRunning) return;

    fireworksRunning = true;

    fireworks = [];
    particles = [];

    resizeCanvas();

    createFirework();
    createFirework();
    createFirework();

    animateFireworks();

}


/* ==========================================
   STOP FIREWORKS
========================================== */

function stopFireworks() {

    fireworksRunning = false;

    if (fireworksFrame) {

        cancelAnimationFrame(
            fireworksFrame
        );

    }

    fireworks = [];
    particles = [];

}


/* ==========================================
   RESTART
========================================== */

function restartWebsite() {

    /*
       Kembali ke halaman 1
    */

    showPage(0);


    /*
       Reset balloons
    */

    popped = 0;

    if (balloonCount) {

        balloonCount.textContent =
            "0";

    }

    balloons.forEach(function(balloon) {

        balloon.classList.remove(
            "popped"
        );

    });


    if (balloonNext) {

        balloonNext.classList.remove(
            "show"
        );

    }


    /*
       Reset candle
    */

    candleBlown = false;

    if (flame) {

        flame.classList.remove(
            "blown"
        );

    }


    /*
       Reset fireworks
    */

    stopFireworks();


    /*
       Musik kembali dari awal.
    */

    if (music) {

        music.currentTime = 0;

        music.play().catch(
            function() {}
        );

        musicStarted = true;

        updateMusicButton();

    }


    showPopup(
        "Kita mulai lagi dari awal. ♡"
    );

}


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage(0);

        resizeCanvas();

    }
);