const preview = document.getElementById("graphicPreview");
const imageContainer = document.getElementById("graphicImages");
const projectMenu = document.getElementById("projectMenu");

const scrollThumb = document.getElementById("graphicScrollThumb");
const scrollTrack = document.querySelector(".graphic-scroll-track");


/* =========================
   SETTINGS
========================= */

const MAX_PROJECTS = 20;
const MAX_FILES_PER_PROJECT = 20;

const imageExtensions = [
    "png",
    "jpg",
    "jpeg",
    "webp"
];

const videoExtensions = [
    "mp4",
    "webm"
];

const allExtensions = [
    ...imageExtensions,
    ...videoExtensions
];


let lockedProject = null;

let isDragging = false;
let dragStartX = 0;
let dragStartScroll = 0;


/* =========================
   CHECK FILE
========================= */

function checkFile(path, extension) {

    return new Promise((resolve) => {

        if (videoExtensions.includes(extension)) {

            const video = document.createElement("video");

            video.preload = "metadata";

            video.onloadedmetadata = () => {
                resolve(true);
            };

            video.onerror = () => {
                resolve(false);
            };

            video.src = path;

        }

        else {

            const img = new Image();

            img.onload = () => {
                resolve(true);
            };

            img.onerror = () => {
                resolve(false);
            };

            img.src = path;

        }

    });

}


/* =========================
   FIND ONE NUMBERED FILE
========================= */

async function findFile(projectNumber, fileNumber) {

    for (const extension of allExtensions) {

        const path =
            `images/graphic/project${projectNumber}-${fileNumber}.${extension}`;

        const exists =
            await checkFile(path, extension);

        if (exists) {

            return {
                path: path,
                extension: extension
            };

        }

    }

    return null;

}


/* =========================
   FIND ALL MEDIA
========================= */

async function findProjectFiles(projectNumber) {

    const files = [];

    for (
        let fileNumber = 1;
        fileNumber <= MAX_FILES_PER_PROJECT;
        fileNumber++
    ) {

        const file =
            await findFile(
                projectNumber,
                fileNumber
            );

        if (file) {

            files.push(file);

        }

    }

    return files;

}


/* =========================
   CREATE PREVIEW MEDIA
========================= */

function createMedia(file) {

    if (videoExtensions.includes(file.extension)) {

        const video =
            document.createElement("video");

        video.src = file.path;

        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        return video;

    }


    const img =
        document.createElement("img");

    img.src = file.path;
    img.alt = "";

    return img;

}


/* =========================
   CREATE THUMBNAIL
========================= */

function createThumbnail(firstFile) {

    if (videoExtensions.includes(firstFile.extension)) {

        const video =
            document.createElement("video");

        video.src = firstFile.path;

        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.classList.add("project-thumbnail");

        return video;

    }


    const img =
        document.createElement("img");

    img.src = firstFile.path;
    img.alt = "";

    img.classList.add("project-thumbnail");

    return img;

}


/* =========================
   SHOW PROJECT
========================= */

async function showProject(projectNumber) {

    const files =
        await findProjectFiles(projectNumber);

    imageContainer.innerHTML = "";


    files.forEach((file) => {

        const media =
            createMedia(file);

        imageContainer.appendChild(media);

    });


    preview.scrollLeft = 0;

    preview.classList.add("active");


    setTimeout(() => {

        updateScrollbar();

    }, 100);

}


/* =========================
   HIDE PROJECT
========================= */

function hideProject() {

    if (lockedProject !== null) return;

    preview.classList.remove("active");

}


/* =========================
   CREATE PROJECT BUTTON
========================= */

function createProjectButton(
    projectNumber,
    firstFile
) {

    const button =
        document.createElement("button");

    button.classList.add("project-item");


    const thumbnail =
        createThumbnail(firstFile);


    const info =
        document.createElement("div");

    info.classList.add("project-info");


    const number =
        document.createElement("span");

    number.textContent =
        String(projectNumber).padStart(2, "0");


    const title =
        document.createElement("span");

    title.textContent =
        `PROJECT ${String(projectNumber).padStart(2, "0")}`;


    info.appendChild(number);
    info.appendChild(title);

    button.appendChild(thumbnail);
    button.appendChild(info);


    /* HOVER */

    button.addEventListener("mouseenter", () => {

        if (lockedProject === null) {

            showProject(projectNumber);

        }

    });


    button.addEventListener("mouseleave", () => {

        if (lockedProject === null) {

            hideProject();

        }

    });


    /* CLICK */

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".project-item")
            .forEach((item) => {

                item.classList.remove("active");

            });


        if (lockedProject === projectNumber) {

            lockedProject = null;

            preview.classList.remove("active");

            return;

        }


        lockedProject = projectNumber;

        button.classList.add("active");

        showProject(projectNumber);

    });


    return button;

}


/* =========================
   BUILD PROJECT MENU
========================= */

async function buildProjectMenu() {

    projectMenu.innerHTML = "";


    for (
        let projectNumber = 1;
        projectNumber <= MAX_PROJECTS;
        projectNumber++
    ) {

        /*
        A project only exists if
        projectX-1 exists.
        */

        const firstFile =
            await findFile(projectNumber, 1);


        if (!firstFile) {

            continue;

        }


        const button =
            createProjectButton(
                projectNumber,
                firstFile
            );


        projectMenu.appendChild(button);

    }

}


/* =========================
   CUSTOM SCROLLBAR
========================= */

function updateScrollbar() {

    const visibleWidth =
        preview.clientWidth;

    const totalWidth =
        preview.scrollWidth;


    if (totalWidth <= visibleWidth) {

        scrollThumb.style.width = "100%";
        scrollThumb.style.left = "0px";

        return;

    }


    const ratio =
        visibleWidth / totalWidth;


    const thumbWidth =
        scrollTrack.clientWidth * ratio;


    scrollThumb.style.width =
        `${thumbWidth}px`;


    updateThumbPosition();

}


/* =========================
   SCROLLBAR POSITION
========================= */

function updateThumbPosition() {

    const maxScroll =
        preview.scrollWidth -
        preview.clientWidth;


    const maxThumbMove =
        scrollTrack.clientWidth -
        scrollThumb.offsetWidth;


    if (maxScroll <= 0) {

        scrollThumb.style.left = "0px";

        return;

    }


    const progress =
        preview.scrollLeft /
        maxScroll;


    scrollThumb.style.left =
        `${progress * maxThumbMove}px`;

}


preview.addEventListener(
    "scroll",
    updateThumbPosition
);


/* =========================
   DRAG SCROLLBAR
========================= */

scrollThumb.addEventListener(
    "mousedown",
    (event) => {

        isDragging = true;

        dragStartX =
            event.clientX;

        dragStartScroll =
            preview.scrollLeft;

        document.body.style.userSelect =
            "none";

    }
);


document.addEventListener(
    "mousemove",
    (event) => {

        if (!isDragging) return;


        const deltaX =
            event.clientX -
            dragStartX;


        const maxThumbMove =
            scrollTrack.clientWidth -
            scrollThumb.offsetWidth;


        const maxScroll =
            preview.scrollWidth -
            preview.clientWidth;


        if (maxThumbMove <= 0) return;


        const scrollRatio =
            maxScroll /
            maxThumbMove;


        preview.scrollLeft =
            dragStartScroll +
            deltaX * scrollRatio;

    }
);


document.addEventListener(
    "mouseup",
    () => {

        isDragging = false;

        document.body.style.userSelect =
            "";

    }
);


window.addEventListener(
    "resize",
    updateScrollbar
);


/* =========================
   START SITE
========================= */

buildProjectMenu();