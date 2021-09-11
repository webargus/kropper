
const Kropper = (_ => {
    // globals
    const img = document.createElement("img");
    const shadowboard = document.createElement("div");
    shadowboard.className = "kropper-shadowboard";
    const clipboard = document.createElement("div");
    clipboard.className = "kropper-clipboard";
    clipboard.style.clipPath = "inset(16px 16px 16px 16px)";
    // clipboard handles
    const handleLeft = document.createElement("div");
    handleLeft.className = "kropper-handle kropper-handle-left";
    handleLeft.setAttribute("draggable", true);
    const handleBottom = document.createElement("div");
    handleBottom.className = "kropper-handle kropper-handle-bottom";
    handleBottom.setAttribute("draggable", true);
    const handleRight = document.createElement("div");
    handleRight.className = "kropper-handle kropper-handle-right";
    handleRight.setAttribute("draggable", true);
    const handleTop = document.createElement("div");
    handleTop.className = "kropper-handle kropper-handle-top";
    handleTop.setAttribute("draggable", true);
    var container, rect, dragHandle, dragX, dragY;

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
        // get just the integer values from clip path string into an array
        var arr = path.split(/\s+/).map(el => {return parseInt(el.match(/\d+/)[0]); });
        const length = arr.length;
        // generates sequence 2, 1, 1, 0 for array lengths = 1, 2, 3, 4, respectively,
        // for we need to execute loop twice when array length = 1, once when array length = 2 or 3 and none when array length = 4
        for(var i = 0; i < Math.ceil( (4 - length)/2 ); i++) {
            arr = [...arr, ...arr.slice(arr.length-2, 5-arr.length)];
        }
        return arr;
    };

    const leftDrag = arr => {
        arr[3] = dragX;
        clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
    };

    const rightDrag = arr => {
        console.log("arr[1]", arr[1], "dragX", dragX, "arr[1]+dragX", arr[1]+dragX);
        arr[1] = rect.width - dragX - 21;
        clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
    };

    const topDrag = arr => {
        
        clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
    };

    const bottomDrag = arr => {
        
        clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
    };

    const handleDragOver = e => {
        e.preventDefault();
        dragX = e.offsetX;
        dragY = e.offsetY;

        var arr = getClipPathArray();
        var handle = dragHandle.classList.value.match(/[^-]+$/)[0];
        switch(handle) {
            case 'left':
                leftDrag(arr);
                break;
            case 'right':
                rightDrag(arr);
                break;
            case 'top':
                topDrag(arr);
                break;
            case 'bottom':
                bottomDrag(arr);
                break;
        }
    };

    const create = (containerElement) => {

        container = containerElement;
        rect = container.getBoundingClientRect();
        container.appendChild(shadowboard);
        container.appendChild(clipboard);
        container.appendChild(handleLeft);
        container.appendChild(handleBottom);
        container.appendChild(handleRight);
        container.appendChild(handleTop);

        clipboard.addEventListener("dragover", handleDragOver);
        shadowboard.addEventListener("dragover", handleDragOver);

        container.querySelectorAll(".kropper-handle").forEach(el => {
            el.addEventListener("dragstart", e => {
                e.dataTransfer.effectAllowed = "move";
                dragHandle = e.target;
            });
            el.addEventListener("dragend", e => {
                var handle = dragHandle.classList.value.match(/[^-]+$/)[0];
                switch(handle) {
                    case 'left':
                       dragHandle.style.left = `${dragX}px`;
                        break;
                    case 'right':
                        dragHandle.style.right = `${rect.width - dragX - 21}px`;
                        break;
                    case 'top':
                    case 'bottom':
                        dragHandle.style.top = `${dragY}px`;
                        break;
                }
            });
        });
    };

    return {
        create: create,
        crop: crop,
     };

})();












