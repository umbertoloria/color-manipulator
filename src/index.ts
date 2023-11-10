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

type SourceFileConf = {
    onStart?: (srcImage: Jimp.Jimp) => void;
    files: FinalFileConf[];
}
type FinalFileConf = {
    name: string;
    calculateColor: (rgba: RGB, pos: POS) => RGB;
}

const listSourceFileConf: Record<string, undefined | SourceFileConf> = {

    '20230226_201501.jpg': {
        files: [
            {
                name: '20230226_201501.jpg',
                calculateColor(c) {
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
        ],
    },

    '20230301_224920.jpg': {
        files: [
            {
                name: '20230301_224920_1.jpg',
                calculateColor(c) {
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
            },
            {
                name: '20230301_224920_2.jpg',
                calculateColor(c) {
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
        ],
    },

    '20230301_225057.jpg': {
        files: [
            {
                name: '20230303_162133.jpg',
                calculateColor(c) {
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
        ],
    },

    '20231002_103537.jpg': {
        onStart(srcImage) {
            const width = srcImage.getWidth();
            const height = srcImage.getHeight();

            // Backup image
            const bkpColorRows = [];
            let x, y;
            for (y = 0; y < height; ++y) {
                const bkpColorRow = [];
                for (x = 0; x < width; ++x) {
                    // @ts-ignore
                    const srcColorHex: number = srcImage.getPixelColor(x, y);
                    bkpColorRow.push(srcColorHex);
                }
                bkpColorRows.push(bkpColorRow);
            }

            // Image resize
            srcImage.resize(width, width);
            const toAddOnAbove = (width - height) / 2; // "width" is the new "height".
            // const toAddOnBelow = width - height - toAddOnAbove;

            // Known data:
            //   width=4624
            //   height=3468
            //   toAddOnAbove=578
            //   toAddOnBelow=578

            const defaultColor = jimp.rgbaToInt(
                0, 0, 0, // Black color for above and below sections
                255,
                () => {
                },
            );
            // Above section
            for (y = 0; y < toAddOnAbove; ++y) { // "width" is the new "height".
                for (x = 0; x < width; ++x) {
                    srcImage.setPixelColor(defaultColor, x, y);
                }
            }
            // Image section
            for (; y < toAddOnAbove + height; ++y) { // The old "height".
                for (x = 0; x < width; ++x) {
                    const oldY = y - toAddOnAbove;
                    const oldColor = bkpColorRows[oldY][x]
                    srcImage.setPixelColor(oldColor, x, y);
                }
            }
            // Below section
            for (; y < width; ++y) { // "width" is the new "height".
                for (x = 0; x < width; ++x) {
                    srcImage.setPixelColor(defaultColor, x, y);
                }
            }
        },
        files: [
            {
                name: '20231002_103537_0.jpg',
                calculateColor(c, p) {
                    // Known data:
                    //   width=4624
                    //   height=3468
                    //   toAddOnAbove=578
                    //   toAddOnBelow=578
                    const convertedY = p.y * 4624;
                    if (
                        convertedY < 578
                        || convertedY >= (578 + 3468)
                    ) {
                        return colorHex('#ac7360');
                    }
                    return c;
                },
            },
            {
                name: '20231002_103537_1.jpg',
                calculateColor(c, p) {
                    // Known data:
                    //   width=4624
                    //   height=3468
                    //   toAddOnAbove=578
                    //   toAddOnBelow=578
                    const convertedY = p.y * 4624;
                    if (
                        convertedY < 578
                        || convertedY >= (578 + 3468)
                    ) {
                        return colorHex('#4c6d26');
                    }
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
                        p.y > .68
                            ? mult(saracinesche, scalar(filterScalarAndStretch(getG(c), .85, .95) * 2))
                            : false,

                        // Finestre
                        (p.y < .65 && p.x < .482)
                            ? mult(lead,
                                scalar(filterScalarAndStretch(getG(c), .85, .95) * .12))
                            : false,
                        (p.y < .65 && p.x > .486)
                            ? mult(baseLight,
                                scalar(filterScalarAndStretch(getG(c), .85, .95) * .11))
                            : false,
                    );
                },
            },
            {
                name: '20231002_103537_2.jpg',
                calculateColor(c, p) {
                    // Known data:
                    //   width=4624
                    //   height=3468
                    //   toAddOnAbove=578
                    //   toAddOnBelow=578
                    const convertedY = p.y * 4624;
                    if (
                        convertedY < 578
                        || convertedY >= (578 + 3468)
                    ) {
                        return colorHex('#0e0d1f');
                    }
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
        ],
    },

};

(async () => {
    const files = fs.readdirSync('input');
    for (const file of files) {
        const sourceFileConf = listSourceFileConf[file];
        if (!!sourceFileConf) {

            // Read source image
            const inImagePath = `./input/${file}`;
            const srcImage = await jimp.read(inImagePath);
            if (sourceFileConf.onStart) {
                sourceFileConf.onStart(srcImage);
            }
            const width = srcImage.getWidth();
            const height = srcImage.getHeight();

            for (const finalFileConf of sourceFileConf.files) {

                // Create destination image
                // @ts-ignore
                const dest = new jimp(width, height);

                // Process colors
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {

                        // Read source color
                        // @ts-ignore
                        const srcColorHex: number = srcImage.getPixelColor(x, y);
                        const srcColorRgb = jimp.intToRGBA(srcColorHex);

                        // Calculate color
                        const inColor: RGB = {
                            r: srcColorRgb.r / 255.0,
                            g: srcColorRgb.g / 255.0,
                            b: srcColorRgb.b / 255.0,
                        };
                        const inPosition: POS = {
                            x: x / width,
                            y: y / height,
                        };
                        const outColor = finalFileConf.calculateColor(inColor, inPosition);

                        // Write destination color
                        const destColor = jimp.rgbaToInt(
                            safeColor(outColor.r * 255.0),
                            safeColor(outColor.g * 255.0),
                            safeColor(outColor.b * 255.0),
                            255,
                            () => {
                            },
                        );
                        dest.setPixelColor(destColor, x, y);

                    }
                }

                // Write final image
                const outImagePath = `out/${finalFileConf.name}`;
                await dest.writeAsync(outImagePath);

            }
        }
    }
})();
