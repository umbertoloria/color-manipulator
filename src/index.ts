import jimp from 'jimp';
import * as fs from 'fs';
import {
    add,
    addList,
    color,
    filterColor,
    filterScalar,
    getG,
    getR,
    mult,
    onlyB,
    onlyG,
    onlyR,
    RGB,
    safeColor,
    scalar,
    sub,
    xorColor
} from './lib';

const filesConfs: {
    [key: string]: (undefined | {
        [outFile: string]: ((rgba: RGB) => RGB)
    })
} = {

    '20230226_201501.jpg': {
        '20230226_201501.jpg'(c) {
            const CUSTOM_FILTER_1 = (c: RGB) => safeColor(((1 - c.b) - .5) * 10 + .5)
            const custom_channel_1 = CUSTOM_FILTER_1(c);

            return addList(
                mult(
                    add(
                        onlyG(custom_channel_1 * .2),
                        onlyB(custom_channel_1),
                    ),
                    scalar(.85)
                ),
                onlyR(
                    getG(
                        sub(
                            filterColor(c, .5, .7),
                            scalar(.5),
                        ),
                    ),
                ),
            );
        },
    },

    '20230301_224920.jpg': {
        '20230301_224920_1.jpg'(c) {
            return addList(
                mult(
                    scalar(filterScalar(getR(c), 0.6, 0.85) - 0.6),
                    color(
                        10,
                        5,
                        0,
                    ),
                ),
                onlyB(.35),
            );
        },
        '20230301_224920_2.jpg'(c) {
            return xorColor(
                mult(
                    scalar(.4 - filterScalar(getR(c), 0.35, 0.4)),
                    color(
                        7,
                        10,
                        5,
                    ),
                ),
                onlyB(.35),
            );
        },
    },

};

(async () => {
    const files = fs.readdirSync('input');
    for (const file of files) {
        const fileConf = filesConfs[file];
        if (!!fileConf) {
            for (const [outFile, fileFilter] of Object.entries(fileConf)) {
                const image = await jimp.read(`./input/${file}`);
                // For resize large images.
                // image.resize(1000, 1000 / (image.getWidth() / image.getHeight()));
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
                await image.writeAsync(`out/${outFile}`);
            }
        }
    }
})();
