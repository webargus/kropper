
const Kropper = (_ => {
    const img = document.createElement("img");
    var container, rect, shadowboard, clipboard, dragHandle, dragX;

        img.addEventListener('mousemove', e => {
            // console.log(`mouse pos (${e.offsetX}, ${e.offsetY})`);
        });

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

    const getClipPathArray = _ => {
        // hacky calculation to get array of four clip path integer values from element style clip-path string, regardless of string format
        const path = clipboard.style.clipPath;
        console.log(path);
        // get just the integer values from clip path string into an array
        var arr = path.split(/\s+/).map(el => {return parseInt(el.match(/\d+/)[0]); });
        const length = arr.length;
        // generates sequence 2, 1, 1, 0 for array lengths = 1, 2, 3, 4, respectively,
        // for we need to execute loop twice when array length = 1, once when array length = 2 or 3 and none when array length = 4
        for(var i = 0; i < Math.ceil( (4 - length)/2 ); i++) {
            arr = [...arr, ...arr.slice(arr.length-2, 5-arr.length)];
        }
        console.log(arr);
        return arr;
    };

    const handleDragOver = e => {
        e.preventDefault();
        dragX = e.offsetX;
        const arr = getClipPathArray();
        arr[3] = dragX;
        clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
        // console.log(e.offsetX, e.offsetY);
    };

    const create = (containerElement) => {

        container = containerElement;
        rect = container.getBoundingClientRect();
        shadowboard = containerElement.querySelector(".kropper-shadowboard");
        clipboard = containerElement.querySelector(".kropper-clipboard");

        clipboard.addEventListener("dragover", handleDragOver);
        shadowboard.addEventListener("dragover", handleDragOver);

        container.querySelectorAll(".kropper-handle").forEach(el => {
            // el.addEventListener("mousedown", e => {
            //     el.style.cursor = "grabbing";
            // });
            // ['mouseup', 'mouseout'].forEach(type => {
            //     el.addEventListener(type, e => {
            //         el.style.cursor = "grab";
            //     });
            // });
            el.addEventListener("dragstart", e => {
                e.dataTransfer.setData('text/plain', null);
                e.dataTransfer.effectAllowed = "move";
                dragHandle = e.target;
            });
            // el.addEventListener("dragover", e => {
            //     // e.preventDefault();
            //     dragHandle.style.visibility = 'hidden';
            // });
            el.addEventListener("dragend", e => {
                dragHandle.style.left = `${dragX}px`;
            });
        });
    };

    return {
        create: create,
        crop: crop,
     };

})();












