const clothingOptions =
    document.querySelectorAll(".clothing-option");

const resetOptions =
    document.querySelectorAll(".clothing-reset");


/* =========================
   GET CLOTHING LAYER
========================= */

function getTargetLayer(category) {

    if (category === "top") {
        return document.getElementById("selected-top");
    }

    if (category === "bottom") {
        return document.getElementById("selected-bottom");
    }

    if (category === "shoes") {
        return document.getElementById("selected-shoes");
    }

    if (category === "accessory") {
        return document.getElementById("selected-accessory");
    }

    return null;
}


/* =========================
   SELECT CLOTHING
========================= */

clothingOptions.forEach((item) => {

    item.addEventListener("click", function () {

        const category =
            this.dataset.category;

        const image =
            this.dataset.image;

        const targetLayer =
            getTargetLayer(category);


        if (!targetLayer) {
            return;
        }


        targetLayer.src = image;

        targetLayer.style.display =
            "block";

    });

});


/* =========================
   REMOVE CLOTHING
========================= */

resetOptions.forEach((item) => {

    item.addEventListener("click", function () {

        const category =
            this.dataset.category;

        const targetLayer =
            getTargetLayer(category);


        if (!targetLayer) {
            return;
        }


        targetLayer.removeAttribute("src");

        targetLayer.style.display =
            "none";

    });

});