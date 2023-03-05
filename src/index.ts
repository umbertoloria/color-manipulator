import jimp from 'jimp';
import * as fs from 'fs';
import {add, addList, getG, getInterval, mult, onlyBlue, onlyGreen, onlyRed, RGB, safeColor, scalar, sub} from './lib';

const filesFilters: { [key: string]: ((rgba: RGB) => RGB) | undefined } = {

    '1.jpg'(color) {
        const CUSTOM_FILTER_1 = (c: RGB) => safeColor(((1 - c.b) - .5) * 10 + .5)
        const custom_channel_1 = CUSTOM_FILTER_1(color);

        return addList(
            mult(
                add(
                    onlyGreen(custom_channel_1 * .2),
                    onlyBlue(custom_channel_1),
                ),
                scalar(.85)
            ),
            onlyRed(
                getG(
                    sub(
                        getInterval(color, .5, .7),
                        scalar(.5),
                    ),
                ),
            ),
        );
    },

};

(async () => {
    const files = fs.readdirSync('input');
    for (const file of files) {
        const fileFilter = filesFilters[file];
        if (!!fileFilter) {
            const image = await jimp.read(`./input/${file}`);
            const width = image.getWidth();
            const height = image.getHeight();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const rgba = jimp.intToRGBA(image.getPixelColor(x, y));
                    const color = fileFilter({
                        r: rgba.r / 255.0,
                        g: rgba.g / 255.0,
                        b: rgba.b / 255.0,
                    });
                    rgba.r = safeColor(color.r * 255.0);
                    rgba.g = safeColor(color.g * 255.0);
                    rgba.b = safeColor(color.b * 255.0);
                    image.setPixelColor(
                        jimp.rgbaToInt(rgba.r, rgba.g, rgba.b, rgba.a),
                        x,
                        y,
                    );
                }
            }
            await image.writeAsync(`out/${file}`);
        }
    }
})();
