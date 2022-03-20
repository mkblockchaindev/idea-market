import { CheckboxFilters } from 'components/tokens/utils/OverviewUtils'
import defaultColumns from './defaultColumns'

export const getVisibleColumns = (selectedColumns: any) =>
  defaultColumns.filter((h) => !h.isOptional || selectedColumns.has(h.name))

export const startingOptionalColumns = defaultColumns
  .filter(
    (c) =>
      c.isSelectedAtStart && CheckboxFilters.COLUMNS.values.includes(c.name)
  )
  .map((c) => c.name)
