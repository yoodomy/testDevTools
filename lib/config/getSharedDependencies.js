"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedDependencies = void 0;
/**
 * Collect shared dependencies from the SDK and expose them for the ModuleFederationPlugin.
 */
const getSharedDependencies = (eager) => {
    const { peerDependencies } = require('../../package.json');
    const shared = Object.entries(peerDependencies).map(([dep, version]) => {
        return [dep, { singleton: true, eager, requiredVersion: version }];
    });
    return Object.fromEntries(shared);
};
exports.getSharedDependencies = getSharedDependencies;
