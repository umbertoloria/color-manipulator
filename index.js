const Jimp = require('jimp');

const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
await image.resize(150, 150);
await image.writeAsync(`resized-image.png`);

/*
async function resize() {
    // reads the image
    const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    // resizes the image to width 150 and heigth 150.
    await image.resize(150, 150);
    // saves the image on the file system
    await image.writeAsync(`resized-image.png`);
}

resize();

async function crop() {
    // reads the image
    const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    // crops the image
    await image.crop(500, 500, 150, 150);
    // Saves the image to the file system
    await image.writeAsync(`cropped-image.png`);
}

crop()


async function rotate() {
    // reads the image
    const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    // rotates the image
    await image.rotate(45);
    // Saves the image into the file system
    await image.writeAsync(`rotated-image.png`);
}

rotate()


async function blur() {
    // reads the image
    const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    // blurs the image with the given number of pixels
    await image.blur(20);
    // Saves the image into the disk
    await image.writeAsync(`blurred-image.png`);
}

blur()

async function waterMark(waterMarkImage) {
    // reads the watermark image
    let watermark = await Jimp.read(waterMarkImage);
    // resizes the watermark image
    watermark = watermark.resize(300, 300);
    // reads the image
    const image = await Jimp.read('https://images.pexels.com/photos/4629485/pexels-photo-4629485.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260');
    //adds the watermark to the image at point 0, 0
    watermark = await watermark
    image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.5
    })
    //Saves the image into the file system
    await image.writeAsync(`watermarked-image.png`);
}

waterMark('https://destatic.blob.core.windows.net/images/nodejs-logo.png');
*/
