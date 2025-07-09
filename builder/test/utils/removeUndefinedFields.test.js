import assert from "node:assert/strict"
import removeUndefinedFields from "../../../common/removeUndefinedFields.js";
import { checkType } from "../util.js"

describe("removeUndefinedFields", () => {
    it("should be a function", () => {
        assert.ok(checkType(removeUndefinedFields, Function))
    })

    it("should remove undefined fields from an object", () => {
        const obj = { a: 1, b: undefined, c: "hello", d: undefined };
        const expected = { a: 1, c: "hello" };
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });

    it("should return an object with the same properties if no fields are undefined", () => {
        const obj = { a: 1, b: "world", c: true };
        const expected = { a: 1, b: "world", c: true };
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });

    it("should return an empty object if all fields are undefined", () => {
        const obj = { a: undefined, b: undefined };
        const expected = {};
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });

    it("should return an empty object for an empty input object", () => {
        const obj = {};
        const expected = {};
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });

    it("should not remove null, 0, false, or empty string fields", () => {
        const obj = { a: null, b: 0, c: false, d: "", e: NaN };
        const expected = { a: null, b: 0, c: false, d: "", e: NaN };
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });

    it("should not include properties from the prototype chain", () => {
        const proto = { inherited: "should not be included" };
        const obj = Object.create(proto);
        obj.a = 1;
        obj.b = undefined;
        const expected = { a: 1 };
        assert.deepEqual(removeUndefinedFields(obj), expected);
    });
});