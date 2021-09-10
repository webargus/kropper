
window.onload = _  => {

    const minDim = 200;
    const maxDim = 300;
    const kropper = Kropper.create(document.querySelector(".kropper-container"));

    const generateRandom = (lowIndex, highIndex) => {
        return lowIndex + parseInt(Math.random(Date.now())*(highIndex - lowIndex));
    };

    const loadRandomImage = _ => {
        var width = generateRandom(minDim, maxDim);
        var height = generateRandom(minDim, maxDim);
        var uri = `https://unsplash.it/${width}/${height}/?random`;
        Kropper.crop(uri);
    };

    document.querySelector("#random-img").addEventListener("click", e => {
        loadRandomImage();
    });

};
















