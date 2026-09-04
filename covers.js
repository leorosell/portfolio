const coversStack =
    document.getElementById("coversStack");

const coversCounter =
    document.getElementById("coversCounter");

const coversTitle =
    document.getElementById("coversTitle");

const coverPrevious =
    document.getElementById("coverPrevious");

const coverNext =
    document.getElementById("coverNext");


/* =========================
   COVER FILES
========================= */

const coverFiles = [

    "01-Gabri-Stadist Milanoo.jpg",
    "02-VJ-Bandolero.jpg",
    "03-Trebla x Sexmane CREAM.jpg",
    "04-Slaya-Yks yhest.jpg",
    "05-Kerza x VJ-Mushkila.jpg",
    "06-Trebla-Sieluton.png",
    "07-Habson-Mitä.jpg",
    "08-Fabe x Sexmane-Tehtii tää.jpg",
    "09-Fabe-Tequila.jpg",
    "10-Jami Faltin-Kerrostalo.jpg",
    "11-YB X VJ-Watch out.jpg",
    "12-Trebla-Sieluton.jpg",
    "13-VJ-Vastustaa.jpg",
    "14-Kerza-Katujen ääni.jpg",
    "15-Lancey Foux-Concept.jpg",
    "16-Destroy Lonely-Concept.jpg",
    "17-Fabe-Unused Cover.jpg",
    "18-Jami Faltin x Ani x Mirella-MMG.jpg",
    "19-Jami Faltin-Kasvoin.jpg",
    "20-VJ-DTFF.jpg",
    "21-Fabe x VJ-MMM.png",
    "22-Blacflaco-Täydellinen.jpg",
    "23-Saketti-Missio.jpg",
    "24-Badu x Habson-Fast whip.jpg",
    "25-Jami Faltin-Kertoimia Vastaan.jpg",
    "26-Bkay x DW-Boondocks.jpg"

];


/* =========================
   STATE
========================= */

let activeIndex = 0;


/* =========================
   COVER DATA
========================= */

const covers =
    coverFiles.map((filename) => {

        const noExtension =
            filename.replace(
                /\.[^/.]+$/,
                ""
            );


        const noNumber =
            noExtension.replace(
                /^\d+-/,
                ""
            );


        const title =
            noNumber
                .replace(/-/g, " ")
                .toUpperCase();


        return {

            filename: filename,

            title: title,

            path:
                `images/covers/${filename}`

        };

    });


/* =========================
   CREATE COVERS
========================= */

function createCovers() {

    coversStack.innerHTML = "";


    covers.forEach(
        (cover, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "cover-card";


            card.dataset.index =
                index;


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                cover.path;


            img.alt =
                cover.title;


            img.draggable =
                false;


            card.appendChild(img);

            coversStack.appendChild(card);

        }
    );

}


/* =========================
   UPDATE STACK
========================= */

function updateCovers() {

    const cards =
        document.querySelectorAll(
            ".cover-card"
        );


    if (cards.length === 0) {
        return;
    }


    const cardHeight =
        cards[0].offsetHeight || 300;


    cards.forEach(
        (card, index) => {

            const distance =
                index - activeIndex;


            let y = 0;
            let z = 0;
            let scale = 1;
            let tilt = 0;
            let opacity = 1;
            let zIndex = 100;


            /* =====================
               ACTIVE COVER
            ===================== */

            if (distance === 0) {

                y = 0;

                z = 100;

                scale = 1;

                tilt = 0;

                zIndex = 100;

            }


            /* =====================
               FUTURE COVERS
            ===================== */

            else if (distance > 0) {

                y =
                    -78 -
                    ((distance - 1) * 38);


                z =
                    20 -
                    ((distance - 1) * 20);


                scale =
                    Math.max(
                        0.82,
                        0.94 -
                        ((distance - 1) * 0.035)
                    );


                tilt =
                    Math.min(
                        5,
                        1.2 +
                        ((distance - 1) * 1.2)
                    );


                zIndex =
                    90 - distance;


                if (distance > 7) {
                    opacity = 0;
                }

            }


            /* =====================
               PREVIOUS COVERS
            ===================== */

            else {

                const passed =
                    Math.abs(distance);


                y =
                    (cardHeight * 1.35) +
                    ((passed - 1) * 175);


                z =
                    10 -
                    ((passed - 1) * 40);


                scale =
                    Math.max(
                        0.76,
                        0.92 -
                        ((passed - 1) * 0.055)
                    );


                tilt =
                    Math.max(
                        -14,
                        -8 -
                        ((passed - 1) * 2)
                    );


                zIndex =
                    60 - passed;


                if (passed > 4) {
                    opacity = 0;
                }

            }


            /* =====================
               APPLY
            ===================== */

            card.style.transform = `

                translate3d(
                    0,
                    ${y}px,
                    ${z}px
                )

                rotateX(
                    ${tilt}deg
                )

                scale(
                    ${scale}
                )

            `;


            card.style.opacity =
                opacity;


            card.style.zIndex =
                zIndex;

        }
    );


    updateInfo();

    updateButtons();

}


/* =========================
   UPDATE INFO
========================= */

function updateInfo() {

    if (covers.length === 0) {

        coversCounter.textContent =
            "00 / 00";


        coversTitle.textContent =
            "";


        return;

    }


    const current =
        String(
            activeIndex + 1
        ).padStart(
            2,
            "0"
        );


    const total =
        String(
            covers.length
        ).padStart(
            2,
            "0"
        );


    coversCounter.textContent =
        `${current} / ${total}`;


    coversTitle.textContent =
        covers[
            activeIndex
        ].title;

}


/* =========================
   UPDATE ARROWS
========================= */

function updateButtons() {

    /*
    UP = FORWARD

    Disabled when we reach
    cover 25.
    */

    coverPrevious.disabled =
        activeIndex ===
        covers.length - 1;


    /*
    DOWN = BACK

    Disabled when we reach
    cover 01.
    */

    coverNext.disabled =
        activeIndex === 0;

}


/* =========================
   FORWARD
========================= */

function nextCover() {

    if (
        activeIndex >=
        covers.length - 1
    ) {
        return;
    }


    activeIndex++;


    updateCovers();

}


/* =========================
   BACK
========================= */

function previousCover() {

    if (activeIndex <= 0) {
        return;
    }


    activeIndex--;


    updateCovers();

}


/* =========================
   BUTTONS
========================= */

/*
UP ARROW
=
FORWARD
*/

coverPrevious.addEventListener(
    "click",
    nextCover
);


/*
DOWN ARROW
=
BACK
*/

coverNext.addEventListener(
    "click",
    previousCover
);


/* =========================
   KEYBOARD
========================= */

window.addEventListener(
    "keydown",

    function (event) {

        /*
        UP / RIGHT
        =
        FORWARD
        */

        if (
            event.key === "ArrowUp" ||
            event.key === "ArrowRight"
        ) {

            nextCover();

        }


        /*
        DOWN / LEFT
        =
        BACK
        */

        if (
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft"
        ) {

            previousCover();

        }

    }
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    updateCovers
);


/* =========================
   START
========================= */

createCovers();

updateCovers();