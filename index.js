const faceHead =
    document.getElementById("faceHead");

const faceEyes =
    document.querySelectorAll(".face-eye");

const faceBase =
    document.querySelector(".face-base");

const faceWatcher =
    document.getElementById("faceWatcher");


/* =========================
   FACE IMAGES
========================= */

const FACE_ONE =
    "images/face.png";

const FACE_TWO =
    "images/face2.png";

let currentFace = 1;


/* =========================
   SETTINGS
========================= */

const MAX_HEAD_X = 16;
const MAX_HEAD_Y = 11;

const MAX_HEAD_MOVE_X = 18;
const MAX_HEAD_MOVE_Y = 12;

const MAX_EYE_X = 11;
const MAX_EYE_Y = 8;

const SMOOTHING = 0.07;


/* =========================
   STATE
========================= */

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;


/* =========================
   CURSOR
========================= */

window.addEventListener(
    "mousemove",
    function (event) {

        targetX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        targetY =
            (
                event.clientY /
                window.innerHeight
            ) * 2 - 1;

    }
);


/* =========================
   CURSOR LEAVES PAGE
========================= */

document.addEventListener(
    "mouseleave",
    function () {

        targetX = 0;
        targetY = 0;

    }
);


/* =========================
   CLICK FACE
========================= */

faceWatcher.addEventListener(
    "click",
    function () {

        if (currentFace === 1) {

            currentFace = 2;

            faceBase.src =
                FACE_TWO;

            faceEyes.forEach((eye) => {
                eye.src = FACE_TWO;
            });

        }

        else {

            currentFace = 1;

            faceBase.src =
                FACE_ONE;

            faceEyes.forEach((eye) => {
                eye.src = FACE_ONE;
            });

        }

    }
);


/* =========================
   ANIMATION
========================= */

function animateFace() {

    currentX +=
        (targetX - currentX) *
        SMOOTHING;


    currentY +=
        (targetY - currentY) *
        SMOOTHING;


    /* HEAD */

    const rotateY =
        currentX *
        MAX_HEAD_X;


    const rotateX =
        currentY *
        -MAX_HEAD_Y;


    const moveX =
        currentX *
        MAX_HEAD_MOVE_X;


    const moveY =
        currentY *
        MAX_HEAD_MOVE_Y;


    faceHead.style.transform = `
        translate3d(
            ${moveX}px,
            ${moveY}px,
            0
        )
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
    `;


    /* EYES */

    const eyeX =
        currentX *
        MAX_EYE_X;


    const eyeY =
        currentY *
        MAX_EYE_Y;


    faceEyes.forEach((eye) => {

        eye.style.transform = `
            translate3d(
                ${eyeX}px,
                ${eyeY}px,
                0
            )
            scale(1.02)
        `;

    });


    requestAnimationFrame(
        animateFace
    );

}


/* =========================
   START
========================= */

animateFace();