import React, { Component } from 'react'
import PropTypes from 'prop-types'

import NetworkForm from '../settings/networks-tab/network-form'

import Button from '../../components/ui/button'

import { ENVIRONMENT_TYPE_NOTIFICATION } from '../../../../app/scripts/lib/enums'
import { getEnvironmentType } from '../../../../app/scripts/lib/util'

export default class ConfirmAddEthereumChain extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    metricsEvent: PropTypes.func.isRequired,
  }

  static propTypes = {
    requestData: PropTypes.object.isRequired,
    requestId: PropTypes.string.isRequired,
    approveRequest: PropTypes.func.isRequired,
    rejectRequest: PropTypes.func.isRequired,
    clearConfirmTransaction: PropTypes.func.isRequired,
    // domainMetadata: PropTypes.object,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
  }

  componentDidMount = () => {
    if (
      getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_NOTIFICATION
    ) {
      window.addEventListener('beforeunload', this._beforeUnload)
    }
  }

  componentWillUnmount = () => {
    this._removeBeforeUnload()
  }

  _beforeUnload = async () => {
    const { clearConfirmTransaction, requestId, rejectRequest } = this.props
    // const { metricsEvent } = this.context

    await rejectRequest(requestId)
    // metricsEvent({
    //   eventOpts: {
    //     category: 'Messages',
    //     action: 'Decrypt Message Request',
    //     name: 'Cancel Via Notification Close',
    //   },
    // })
    clearConfirmTransaction()
  }

  _removeBeforeUnload = () => {
    if (
      getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_NOTIFICATION
    ) {
      window.removeEventListener('beforeunload', this._beforeUnload)
    }
  }

  renderHeader = () => {
    return (
      <div className="add-ethereum-chain__header">
        <div className="add-ethereum-chain__header-background" />

        <div className="add-ethereum-chain__header__text">
          Add Ethereum Chain
        </div>

        <div className="add-ethereum-chain__header__tip-container">
          <div className="add-ethereum-chain__header__tip" />
        </div>
      </div>
    )
  }

  renderBody = () => {
    const {
      requestData: {
        chainId,
        blockExplorerUrl,
        networkName,
        rpcUrl,
        ticker,
      } = {},
    } = this.props

    return (
      <NetworkForm
        viewOnly
        hideFooter
        chainId={chainId}
        blockExplorerUrl={blockExplorerUrl || ''}
        networkName={networkName}
        rpcUrl={rpcUrl}
        ticker={ticker}
        onClear={() => undefined}
      />
      // <div className="add-ethereum-chain__body">
      // </div>
    )
  }

  renderFooter = () => {
    const {
      requestData,
      requestId,
      approveRequest,
      rejectRequest,
      clearConfirmTransaction,
      history,
      mostRecentOverviewPage,
    } = this.props
    const { t } = this.context

    return (
      <div className="add-ethereum-chain__footer">
        <Button
          type="default"
          large
          className="add-ethereum-chain__footer__cancel-button"
          onClick={async () => {
            this._removeBeforeUnload()
            await rejectRequest(requestId)
            // metricsEvent({
            //   eventOpts: {
            //     category: 'Messages',
            //     action: 'Decrypt Message Request',
            //     name: 'Cancel',
            //   },
            // })
            clearConfirmTransaction()
            history.push(mostRecentOverviewPage)
          }}
        >
          {t('cancel')}
        </Button>
        <Button
          type="secondary"
          large
          className="add-ethereum-chain__footer__sign-button"
          onClick={async () => {
            this._removeBeforeUnload()
            await approveRequest(requestId, requestData)
            // metricsEvent({
            //   eventOpts: {
            //     category: 'Messages',
            //     action: 'Decrypt Message Request',
            //     name: 'Confirm',
            //   },
            // })
            clearConfirmTransaction()
            history.push(mostRecentOverviewPage)
          }}
        >
          {t('confirm')}
        </Button>
      </div>
    )
  }

  render = () => {
    return (
      <div className="add-ethereum-chain__container">
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    )
  }
}
