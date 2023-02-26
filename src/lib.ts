type Filter = (c: RGB) => RGB
export type RGB = {
    r: number;
    g: number;
    b: number;
}

export const safeColor = (color: number) => filterScalar(color, 0, 255);
export const wrap = (filter: Filter, c: RGB) => copy(filter(copy(c)));
export const copy = (c: RGB): RGB => ({
    r: c.r,
    g: c.g,
    b: c.b,
});
export const filterScalar = (scalar: number, min: number, max: number) => (
    scalar < min
        ? min
        : (
            scalar > max
                ? max
                : scalar
        )
);
export const getInterval = (c: RGB, min: number, max: number): RGB => ({
    r: filterScalar(c.r, min, max),
    g: filterScalar(c.g, min, max),
    b: filterScalar(c.b, min, max),
});
export const zero = (): RGB => ({
    r: 0,
    g: 0,
    b: 0,
});
export const one = () => scalar(1);
export const add = (a: RGB, b: RGB): RGB => ({
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
});
export const negate = (c: RGB): RGB => ({
    r: -c.r,
    g: -c.g,
    b: -c.b,
});
export const sub = (a: RGB, b: RGB) => add(a, negate(b));
export const mult = (a: RGB, b: RGB): RGB => ({
    r: a.r * b.r,
    g: a.g * b.g,
    b: a.b * b.b,
});
export const scalar = (scalar: number): RGB => ({
    r: scalar,
    g: scalar,
    b: scalar,
});
export const onlyRed = (r: number): RGB => ({
    r,
    g: 0,
    b: 0,
});
export const onlyGreen = (g: number): RGB => ({
    r: 0,
    g,
    b: 0,
});
export const onlyBlue = (b: number): RGB => ({
    r: 0,
    g: 0,
    b,
});
export const getR = (c: RGB) => c.r;
export const getG = (c: RGB) => c.g;
export const getB = (c: RGB) => c.b;
export const addList = (...cList: RGB[]): RGB => {
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
