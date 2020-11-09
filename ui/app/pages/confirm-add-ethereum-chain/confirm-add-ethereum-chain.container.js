import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { ethErrors } from 'eth-json-rpc-errors'

import {
  goHome,
  resolvePendingApproval,
  rejectPendingApproval,
} from '../../store/actions'
import { clearConfirmTransaction } from '../../ducks/confirm-transaction/confirm-transaction.duck'
import { getMostRecentOverviewPage } from '../../ducks/history/history'
import ConfirmAddEthereumChain from './confirm-add-ethereum-chain.component'

const mapStateToProps = (state) => {
  const {
    confirmTransaction,
    // metamask: { domainMetadata = {} },
  } = state

  const { txData: { id: requestId, requestData } = {} } = confirmTransaction

  return {
    requestId,
    requestData,
    // domainMetadata,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goHome: () => dispatch(goHome()),
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    approveRequest: (id, chainRpcData) =>
      dispatch(resolvePendingApproval(id, chainRpcData)),
    rejectRequest: (id) =>
      dispatch(
        rejectPendingApproval(id, ethErrors.provider.userRejectedRequest()),
      ),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmAddEthereumChain)
