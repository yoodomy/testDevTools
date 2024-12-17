import * as Repack from '@callstack/repack'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'

import { getSharedDependencies } from '../config/getSharedDependencies.js'
import getBaseConfig from './base.js'

export default (env: Repack.WebpackEnvOptions) => {
  return merge<Configuration>(getBaseConfig(env), {
    plugins: [
      /**
       * This plugin is nessessary to make Module Federation work.
       */
      new Repack.plugins.ModuleFederationPlugin({
        /**
         * The name of the module is used to identify the module in URLs resolver and imports.
         */
        name: 'host',
        /**
         * Shared modules are shared in the share scope.
         * React, React Native and React Navigation should be provided here because there should be only one instance of these modules.
         * Their names are used to match requested modules in this compilation.
         */
        shared: getSharedDependencies(true),
      }),
    ],
  })
}
