import { Dim } from './types';
import { rgb, RGBColor } from 'd3-color';
import { Point, add as addPoint, multiply, divide, subtract, add, toUnitVector } from './Point';

const maxVal = 255;

// https://tauday.com/tau-manifesto
const TAU = Math.PI * 2;

export const drawFrame = (dim: Dim, frequencyData: Uint8Array, context: CanvasRenderingContext2D) => {
    const { width, height } = dim;
    const origin: Point = {
        x: width / 2,
        y: height / 2
    };

    context.clearRect(0, 0, 1280, 920);
    context.fillStyle = getColor(frequencyData).toString();
    context.beginPath();
    context.moveTo(origin.x, origin.y);

    let lastPoint: Point = origin;
    frequencyData
        // The first few points makes a flat line and that is boring
        .slice(3)
        .forEach((value, i) => {
            const anglePoint = getAnglePoint(i, frequencyData.length);
            const point = addPoint(multiply(anglePoint, calcAmplitude(value, frequencyData.length, dim)), origin);
            const pointBetween = getCurvedPointBetween(point, lastPoint, origin);
            context.quadraticCurveTo(pointBetween.x, pointBetween.y, point.x, point.y);

            lastPoint = point;
        });

    context.closePath();
    context.fill();
};

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
const getAnglePoint = (value: number, maximum: number): Point => {
    const angle = calcAngleInRadians(value, maximum);
    return {
        x: -Math.cos(angle),
        y: -Math.sin(angle)
    };
};

/**
 * Given two points and their origin, calculates a point between them. This creates nice curves between the points.
 */
const getCurvedPointBetween = (point: Point, lastPoint: Point, origin: Point): Point => {
    const halfway = divide(subtract(lastPoint, point), 2);
    const pointBetween = add(halfway, point);
    return subtract(pointBetween, multiply(toUnitVector(subtract(pointBetween, origin)), 5));
};

/**
 * Converts all frequency data into a representative color.
 */
const getColor = (frequencyData: Uint8Array): RGBColor => {
    const brightness = Math.min(calcMean(frequencyData) * 30, 255);
    return rgb(brightness, brightness, brightness);
};

/**
 * Converts the amplitude of a frequency into a multiplier for the pixel distance.
 */
const calcAmplitude = (value: number, maximum: number, { width }: Dim) =>
    value / maxVal * width / 2;

const calcMean = (numbers: Uint8Array) =>
    numbers.reduce((a, b) => a + b, 0) / numbers.length;
