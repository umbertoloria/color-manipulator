import jimp from 'jimp';

type RGB = {
    r: number;
    g: number;
    b: number;
}

type Filter = (c: RGB) => RGB
const safeColor = (color: number) => filterScalar(color, 0, 255);

const wrap = (filter: Filter, c: RGB) => copy(filter(copy(c)));
const copy = (c: RGB): RGB => ({
    r: c.r,
    g: c.g,
    b: c.b,
});
const filterScalar = (scalar: number, min: number, max: number) => (
    scalar < min
        ? min
        : (
            scalar > max
                ? max
                : scalar
        )
);
const getInterval = (c: RGB, min: number, max: number): RGB => ({
    r: filterScalar(c.r, min, max),
    g: filterScalar(c.g, min, max),
    b: filterScalar(c.b, min, max),
});
const zero = (): RGB => ({
    r: 0,
    g: 0,
    b: 0,
});
const one = () => scalar(1);
const add = (a: RGB, b: RGB): RGB => ({
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
});
const negate = (c: RGB): RGB => ({
    r: -c.r,
    g: -c.g,
    b: -c.b,
});
const sub = (a: RGB, b: RGB) => add(a, negate(b));
const mult = (a: RGB, b: RGB): RGB => ({
    r: a.r * b.r,
    g: a.g * b.g,
    b: a.b * b.b,
});
const scalar = (scalar: number): RGB => ({
    r: scalar,
    g: scalar,
    b: scalar,
});
const onlyRed = (r: number): RGB => ({
    r,
    g: 0,
    b: 0,
});
const onlyGreen = (g: number): RGB => ({
    r: 0,
    g,
    b: 0,
});
const onlyBlue = (b: number): RGB => ({
    r: 0,
    g: 0,
    b,
});
const getR = (c: RGB) => c.r;
const getG = (c: RGB) => c.g;
const getB = (c: RGB) => c.b;

const addList = (...cList: RGB[]): RGB => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (const c of cList) {
        r += c.r;
        g += c.g;
        b += c.b;
    }
    return {
        r,
        g,
        b,
    };
};

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
    const image = await jimp.read('./source.jpg');
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
