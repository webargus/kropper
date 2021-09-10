
const Kropper = (_ => {
    const img = document.createElement("img");
    var container, rect, shadowboard, clipboard;

    const create = (containerElement) => {

        container = containerElement;
        rect = container.getBoundingClientRect();
        shadowboard = containerElement.querySelector(".kropper-shadowboard");
        clipboard = containerElement.querySelector(".kropper-clipboard");

        container.querySelectorAll(".kropper-handle").forEach(el => {
            el.addEventListener("mousedown", e => {
                el.style.cursor = "grabbing";
            });
            ['mouseup', 'mouseout'].forEach(type => {
                el.addEventListener(type, e => {
                    el.style.cursor = "grab";
                });
            });
        });

        img.addEventListener('mousemove', e => {
            // console.log(`mouse pos (${e.offsetX}, ${e.offsetY})`);
        });
    };

    const crop = uri => {
        img.src = uri;
        img.onload = _ => {
            if(img.width >= img.height) {
                container.style.width = `${rect.width}px`;
                container.style.height = `${(img.height/img.width)*rect.height}px`;
            } else {
                container.style.height = `${rect.height}px`;
                container.style.width = `${(img.width/img.height)*rect.width}px`;
            }
            img.style.aspectRatio = 'auto';
            shadowboard.style.backgroundImage = `url(${img.src})`;
            clipboard.style.backgroundImage = `url(${img.src})`;
        };
    };

    return {
        create: create,
        crop: crop,
     };

})();












