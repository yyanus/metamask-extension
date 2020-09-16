import getProviderState from './get-provider-state'
import logWeb3Usage from './log-web3-usage'
import watchAsset from './watch-asset'

const handlers = [getProviderState, logWeb3Usage, watchAsset]
export default handlers
