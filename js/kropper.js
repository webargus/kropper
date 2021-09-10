
const Kropper = (_ => {

    const create = (containerElement, options) => {

        const shadowboard = containerElement.querySelector(".kropper-shadowboard");
        const clipboard = containerElement.querySelector(".kropper-clipboard");
        var img = document.createElement("img");
        img.src = options.uri;
        img.onload = _ => {
            if(img.width >= img.height) {
                containerElement.style.width = '400px';
                containerElement.style.height = (img.height/img.width)*400 + 'px';
            } else {
                containerElement.style.height = '400px';
                containerElement.style.width = (img.width/img.height)*400 + 'px';
            }
            img.style.aspectRatio = 'auto';
            shadowboard.style.backgroundImage = `url(${img.src})`;
            clipboard.style.backgroundImage = `url(${img.src})`;
        };
        img.addEventListener('mousemove', e => {
            // console.log(`mouse pos (${e.offsetX}, ${e.offsetY})`);
        });
    };

    return { create: create };

})();












