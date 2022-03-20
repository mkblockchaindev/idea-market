import classNames from 'classnames'
import A from 'components/A'

export default function ChartDurationEntry({
  durationString,
  durationSeconds,
  selectedChartDuration,
  setSelectedChartDuration,
  setChartDurationSeconds,
}: {
  durationString: string
  durationSeconds: number
  selectedChartDuration: string
  setSelectedChartDuration: (d: string) => void
  setChartDurationSeconds: (s: number) => void
}) {
  return (
    <A
      onClick={() => {
        setSelectedChartDuration(durationString)
        setChartDurationSeconds(durationSeconds)
      }}
      className={classNames(
        'ml-1 mr-1 md:ml-2.5 md:mr-2.5 text-center px-1 text-sm leading-none tracking-tightest whitespace-nowrap border-b-2 focus:outline-none cursor-pointer',
        selectedChartDuration === durationString
          ? 'font-semibold text-brand-gray border-brand-new-blue focus:text-brand-gray-3 focus:border-brand-gray-2'
          : 'font-medium text-brand-gray-2 border-transparent'
      )}
    >
      {durationString}
    </A>
  )
}
