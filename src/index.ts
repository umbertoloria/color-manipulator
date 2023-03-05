import jimp from 'jimp';
import {add, addList, getG, getInterval, mult, onlyBlue, onlyGreen, onlyRed, RGB, safeColor, scalar, sub} from "./lib";

function manipulateColor(rgba: RGB) {
    let color: RGB = {
        r: rgba.r / 255.0,
        g: rgba.g / 255.0,
        b: rgba.b / 255.0,
    };

    const CUSTOM_FILTER_1 = (c: RGB) => safeColor(((1 - c.b) - .5) * 10 + .5)
    const custom_channel_1 = CUSTOM_FILTER_1(color);

    color = addList(
        mult(
            add(
                onlyGreen(custom_channel_1 * .2),
                onlyBlue(custom_channel_1),
            ),
            scalar(.85)
        ),
        add(
            onlyRed(
                getG(
                    sub(
                        getInterval(color, .5, .7),
                        scalar(.5),
                    ),
                ),
            ),
            onlyRed(0),
        ),
    );

    rgba.r = safeColor(color.r * 255.0);
    rgba.g = safeColor(color.g * 255.0);
    rgba.b = safeColor(color.b * 255.0);
}

(async () => {
    const image = await jimp.read('./input/1.jpg');
    const width = image.getWidth();
    const height = image.getHeight();
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const colorHex = image.getPixelColor(x, y);
            const rgba = jimp.intToRGBA(colorHex);
            manipulateColor(rgba);
            image.setPixelColor(
                jimp.rgbaToInt(rgba.r, rgba.g, rgba.b, rgba.a),
                x,
                y,
            );
        }
    }
    await image.writeAsync(`out/out.png`);
})();
