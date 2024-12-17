import path from 'node:path'

import * as Repack from '@callstack/repack'
import { Configuration } from 'webpack'
import { customizeArray, mergeWithCustomize } from 'webpack-merge'

import { getSharedDependencies } from '../config/getSharedDependencies.js'
import getBaseConfig from './base.js'

export default (env: Repack.WebpackEnvOptions) => {
  const baseConfig = getBaseConfig(env)

  const { federatedModule, exports } = require(path.join(baseConfig.context, './package.json'))

  if (!federatedModule) {
    throw new Error(
      'Missing `name` in package.json. Please define unique name for your mini-app module.'
    )
  }

  if (!exports) {
    throw new Error(
      'Missing `exports` in package.json. Please define exports for your mini-app module.'
    )
  }

  /* Remove the 'index.js' from entry since we only need the federated entry point */
  const entry = baseConfig.entry.slice(0, -1)

  return mergeWithCustomize<Configuration>({
    customizeArray: customizeArray({ entry: 'replace' }),
  })(getBaseConfig(env), {
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
        shared: getSharedDependencies(false),
      }),
    ],
  })
}
