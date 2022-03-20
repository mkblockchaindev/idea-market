import Tooltip from 'components/tooltip/Tooltip'

const PnlTitleWithTooltip = () => (
  <div className="flex">
    PNL
    <Tooltip className="ml-2">
      <div className="w-32 md:w-64">
        PnL stands for Profit and Loss. PnL shows the difference between the
        value of your holdings at the time of purchase, and their current value.
      </div>
    </Tooltip>
  </div>
)

export default PnlTitleWithTooltip
