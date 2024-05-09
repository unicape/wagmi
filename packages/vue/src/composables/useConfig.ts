import { type Config, type ResolvedRegister } from '@wagmi/core'
import { hasInjectionContext, inject } from 'vue'

import {
  WagmiInjectionContextError,
  WagmiPluginNotFoundError,
} from '../errors/plugin.js'
import { configKey } from '../plugin.js'
import type { ConfigParameter } from '../types/properties.js'
import type { DeepMaybeRef } from '../types/ref.js'
import { deepUnref } from '../utils/cloneDeep.js'

export type UseConfigParameters<config extends Config = Config> = DeepMaybeRef<
  ConfigParameter<config>
>

export type UseConfigReturnType<config extends Config = Config> = config

/** https://wagmi.sh/vue/api/hooks/useConfig */
export function useConfig<config extends Config = ResolvedRegister['config']>(
  parameters_: UseConfigParameters<config> = {},
): UseConfigReturnType<config> {
  const parameters = deepUnref(parameters_)

  // passthrough config if provided
  if (parameters.config) return parameters.config as UseConfigReturnType<config>

  // ensures that `inject()` can be used
  if (!hasInjectionContext()) throw new WagmiInjectionContextError()

  const config = inject<Config | undefined>(configKey)
  if (!config) throw new WagmiPluginNotFoundError()

  return config as UseConfigReturnType<config>
}
