import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const getSharedDependencies = (eager: boolean) => {
  try {
    // First try to read from the consuming project's package.json
    const { peerDependencies } = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    )
    const shared = Object.entries(peerDependencies).map(([dep, version]) => {
      return [dep, { singleton: true, eager, requiredVersion: version }]
    })
    return Object.fromEntries(shared)
  } catch (e) {
    // Fallback to our package's peerDependencies
    const { peerDependencies } = require('../../package.json')
    const shared = Object.entries(peerDependencies).map(([dep, version]) => {
      return [dep, { singleton: true, eager, requiredVersion: version }]
    })
    return Object.fromEntries(shared)
  }
}