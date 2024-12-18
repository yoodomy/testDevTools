import * as Repack from '@callstack/repack';
import TerserPlugin from 'terser-webpack-plugin';
/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 */
export default function getBaseConfig(env: Repack.WebpackEnvOptions): {
    mode: "production" | "development";
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false;
    context: string;
    /**
     * `getInitializationEntries` will return necessary entries with setup and initialization code.
     * If you don't want to use Hot Module Replacement, set `hmr` option to `false`. By default,
     * HMR will be enabled in development mode.
     */
    entry: string[];
    resolve: {
        /**
         * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
         * dependency. You might need it when using workspaces/monorepos or unconventional project
         * structure. For simple/typical project you won't need it.
         */
        alias: {
            'react-native': string;
        };
        mainFields: string[];
        aliasFields: string[];
        conditionNames: string[];
        exportsFields: string[];
        extensions: string[];
    };
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
        clean: boolean;
        hashFunction: string;
        path: string;
        filename: string;
        chunkFilename: string;
        publicPath: string | undefined;
    };
    /**
     * Configures optimization of the built bundle.
     */
    optimization: {
        /** Enables minification based on values passed from React Native CLI or from fallback. */
        minimize: boolean;
        /** Configure minimizer to process the bundle. */
        minimizer: TerserPlugin<import("terser", { with: { "resolution-mode": "import" } }).MinifyOptions>[];
        chunkIds: "named";
    };
    module: {
        /**
         * This rule will process all React Native related dependencies with Babel.
         * If you have a 3rd-party dependency that you need to transpile, you can add it to the
         * `include` list.
         *
         * You can also enable persistent caching with `cacheDirectory` - please refer to:
         * https://github.com/babel/babel-loader#options
         */
        rules: ({
            test: RegExp;
            include: RegExp[];
            use: string;
            exclude?: undefined;
        } | {
            test: RegExp;
            exclude: RegExp;
            use: {
                loader: string;
                options: {
                    /** Add React Refresh transform only when HMR is enabled. */
                    plugins: string[] | undefined;
                    platform?: undefined;
                    devServerEnabled?: undefined;
                    /**
                     * Defines which assets are scalable - which assets can have
                     * scale suffixes: `@1x`, `@2x` and so on.
                     * By default all images are scalable.
                     */
                    scalableAssetExtensions?: undefined;
                };
            };
            include?: undefined;
        } | {
            test: RegExp;
            use: {
                loader: string;
                options: {
                    platform: string;
                    devServerEnabled: boolean;
                    /**
                     * Defines which assets are scalable - which assets can have
                     * scale suffixes: `@1x`, `@2x` and so on.
                     * By default all images are scalable.
                     */
                    scalableAssetExtensions: string[];
                    /** Add React Refresh transform only when HMR is enabled. */
                    plugins?: undefined;
                };
            };
            include?: undefined;
            exclude?: undefined;
        })[];
    };
    plugins: Repack.RepackPlugin[];
};
