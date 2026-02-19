/**
 * @example
 * const supported = atLeast({
 *     packageName: 'node',
 *     versionMin: '18.3',
 *     versionToCheck: process.versions.node
 *     fallback: true // optional
 * });
 */
export declare function atLeast(o: {
    packageName: string;
    versionMin: string;
    versionToCheck: string;
    fallback: boolean;
}): boolean;
export declare function atLeast(o: {
    packageName: string;
    versionMin: string;
    versionToCheck: string;
    fallback?: undefined;
}): boolean | undefined;
