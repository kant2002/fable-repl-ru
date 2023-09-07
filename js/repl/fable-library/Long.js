import { isValid } from "./Int32.js";
import * as LongLib from "./lib/long.js";
export default LongLib.Long;
export const get_Zero = LongLib.ZERO;
export const get_One = LongLib.ONE;
export const op_Addition = LongLib.add;
export const op_Subtraction = LongLib.subtract;
export const op_Multiply = LongLib.multiply;
export const op_Division = LongLib.divide;
export const op_Modulus = LongLib.modulo;
export const op_UnaryNegation = LongLib.negate;
export function op_UnaryPlus(x) { return x; }
export const op_LeftShift = LongLib.shiftLeft;
export const op_RightShift = LongLib.shiftRight;
export const op_RightShiftUnsigned = LongLib.shiftRightUnsigned;
export const op_BitwiseAnd = LongLib.and;
export const op_BitwiseOr = LongLib.or;
export const op_ExclusiveOr = LongLib.xor;
export const op_LogicalNot = LongLib.not;
export const op_LessThan = LongLib.lessThan;
export const op_LessThanOrEqual = LongLib.lessThanOrEqual;
export const op_GreaterThan = LongLib.greaterThan;
export const op_GreaterThanOrEqual = LongLib.greaterThanOrEqual;
export const op_Equality = LongLib.equals;
export const op_Inequality = LongLib.notEquals;
export const equals = LongLib.equals;
export const compare = LongLib.compare;
export const fromInt = LongLib.fromInt;
export const fromBits = LongLib.fromBits;
export const fromBytes = LongLib.fromBytes;
export const fromNumber = LongLib.fromNumber;
export const fromString = LongLib.fromString;
export const fromValue = LongLib.fromValue;
export const toInt = LongLib.toInt;
export const toBytes = LongLib.toBytes;
export const toNumber = LongLib.toNumber;
export const toString = LongLib.toString;
export const getLowBits = LongLib.getLowBits;
export const getHighBits = LongLib.getHighBits;
export const getLowBitsUnsigned = LongLib.getLowBitsUnsigned;
export const getHighBitsUnsigned = LongLib.getHighBitsUnsigned;
function getMaxValue(unsigned, radix, isNegative) {
    switch (radix) {
        case 2: return unsigned ?
            "1111111111111111111111111111111111111111111111111111111111111111" :
            (isNegative ? "1000000000000000000000000000000000000000000000000000000000000000"
                : "111111111111111111111111111111111111111111111111111111111111111");
        case 8: return unsigned ?
            "1777777777777777777777" :
            (isNegative ? "1000000000000000000000" : "777777777777777777777");
        case 10: return unsigned ?
            "18446744073709551615" :
            (isNegative ? "9223372036854775808" : "9223372036854775807");
        case 16: return unsigned ?
            "FFFFFFFFFFFFFFFF" :
            (isNegative ? "8000000000000000" : "7FFFFFFFFFFFFFFF");
        default: throw new Error("Invalid radix.");
    }
}
export function abs(x) {
    if (!x.unsigned && LongLib.isNegative(x)) {
        return op_UnaryNegation(x);
    }
    else {
        return x;
    }
}
export function fromInteger(value, unsigned, kind) {
    let x = value;
    let xh = 0;
    switch (kind) {
        case 0:
            x = value << 24 >> 24;
            xh = x;
            break;
        case 4:
            x = value << 24 >>> 24;
            break;
        case 1:
            x = value << 16 >> 16;
            xh = x;
            break;
        case 5:
            x = value << 16 >>> 16;
            break;
        case 2:
            x = value >> 0;
            xh = x;
            break;
        case 6:
            x = value >>> 0;
            break;
    }
    return LongLib.fromBits(x, xh >> 31, unsigned);
}
export function parse(str, style, unsigned, _bitsize, radix) {
    const res = isValid(str, style, radix);
    if (res != null) {
        const lessOrEqual = (x, y) => {
            const len = Math.max(x.length, y.length);
            return x.padStart(len, "0") <= y.padStart(len, "0");
        };
        const isNegative = res.sign === "-";
        const maxValue = getMaxValue(unsigned || res.radix !== 10, res.radix, isNegative);
        if (lessOrEqual(res.digits.toUpperCase(), maxValue)) {
            str = isNegative ? res.sign + res.digits : res.digits;
            return LongLib.fromString(str, unsigned, res.radix);
        }
    }
    throw new Error("Input string was not in a correct format.");
}
export function tryParse(str, style, unsigned, bitsize, defValue) {
    try {
        defValue.contents = parse(str, style, unsigned, bitsize);
        return true;
    }
    catch (_a) {
        return false;
    }
}
export function unixEpochMillisecondsToTicks(ms, offset) {
    return op_Multiply(op_Addition(op_Addition(LongLib.fromNumber(ms), 62135596800000), offset), 10000);
}
export function ticksToUnixEpochMilliseconds(ticks) {
    return LongLib.toNumber(op_Subtraction(op_Division(ticks, 10000), 62135596800000));
}
export function divRem(x, y, out) {
    const div = op_Division(x, y);
    const rem = op_Modulus(x, y);
    if (out === void 0) {
        return [div, rem];
    }
    else {
        out.contents = rem;
        return div;
    }
}
