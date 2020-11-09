import { ethErrors } from 'eth-json-rpc-errors'
import validUrl from 'valid-url'
// import { NETWORK_TO_NAME_MAP as DEFAULT_NETWORK_MAP } from '../../../controllers/network/enums'
import { isPrefixedFormattedHexString } from '../../util'
import { MESSAGE_TYPE } from '../../enums'

const addEthereumChain = {
  methodName: MESSAGE_TYPE.ADD_ETHEREUM_CHAIN,
  implementation: addEthereumChainHandler,
}
export default addEthereumChain

async function addEthereumChainHandler(
  req,
  res,
  _next,
  end,
  { origin, addCustomRpc, customRpcExistsWith, requestUserApproval },
) {
  if (!req.params?.[0] || typeof req.params[0] !== 'object') {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected single, object parameter. Received:\n${req.params}`,
    })
    return end()
  }

  const {
    chainId,
    blockExplorerUrl = null,
    networkName,
    rpcUrl,
    ticker,
  } = req.params[0]

  if (!validUrl.isHttpsUri(rpcUrl)) {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected valid string HTTPS URL 'rpcUrl'. Received:\n${rpcUrl}`,
    })
    return end()
  }

  const _chainId = typeof chainId === 'string' && chainId.toLowerCase()
  if (!isPrefixedFormattedHexString(_chainId)) {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected 0x-prefixed, unpadded, non-zero hexadecimal string 'chainId'. Received:\n${chainId}`,
    })
    return end()
  }

  // if (DEFAULT_NETWORK_MAP[_chainId]) {
  //   res.error = ethErrors.rpc.invalidParams({
  //     message: `May not specify default MetaMask chain.`,
  //   })
  //   return end()
  // }

  if (!networkName && typeof networkName !== 'string') {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected non-empty string 'networkName'. Received:\n${networkName}`,
    })
  }
  const _networkName =
    networkName.length > 100 ? networkName.substring(0, 100) : networkName

  // TODO: how long should the ticker be?
  if (typeof ticker !== 'string' || ticker.length < 3 || ticker.length > 12) {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected 3-12 character string 'ticker'. Received:\n${ticker}`,
    })
    return end()
  }

  if (blockExplorerUrl !== null && !validUrl.isHttpsUri(blockExplorerUrl)) {
    res.error = ethErrors.rpc.invalidParams({
      message: `Expected null or valid string HTTPS URL 'blockExplorerUrl'. Received: ${blockExplorerUrl}`,
    })
    return end()
  }

  if (customRpcExistsWith({ rpcUrl, chainId: _chainId })) {
    res.error = ethErrors.rpc.internal({
      message: `Ethereum chain with the given RPC URL and chain ID already exists.`,
      data: { rpcUrl, chainId },
    })
    return end()
  }

  try {
    await addCustomRpc(
      await requestUserApproval({
        origin,
        type: MESSAGE_TYPE.ADD_ETHEREUM_CHAIN,
        requestData: {
          chainId: _chainId,
          blockExplorerUrl,
          networkName: _networkName,
          rpcUrl,
          ticker,
        },
      }),
    )
    res.result = true
  } catch (error) {
    res.error = error
  }
  return end()
}
