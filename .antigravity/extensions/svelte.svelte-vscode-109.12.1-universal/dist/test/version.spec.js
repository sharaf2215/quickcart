"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const version_1 = require("../src/version");
(0, vitest_1.describe)('atLeast', () => {
    const combinationsAtLeast = [
        { min: '5', version: '>=5', supported: true },
        { min: '5', version: '>=5.0.0', supported: true },
        { min: '5', version: '5.0.0', supported: true },
        { min: '5', version: '5', supported: true },
        { min: '5', version: '4', supported: false },
        { min: '5', version: '4.9', supported: false },
        { min: '5', version: '', supported: undefined },
        { min: '5', version: 'catalog:', supported: undefined },
        { min: '5', version: 'latest', supported: undefined },
        { min: '5', version: 'latest', fallback: true, supported: true },
        { min: '5', version: 'latest', fallback: false, supported: false }
    ];
    vitest_1.it.each(combinationsAtLeast)('(min $min, $version, $fallback) => $supported', ({ min, version, supported, fallback }) => {
        if (fallback !== undefined) {
            (0, vitest_1.expect)((0, version_1.atLeast)({
                packageName: 'myPkg',
                versionMin: min,
                versionToCheck: version,
                fallback
            })).toEqual(supported);
        }
        else {
            (0, vitest_1.expect)((0, version_1.atLeast)({
                packageName: 'myPkg',
                versionMin: min,
                versionToCheck: version
            })).toEqual(supported);
        }
    });
});
//# sourceMappingURL=version.spec.js.map