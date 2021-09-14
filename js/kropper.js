
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
    const domImage = document.createElement("img");
    var container,      // user-defined element
    userRect,            // container JS bounding rect
    cropRect;             // JS scaled bounding rect of img loaded via crop function

    const reset = _  => {
        resizerLeft.style.top = resizerRight.style.top = resizerTop.style.left = resizerBottom.style.left = '50%';
        resizerLeft.style.left = resizerRight.style.right = resizerTop.style.top = resizerBottom.style.bottom = '16px';
        clipboard.style.clipPath = "inset(16px 16px 16px 16px)";
        CropObj.update(16, 16, 16, 16);
    };

    const CropObj = (_ => {
        //
        const canvas = document.createElement("canvas");
        const canvasContext = canvas.getContext("2d");
        var sCropWidth,       // width of crop region in source image
        sCropHeight,            // height of crop region in souce image
        sX, sY;                     // coords of top left crop rectangle in source image
        var cropWidth, cropHeight
    
        const crop = uri => {
            return new Promise((resolve, reject) => {
    
                domImage.src = uri;
                domImage.onload = _ => {
                    if(domImage.width >= domImage.height) {
                        container.style.width = `${userRect.width}px`;
                        container.style.height = `${(domImage.height/domImage.width)*userRect.height}px`;
                    } else {
                        container.style.height = `${userRect.height}px`;
                        container.style.width = `${(domImage.width/domImage.height)*userRect.width}px`;
                    }
                    cropRect = container.getBoundingClientRect();
                    console.log("cropRect", cropRect);
                    console.log("domImage.width", domImage.width, "domImage.height", domImage.height);
                    canvasContext.width = userRect.width;
                    canvasContext.height = userRect.height;
                    canvasContext.drawImage(domImage, 0, 0, canvasContext.width, canvasContext.height);
                    //domImage.style.aspectRatio = 'auto';
                    canvas.toBlob( blob => {
                        const uri = URL.createObjectURL(blob);
                        shadowboard.style.backgroundImage = uri; //`url(${uri})`;
                        clipboard.style.backgroundImage = uri; //`url(${uri})`;
                        URL.revokeObjectURL(uri);
                        reset();
                        resolve("ready");
                    }, 'image/png', 1);
                };
            });
    
        };
    
        const update = (left, top, right, bottom)  => {
            // calc width and height of clipboard img
            cropWidth = cropRect.width - left - right;
            cropHeight = cropRect.height - top - bottom;
            // calc corresponding width and height in source img
            sCropWidth = cropWidth * domImage.width / cropRect.width;
            sCropHeight = cropHeight * domImage.height / cropRect.height;
            // calc top left coords of img to crop in source img
            sX = left * domImage.width / cropRect.width;
            sY = top * domImage.height / cropRect.height;
            // trigger custom oncrop event
            const event = new CustomEvent("crop", { detail: {x: sX, y: sY, width: sCropWidth, height: sCropHeight } });
            dispatchEvent(event);
        };

        const result = callback => {
            console.log("sX", sX, "sY", sY);
            console.log("cropWidth", cropWidth, "cropHeight", cropHeight);
            console.log("sCropWidth", sCropWidth, "sCropHeight", sCropHeight);
            console.log("domImg.width", domImage.width, "domImg.height", domImage.height);
            console.log("cropRect.width", cropRect.width, "cropRect.height", cropRect.height);
            console.log("sCropWidth/domImg.width", sCropWidth/domImage.width);
            console.log("cropWidth/cropRect.width", cropWidth/cropRect.width);
            console.log("cropHeight/cropRect.height", cropHeight/cropRect.height);
            canvas.width = sCropWidth;
            canvas.height = sCropHeight;
            canvasContext.drawImage(domImage, sX, sY,  sCropWidth, sCropHeight, 0, 0, sCropWidth, sCropHeight);
            canvas.toBlob( blob => {
                callback(blob);
            }, "image/png", 1);
        };

        return {
            update: update,
            crop: crop,
            result: result
        };
    })();

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
                            if(leftX > cropRect.width - rightX -  resizerLeft.offsetWidth - resizerRight.offsetWidth - 1) {
                                leftX = cropRect.width - rightX -  resizerLeft.offsetWidth - resizerRight.offsetWidth - 1;
                            } else if(el == dragResizer) {
                               leftX--;
                            } else {
                                leftX += (dragX > leftX) ? 1 : -1;
                            }
                            if(leftX < 0) {
                                leftX = 0;
                            }
                            dragResizer.style.left = leftX + "px";
                            resizerTop.style.left = resizerBottom.style.left = leftX + (cropRect.width - leftX - rightX)/2 - resizerBottom.offsetWidth/2 + "px";
                            break;
                        case resizerRight:
                            if( rightX > cropRect.width - leftX - resizerLeft.offsetWidth - resizerRight.offsetWidth - 1) {
                                rightX = cropRect.width - leftX - resizerLeft.offsetWidth - resizerRight.offsetWidth - 1
                            } else if(el == dragResizer) {
                                rightX--;
                            } else {
                                rightX += (dragX > cropRect.width - rightX) ? -1 : 1;
                            }
                            if(rightX < 0) {
                                rightX = 0;
                            }
                            dragResizer.style.right = rightX + "px";
                            resizerTop.style.left = resizerBottom.style.left = leftX + (cropRect.width - leftX - rightX)/2 - resizerBottom.offsetWidth/2 + "px";
                            break;
                        case resizerTop:
                            if(topY > cropRect.height - bottomY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1) {
                                topY = cropRect.height - bottomY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1;
                            } else if(el == dragResizer) {
                                topY--;
                            } else {
                                topY += ( dragY > topY) ? 1 : -1;
                            }
                            if(topY < 0) {
                                topY = 0;
                            }
                            dragResizer.style.top = topY + "px";
                            resizerLeft.style.top = resizerRight.style.top = topY + (cropRect.height - topY - bottomY)/2 - resizerRight.offsetHeight/2 + "px";
                            break;
                        case resizerBottom:
                            if( bottomY > cropRect.height - topY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1) {
                                bottomY = cropRect.height - topY - resizerTop.offsetHeight - resizerBottom.offsetHeight - 1;
                            } else if(el == dragResizer) {
                                bottomY++;
                            } else {
                                bottomY += ( dragY < cropRect.height - bottomY ) ? 1 : -1;
                            }
                            if(bottomY < 0) {
                                bottomY = 0;
                            }
                            dragResizer.style.bottom = bottomY + "px";
                            resizerLeft.style.top = resizerRight.style.top = topY + (cropRect.height - topY - bottomY)/2 - resizerRight.offsetWidth/2 + "px";
                            break;
                    }
                    clipboard.style.clipPath = `inset(${[topY + 'px', rightX + 'px', bottomY + 'px', leftX + 'px'].join(' ')})`;
                    // call crop event dispatcher
                    CropObj.update(leftX, topY, rightX, bottomY);
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
        crop: CropObj.crop,
        result: CropObj.result,
     };

})();












