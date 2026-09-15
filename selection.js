/* =========================
   PHOTOSHOP MARQUEE SELECTION
========================= */

if (window.matchMedia("(min-width: 801px) and (pointer: fine)").matches) {

    document.body.classList.add("selection-enabled");

    const selectionBox = document.createElement("div");
    selectionBox.className = "selection-box";
    document.body.appendChild(selectionBox);

    let isSelecting = false;
    let hasSelection = false;

    let startX = 0;
    let startY = 0;


    /* Prevent browser's native image/link dragging */
    document.addEventListener("dragstart", function (event) {
        event.preventDefault();
    });


    /* START SELECTION */

    document.addEventListener("mousedown", function (event) {

        /* Only left mouse button */
        if (event.button !== 0) return;


        /* Keep interactive elements clickable */
        if (
            event.target.closest(
                "a, button, label, input, textarea, select"
            )
        ) {
            return;
        }


        event.preventDefault();


        /* If selection exists, remove it */

        if (hasSelection) {

            selectionBox.style.display = "none";

            hasSelection = false;

            return;
        }


        /* Start new selection */

        isSelecting = true;

        startX = event.clientX;
        startY = event.clientY;

        selectionBox.style.left = startX + "px";
        selectionBox.style.top = startY + "px";
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";
        selectionBox.style.display = "block";

    });


    /* MOVE SELECTION */

    document.addEventListener("mousemove", function (event) {

        if (!isSelecting) return;

        event.preventDefault();

        const currentX = event.clientX;
        const currentY = event.clientY;

        const left =
            Math.min(startX, currentX);

        const top =
            Math.min(startY, currentY);

        const width =
            Math.abs(currentX - startX);

        const height =
            Math.abs(currentY - startY);

        selectionBox.style.left = left + "px";
        selectionBox.style.top = top + "px";
        selectionBox.style.width = width + "px";
        selectionBox.style.height = height + "px";

    });


    /* FINISH SELECTION */

    document.addEventListener("mouseup", function (event) {

        if (!isSelecting) return;

        event.preventDefault();

        isSelecting = false;

        const width =
            parseFloat(selectionBox.style.width);

        const height =
            parseFloat(selectionBox.style.height);


        /* Tiny click = don't create a selection */

        if (width < 3 && height < 3) {

            selectionBox.style.display = "none";

            hasSelection = false;

            return;
        }

        hasSelection = true;

    });

}