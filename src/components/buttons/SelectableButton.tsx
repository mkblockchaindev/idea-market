import classNames from 'classnames'

export enum JOINED_TYPES {
  NONE, // Not joined
  L, // Joined on left
  R, // Joined on right
  T, // Joined on top
  B, // Joined on bottom
}

type Props = {
  isSelected: boolean
  onClick: (value: any) => void
  label: any
  className?: string
  joined?: JOINED_TYPES // Whether button is connected to another button on a side
}

const SelectableButton = ({
  isSelected,
  onClick,
  label,
  className,
  joined,
}: Props) => {
  const roundedStyle = () => {
    switch (joined) {
      case JOINED_TYPES.NONE:
        return ''
      case JOINED_TYPES.L:
        return 'rounded-r-md'
      case JOINED_TYPES.R:
        return 'rounded-l-md'
      case JOINED_TYPES.T:
        return 'rounded-b-md'
      case JOINED_TYPES.B:
        return 'rounded-t-md'

      default:
        return 'rounded-md' // Round all corners by default
    }
  }

  return (
    <button
      className={classNames(
        roundedStyle(),
        className,
        'flex justify-center items-center md:px-3 p-2 text-sm font-semibold',
        {
          'text-brand-blue dark:text-white bg-blue-100 border-2 border-blue-600 dark:bg-very-dark-blue':
            isSelected,
        },
        { 'text-brand-black dark:text-gray-50 border': !isSelected }
      )}
      onClick={() => {
        onClick(!isSelected)
      }}
    >
      <span>{label}</span>
    </button>
  )
}

export default SelectableButton
