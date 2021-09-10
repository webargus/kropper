
window.onload = _  => {

    const minDim = 200;
    const maxDim = 300;
    const generateRandom = (lowIndex, highIndex) => {
        return lowIndex + parseInt(Math.random(Date.now())*(highIndex - lowIndex));
    };

    var width = generateRandom(minDim, maxDim);
    var height = generateRandom(minDim, maxDim);
    var uri = `https://unsplash.it/${width}/${height}/?random`;
    const kropper = Kropper.create(document.querySelector(".kropper-container"), { uri: uri });

};
















