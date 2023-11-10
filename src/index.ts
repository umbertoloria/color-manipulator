import jimp from 'jimp';
import * as fs from 'fs';
import {
    add,
    addList,
    color,
    colorHex,
    filterColor,
    filterScalar,
    filterScalarAndStretch,
    getB,
    getG,
    getR,
    gradientLinear,
    mult,
    onlyB,
    onlyG,
    onlyR,
    POS,
    RGB,
    safeColor,
    scalar,
    sub,
    xorColor,
} from './lib';

const filesConfs: {
    [key: string]: (undefined | {
        [outFile: string]: ((rgba: RGB, pos: POS) => RGB)
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

    '20230301_225057.jpg': {
        '20230303_162133.jpg'(c) {
            return addList(
                color(
                    0,
                    .2,
                    .15,
                ),
                mult(
                    scalar(filterScalarAndStretch(getB(c), .28, .39)),
                    color(
                        0,
                        .6,
                        0,
                    ),
                ),
                mult(
                    scalar(filterScalarAndStretch(getR(c), .1, .2)),
                    color(
                        .001,
                        .025,
                        .008,
                    ),
                ),
                mult(
                    scalar(filterScalarAndStretch(getG(c), .68, .7)),
                    color(
                        .6,
                        .8,
                        .01,
                    ),
                ),
            );
        },
    },

    '20231002_103537.jpg': {
        '20231002_103537_1.jpg'(c, p) {
            const lead = colorHex('#d09f00');
            const base = colorHex('#094837');
            const baseLeft = colorHex('#480937');
            const baseRight = colorHex('#093748');
            const baseLight = colorHex('#15a267');
            const saracinesche = colorHex('#8c4615');
            return addList(
                // Base
                mult(base, scalar(.10)),

                // Mattoni base
                mult(baseLeft, scalar(
                    (filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getB(c), .11, .81))
                    * .9 * gradientLinear(p.x, .5, 0)
                )),
                mult(baseRight, scalar(
                    (filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getB(c), .11, .81))
                    * .9 * gradientLinear(p.x, .5, 1)
                )),

                // Mattoni luce
                mult(baseLight, scalar(
                    (filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getG(c), .11, .81))
                    * .9 * gradientLinear(p.x, 0, .5))),
                mult(lead, scalar(
                    (filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getG(c), .11, .81))
                    * .9 * gradientLinear(p.x, 1, .5))),

                // Effetti su mattoni
                mult(lead, scalar(
                    (filterScalarAndStretch(getG(c), .5, .6)
                        - filterScalarAndStretch(getB(c), .5, .6))
                    * .9)),

                // Saracinesca
                p.y > .75
                    ? mult(saracinesche, scalar(filterScalarAndStretch(getG(c), .85, .95) * 2))
                    : false,

                // Finestre
                (p.y < .7 && p.x < .482)
                    ? mult(lead,
                        scalar(filterScalarAndStretch(getG(c), .85, .95) * .12))
                    : false,
                (p.y < .7 && p.x > .486)
                    ? mult(baseLight,
                        scalar(filterScalarAndStretch(getG(c), .85, .95) * .11))
                    : false,
            );
        },
        '20231002_103537_2.jpg'(c) {
            return addList(
                // Base
                mult(colorHex('#cc1a4d'), scalar(.02)),

                // Mattoni base
                mult(
                    scalar((
                        filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getB(c), .11, .81)
                    ) * .6),
                    colorHex('#00222f'),
                ),

                // Mattoni luce
                mult(
                    scalar((
                        filterScalarAndStretch(getR(c), .11, .81)
                        - filterScalarAndStretch(getG(c), .11, .81)
                    ) * .7),
                    colorHex('#001749'),
                ),

                // Effetti su mattoni
                mult(
                    scalar((
                        filterScalarAndStretch(getG(c), .5, .6)
                        - filterScalarAndStretch(getB(c), .5, .6)
                    ) * .7),
                    colorHex('#cc1a4d'),
                ),

                // Mensole
                mult(
                    scalar(filterScalarAndStretch(getG(c), .85, .95) * .23),
                    colorHex('#880c31'),
                ),
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
                        }, {
                            x: x / width,
                            y: y / height,
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
