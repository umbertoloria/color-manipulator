export type RGB = {
    r: number;
    g: number;
    b: number;
}

export const safeColor = (color: number) => filterScalar(color, 0, 255);
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
export const filterColor = (c: RGB, min: number, max: number): RGB => ({
    r: filterScalar(c.r, min, max),
    g: filterScalar(c.g, min, max),
    b: filterScalar(c.b, min, max),
});
export const filterScalarAndStretch = (scalar: number, min: number, max: number) => (filterScalar(scalar, min, max) - min) * (1 / (max - min))
export const filterColorAndStretch = (c: RGB, min: number, max: number) => addList(
    onlyR(filterScalarAndStretch(getR(c), min, max)),
    onlyG(filterScalarAndStretch(getG(c), min, max)),
    onlyB(filterScalarAndStretch(getB(c), min, max)),
)

export const scalarCosineStretch = (scalar: number) => Math.cos((1 + scalar) * Math.PI / 2) ** 2;
// export const scalarQuadraticStretch = (scalar: number) => (scalar * 2 - 1) ** 2 * (scalar <= 0.5 ? -1 : +1);
export const scalarQuadraticStretch = (scalar: number, height: number) => baseQuadraticFn(scalar * 2 - 1, height);
const baseQuadraticFn = (x: number, height: number) => (x < 0 ? -1 : 1) * (((2 * x) ** (2 * height)) / 2);

export const zero = (): RGB => ({
    r: 0,
    g: 0,
    b: 0,
});
export const one = () => scalar(1);
export const color = (r: number, g: number, b: number): RGB => ({
    r,
    g,
    b,
});
export const colorHex = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error('Invalid HEX color');
    }
    const rHex = result[1];
    const gHex = result[2];
    const bHex = result[3];
    return {
        r: parseInt(rHex, 16) / 255,
        g: parseInt(gHex, 16) / 255,
        b: parseInt(bHex, 16) / 255,
    };
};
export const add = (a: RGB, b: RGB): RGB => ({
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
});
export const sub = (a: RGB, b: RGB) => add(a, {
    r: -b.r,
    g: -b.g,
    b: -b.b,
});
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
export const onlyR = (r: number): RGB => ({
    r,
    g: 0,
    b: 0,
});
export const onlyG = (g: number): RGB => ({
    r: 0,
    g,
    b: 0,
});
export const onlyB = (b: number): RGB => ({
    r: 0,
    g: 0,
    b,
});
export const getR = (c: RGB) => c.r;
export const getG = (c: RGB) => c.g;
export const getB = (c: RGB) => c.b;
export const addList = (...cList: (RGB | boolean)[]): RGB => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (const c of cList) {
        if (typeof c === 'object') {
            r += c.r;
            g += c.g;
            b += c.b;
        }
    }
    return {
        r,
        g,
        b,
    };
};

export const xorColor = (a: RGB, b: RGB) => color(
    Math.abs(a.r - b.r),
    Math.abs(a.g - b.g),
    Math.abs(a.b - b.b),
);

export const mean = (c: RGB): number => (c.r + c.g + c.b) / 3.0;

export const blend = (a: RGB, b: RGB, percentage: number) => add(
    mult(a, scalar(percentage)),
    mult(b, scalar(1 - percentage)),
);

// type Filter = (c: RGB) => RGB
// export const wrap = (filter: Filter, c: RGB) => copy(filter(copy(c)));


/// POSITION
export type POS = {
    x: number;
    y: number;
}

export const getCenter = (): POS => ({x: .5, y: .5}) as const;
export const getDistance = (a: POS, b: POS): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
export const getMaxRadiusInCube = (): number => Math.sqrt(.5);
export const gradientRadius = (a: POS, center: POS, maxDist: number): number => {
    const dist = getDistance(a, center);
    const distProp = dist / maxDist;
    if (distProp > 1) {
        return 0;
    }
    return 1 - distProp;
};

export const gradientLinear = (pos: number, from: number, to: number): number => {
    const distProp = (pos - from) / (to - from);
    if (distProp > 1) {
        return 1;
    }
    if (distProp < 0) {
        return 0;
    }
    return distProp;
};
