
const Kropper = (_ => {
    // globals
    const img = document.createElement("img");
    const shadowboard = document.createElement("div");
    shadowboard.className = "kropper-shadowboard";
    const clipboard = document.createElement("div");
    clipboard.className = "kropper-clipboard";
    clipboard.style.clipPath = "inset(16px 16px 16px 16px)";
    // clipboard handles
    const resizerLeft = document.createElement("div");
    resizerLeft.className = "kropper-handle kropper-handle-left";
    const resizerBottom = document.createElement("div");
    resizerBottom.className = "kropper-handle kropper-handle-bottom";
    const resizerRight = document.createElement("div");
    resizerRight.className = "kropper-handle kropper-handle-right";
    const resizerTop = document.createElement("div");
    resizerTop.className = "kropper-handle kropper-handle-top";
    var container, rect, dragHandle;

    const drag = (_ => {

        const cropMargin = 16;  // static

        function create() {
            const res = resizer;
            var currPos = cropMargin;
            var prevPos = cropMargin;
        }

    })();

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

    const create = (containerElement) => {

        container = containerElement;
        rect = container.getBoundingClientRect();
        container.appendChild(shadowboard);
        container.appendChild(clipboard);
        container.appendChild(resizerLeft);
        container.appendChild(resizerBottom);
        container.appendChild(resizerRight);
        container.appendChild(resizerTop);

        container.querySelectorAll(".kropper-handle").forEach(resizer => {

            const mousedown = e => {
                dragHandle = e.target;
                
                const mousemove = e => {
                    let el = e.target;
                    // abort if target element is the browser window or the handler itself to avoid mouse move 'bumps'!
                    if(!(el.classList.contains("kropper-shadowboard") || el.classList.contains("kropper-clipboard"))) {
                        return;
                    }
                    let dragX = e.offsetX;
                    if(dragX < 0) {
                        dragX = 0;
                    } else if (dragX > rect.width) {
                        dragX = rect.width;
                    }
                    console.log("dragX", dragX);
                    let dragY = e.offsetY;
            
                    var arr = getClipPathArray();
                    var handle = dragHandle.classList.value.match(/[^-]+$/)[0];
                    switch(handle) {
                        case 'left':
                            arr[3] = dragX;
                            dragHandle.style.left = dragX + "px";
                            break;
                        case 'right':
                            arr[1] = rect.width - dragX;
                            dragHandle.style.right = (rect.width - dragX) + "px";
                            break;
                        case 'top':
                           
                            break;
                        case 'bottom':
                            
                            break;
                    }
                    clipboard.style.clipPath = `inset(${arr.map(el => { return el + 'px'; }).join(' ')})`;
                };

                const mouseup = _ => {
                    console.log("mouseup");
                    window.removeEventListener("mouseup", mouseup);
                    window.removeEventListener("mousemove", mousemove);
                };

                window.addEventListener("mouseup", mouseup);
                window.addEventListener("mousemove", mousemove);
            };

            resizer.addEventListener("mousedown", mousedown);
        });

    };

    return {
        create: create,
        crop: crop,
     };

})();












