
window.onload = _  => {

    const minDim = 200;
    const maxDim = 800;
    Kropper.create(document.querySelector(".kropper-container"));
    const resultImg = document.getElementById("crop-result-img");

    const generateRandom = (lowIndex, highIndex) => {
        return lowIndex + parseInt(Math.random(Date.now())*(highIndex - lowIndex));
    };

    const getCropResult = _ => {
        Kropper.result(blob => {
            console.log(blob);
            let url = URL.createObjectURL(blob);
            resultImg.onload = _ => {
                URL.revokeObjectURL(url);
            }
            resultImg.src = url;
        });
    };

    const loadRandomImage = _ => {
        var width = generateRandom(minDim, maxDim);
        var height = generateRandom(minDim, maxDim);
        var uri = 'img/bokunohero.jpg'; // `https://unsplash.it/${width}/${height}/?random`;
        Kropper.crop(uri).then(res => {
            getCropResult();
        });
    };

    document.querySelector("#random-img").addEventListener("click", e => {
        loadRandomImage();
    });

    document.querySelector("#get-result").addEventListener("click", getCropResult);

    window.addEventListener("crop", e => {
        console.log(e.detail);
    });

    loadRandomImage();

};
















