import { Point } from './types';
import { subtract, divide, add, multiply, toUnitVector } from './Point';

// https://tauday.com/tau-manifesto
const TAU = Math.PI * 2;

/**
 * Most songs do not attempt to destroy the ears, so their frequencies will appear in the lower frequency ranges.
 * In order to make this visualisation a bit more pleasing, I've exaggerated the frequencies a bit.
 */
const EXAGGERATION = 10;

const calcAngleInRadians = (num: number, maximum: number) =>
    // To avoid confusion, I've added a "high pass" filter by using the min. This will prevent exagerrated values from
    // drawing over the lower frequency ranges.
    Math.min(num / maximum * EXAGGERATION * TAU, TAU);

/**
 * Assuming a minimum value of zero, given the maximum value, translate a given value into a point representing that
 * angle.
 */
export const getAnglePoint = (value: number, maximum: number): Point => {
    const angle = calcAngleInRadians(value, maximum);
    return {
        x: -Math.cos(angle),
        y: -Math.sin(angle)
    };
};

/**
 * Given two points and their origin, calculates a point between them. This creates nice curves between the points.
 */
export const getCurvedPointBetween = (point: Point, lastPoint: Point, origin: Point): Point => {
    const halfway = divide(subtract(lastPoint, point), 2);
    const pointBetween = add(halfway, point);
    return subtract(pointBetween, multiply(toUnitVector(subtract(pointBetween, origin)), 5));
};
