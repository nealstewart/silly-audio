export type Point = Readonly<{
    x: number
    y: number
}>;

export const add = (a: Point, b: Point): Point =>
    ({x: a.x + b.x, y: a.y + b.y});

export const subtract = (a: Point, b: Point): Point =>
    ({x: a.x - b.x, y: a.y - b.y});

export const multiply = (a: Point, scalar: number): Point =>
    ({x: a.x * scalar, y: a.y * scalar});

export const divide = (a: Point, scalar: number): Point =>
    multiply(a, 1 / scalar);

export const toUnitVector = (a: Point): Point => {
    const largestVal =  Math.max(Math.abs(a.x), Math.abs(a.y));
    return {
        x: a.x / largestVal, y: a.y / largestVal
    };
};
