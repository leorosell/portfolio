/* =========================
   PHOTOSHOP STYLE SELECTION
========================= */

if (window.matchMedia("(min-width: 801px)").matches) {

    document.body.classList.add("selection-enabled");


    /* CREATE SELECTION BOX */

    const selectionBox =
        document.createElement("div");

    selectionBox.className =
        "selection-box";

    document.body.appendChild(selectionBox);


    let isSelecting = false;

    let hasSelection = false;

    let startX = 0;
    let startY = 0;


    /* =========================
       START / REMOVE SELECTION
    ========================= */

    document.addEventListener("mousedown", function (event) {

        /* Keep links and buttons clickable */

        if (
            event.target.closest(
                "a, button, label, input"
            )
        ) {
            return;
        }


        /* REMOVE EXISTING SELECTION */

        if (hasSelection) {

            selectionBox.style.display =
                "none";

            hasSelection = false;

            return;
        }


        /* START NEW SELECTION */

        isSelecting = true;

        startX = event.clientX;
        startY = event.clientY;

        selectionBox.style.left =
            startX + "px";

        selectionBox.style.top =
            startY + "px";

        selectionBox.style.width =
            "0px";

        selectionBox.style.height =
            "0px";

        selectionBox.style.display =
            "block";

        event.preventDefault();

    });


    /* =========================
       DRAG SELECTION
    ========================= */

    document.addEventListener("mousemove", function (event) {

        if (!isSelecting) {
            return;
        }


        const currentX =
            event.clientX;

        const currentY =
            event.clientY;


        const left =
            Math.min(startX, currentX);

        const top =
            Math.min(startY, currentY);

        const width =
            Math.abs(currentX - startX);

        const height =
            Math.abs(currentY - startY);


        selectionBox.style.left =
            left + "px";

        selectionBox.style.top =
            top + "px";

        selectionBox.style.width =
            width + "px";

        selectionBox.style.height =
            height + "px";

    });


    /* =========================
       FINISH SELECTION
    ========================= */

    document.addEventListener("mouseup", function () {

        if (!isSelecting) {
            return;
        }

        isSelecting = false;

        hasSelection = true;

    });

}