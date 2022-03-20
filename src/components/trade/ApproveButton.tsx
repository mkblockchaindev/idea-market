import { useEffect } from 'react'
import classNames from 'classnames'
import BN from 'bn.js'

import { useTokenAllowance, approveToken } from '../../actions'
import { TransactionManager, web3UintMax, zeroBN } from '../../utils'
import Tooltip from 'components/tooltip/Tooltip'

export default function ApproveButton({
  tokenAddress,
  tokenName,
  spenderAddress,
  requiredAllowance,
  unlockPermanent,
  txManager,
  disable,
  setIsMissingAllowance,
  txType,
}: {
  tokenAddress: string
  tokenName: string
  spenderAddress: string
  requiredAllowance: BN
  unlockPermanent: boolean
  disable?: boolean
  txManager: TransactionManager
  setIsMissingAllowance: (b: boolean) => void
  txType: string
}) {
  // allowance is the amount of user's tokens they allow our smart contract to interact with
  const [allowance] = useTokenAllowance(
    tokenAddress,
    spenderAddress,
    requiredAllowance
  )

  // isMissingAllowance says whether the user has enough allowance on the ERC20 token to perform the trade. If isMissingAllowance == true then the user needs to do an approve tx first
  const isMissingAllowance =
    !allowance ||
    allowance === undefined ||
    allowance.lte(zeroBN) ||
    allowance.lt(requiredAllowance)

  const getValuesByTxType = (txType: string) => {
    if (txType === 'stake') {
      return {
        buttonText: 'stake',
        buttonName: 'Stake',
        tooltipAction: 'staking',
      }
    }

    if (txType === 'lock') {
      return {
        buttonText: 'lock',
        buttonName: 'Lock',
        tooltipAction: 'locking',
      }
    }

    if (txType === 'spend') {
      return {
        buttonText: 'spend',
        buttonName: 'Buy/Sell',
        tooltipAction: 'spending',
      }
    }

    if (txType === 'unstake') {
      return {
        buttonText: 'withdraw',
        buttonName: 'Withdraw',
        tooltipAction: 'withdrawing',
      }
    }
  }

  const { buttonText, buttonName, tooltipAction } = getValuesByTxType(txType)

  useEffect(() => {
    setIsMissingAllowance(isMissingAllowance)
  }, [isMissingAllowance, setIsMissingAllowance])

  async function approve() {
    const allowanceAmount = unlockPermanent ? web3UintMax : requiredAllowance

    try {
      await txManager.executeTx(
        'Unlock',
        approveToken,
        tokenAddress,
        spenderAddress,
        allowanceAmount
      )
    } catch (ex) {
      console.log(ex)
      return
    }
  }

  return (
    <div
      className={classNames(
        'flex justify-center items-center py-4 px-4 text-lg font-bold rounded-2xl w-full font-sf-compact-medium text-center dark:border-gray-500',
        disable
          ? 'text-brand-gray-2 dark:text-gray-300 bg-brand-gray dark:bg-gray-500 cursor-default border-brand-gray'
          : 'border-brand-blue text-white bg-brand-blue font-medium hover:bg-blue-800 cursor-pointer'
      )}
      onClick={() => {
        !disable && approve()
      }}
    >
      <span>
        Allow Ideamarket to {buttonText} your {tokenName}
      </span>
      <Tooltip className="inline-block ml-2">
        <div className="w-32 md:w-64">
          The Ideamarket smart contract needs your approval to interact with
          your {tokenName} balance. After you grant permission, the {buttonName}{' '}
          button will be enabled. Select 'allow permanent' in Settings (⚙️) to
          permanently enable {tokenName} {tooltipAction} from this wallet.
        </div>
      </Tooltip>
    </div>
  )
}
