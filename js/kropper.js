
const Kropper = (_ => {
    // globals
    const shadowboard = document.createElement("div");
    shadowboard.className = "kropper-shadowboard";
    const clipboard = document.createElement("div");
    clipboard.className = "kropper-clipboard";
    // clipboard resizers
    const resizerLeft = document.createElement("div");
    resizerLeft.className = "kropper-resizer";
    const resizerBottom = document.createElement("div");
    resizerBottom.className = "kropper-resizer";
    const resizerRight = document.createElement("div");
    resizerRight.className = "kropper-resizer";
    const resizerTop = document.createElement("div");
    resizerTop.className = "kropper-resizer";
    //  DOM image to hold user-submitted image for cropping
    const img = document.createElement("img");
    var container,      // user-defined element
    userRect,            // container JS bounding rect
    imgRect;             // JS bounding rect of img loaded via crop function

    const resetResizers = _  => {
        resizerLeft.style.top = resizerRight.style.top = resizerTop.style.left = resizerBottom.style.left = '50%';
        resizerLeft.style.left = resizerRight.style.right = resizerTop.style.top = resizerBottom.style.bottom = '16px';
        clipboard.style.clipPath = "inset(16px 16px 16px 16px)";
    };

    const crop = uri => {
        img.src = uri;
        img.onload = _ => {
            if(img.width >= img.height) {
                container.style.width = `${userRect.width}px`;
                container.style.height = `${(img.height/img.width)*userRect.height}px`;
            } else {
                container.style.height = `${userRect.height}px`;
                container.style.width = `${(img.width/img.height)*userRect.width}px`;
            }
            imgRect = container.getBoundingClientRect();
            img.style.aspectRatio = 'auto';
            shadowboard.style.backgroundImage = `url(${img.src})`;
            clipboard.style.backgroundImage = `url(${img.src})`;
            resetResizers();
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
        userRect = container.getBoundingClientRect();
        container.appendChild(shadowboard);
        container.appendChild(clipboard);
        container.appendChild(resizerLeft);
        container.appendChild(resizerBottom);
        container.appendChild(resizerRight);
        container.appendChild(resizerTop);

        container.querySelectorAll(".kropper-resizer").forEach(resizer => {

            const mousedown = e => {
                var dragResizer = e.target;
                
                const mousemove = e => {
                    let el = e.target;
                    let dragX = e.offsetX;
                    let dragY = e.offsetY;

                    [topY, rightX, bottomY, leftX] = getClipPathArray();
                    switch(dragResizer) {
                        case resizerLeft:
                            if(leftX > imgRect.width - rightX -  resizerLeft.offsetWidth - resizerRight.offsetWidth - 1) {
                                leftX = imgRect.width - rightX -  resizerLeft.offsetWidth - resizerRight.offsetWidth - 1;
                            } else if(el == dragResizer) {
                               leftX--;
                            } else {
                                leftX += (dragX > leftX) ? 1 : -1;
                            }
                            if(leftX < 0) {
                                leftX = 0;
                            }
                            dragResizer.style.left = leftX + "px";
                            resizerTop.style.left = resizerBottom.style.left = leftX + (imgRect.width - leftX - rightX)/2 - resizerBottom.offsetWidth/2 + "px";
                            break;
                        case resizerRight:
                            if( rightX > imgRect.width - leftX - resizerLeft.offsetWidth - resizerRight.offsetWidth - 1) {
                                rightX = imgRect.width - leftX - resizerLeft.offsetWidth - resizerRight.offsetWidth - 1
                            } else if(el == dragResizer) {
                                rightX--;
                            } else {
                                rightX += (dragX > imgRect.width - rightX) ? -1 : 1;
                            }
                            if(rightX < 0) {
                                rightX = 0;
                            }
                            dragResizer.style.right = rightX + "px";
                            resizerTop.style.left = resizerBottom.style.left = leftX + (imgRect.width - leftX - rightX)/2 - resizerBottom.offsetWidth/2 + "px";
                            break;
                        case resizerTop:
                            if(topY > imgRect.height - bottomY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1) {
                                topY = imgRect.height - bottomY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1;
                            } else if(el == dragResizer) {
                                topY--;
                            } else {
                                topY += ( dragY > topY) ? 1 : -1;
                            }
                            if(topY < 0) {
                                topY = 0;
                            }
                            dragResizer.style.top = topY + "px";
                            resizerLeft.style.top = resizerRight.style.top = topY + (imgRect.height - topY - bottomY)/2 - resizerRight.offsetHeight/2 + "px";
                            break;
                        case resizerBottom:
                            if( bottomY > imgRect.height - topY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1) {
                                bottomY = imgRect.height - topY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1;
                            } else if(el == dragResizer) {
                                bottomY++;
                            } else {
                                bottomY += ( dragY < imgRect.height - bottomY ) ? 1 : -1;
                            }
                            if(bottomY < 0) {
                                bottomY = 0;
                            }
                            dragResizer.style.bottom = bottomY + "px";
                            resizerLeft.style.top = resizerRight.style.top = topY + (imgRect.height - topY - bottomY)/2 - resizerRight.offsetWidth/2 + "px";
                            break;
                    }
                    clipboard.style.clipPath = `inset(${[topY + 'px', rightX + 'px', bottomY + 'px', leftX + 'px'].join(' ')})`;
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












