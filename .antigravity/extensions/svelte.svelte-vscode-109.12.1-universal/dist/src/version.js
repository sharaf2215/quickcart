"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.atLeast = atLeast;
const semver_1 = require("semver");
// Implementation
function atLeast(o) {
    const { packageName, versionMin, versionToCheck, fallback } = o;
    if (versionToCheck === undefined || versionToCheck === '')
        return fallback;
    if (versionToCheck.includes('latest') ||
        versionToCheck.includes('catalog:') ||
        versionToCheck.includes('http')) {
        console.warn(`Version '${versionToCheck}' for '${packageName}' is not supported`);
        return fallback;
    }
    try {
        const vMin = (0, semver_1.coerce)(versionMin);
        const vToCheck = (0, semver_1.coerce)(versionToCheck);
        if (vMin && vToCheck) {
            return (0, semver_1.gte)(vToCheck, vMin);
        }
    }
    catch (error) { }
    return fallback;
}
//# sourceMappingURL=version.js.map