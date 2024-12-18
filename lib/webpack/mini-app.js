"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Repack = __importStar(require("@callstack/repack"));
const webpack_merge_1 = require("webpack-merge");
const getSharedDependencies_js_1 = require("../config/getSharedDependencies.js");
const base_js_1 = __importDefault(require("./base.js"));
exports.default = (env) => {
    const baseConfig = (0, base_js_1.default)(env);
    const { federatedModule, exports } = require(node_path_1.default.join(baseConfig.context, './package.json'));
    if (!federatedModule) {
        throw new Error('Missing `name` in package.json. Please define unique name for your mini-app module.');
    }
    if (!exports) {
        throw new Error('Missing `exports` in package.json. Please define exports for your mini-app module.');
    }
    /* Remove the 'index.js' from entry since we only need the federated entry point */
    const entry = baseConfig.entry.slice(0, -1);
    return (0, webpack_merge_1.mergeWithCustomize)({
        customizeArray: (0, webpack_merge_1.customizeArray)({ entry: 'replace' }),
    })((0, base_js_1.default)(env), {
        entry,
        plugins: [
            /**
             * This plugin is nessessary to make Module Federation work.
             */
            new Repack.plugins.ModuleFederationPlugin({
                /**
                 * The name of the module is used to identify the module in URLs resolver and imports.
                 */
                name: federatedModule,
                /**
                 * This is a list of modules that will be shared between remote containers.
                 */
                exposes: exports,
                /**
                 * Shared modules are shared in the share scope.
                 * React, React Native and React Navigation should be provided here because there should be only one instance of these modules.
                 * Their names are used to match requested modules in this compilation.
                 */
                shared: (0, getSharedDependencies_js_1.getSharedDependencies)(false),
            }),
        ],
    });
};
