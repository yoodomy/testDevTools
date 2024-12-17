/**
 * Collect shared dependencies from the SDK and expose them for the ModuleFederationPlugin.
 */
export const getSharedDependencies = (eager: boolean) => {
  const { peerDependencies } = require('../../package.json')

  const shared = Object.entries(peerDependencies).map(([dep, version]) => {
    return [dep, { singleton: true, eager, requiredVersion: version }]
  })

  return Object.fromEntries(shared)
}
