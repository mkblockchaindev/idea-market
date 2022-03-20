export type GoogleTrends = {
  date: string
  count: number
}

export type WikipediaSnapshot = {
  title: string
  type: SnapshotType
  url: string
}

export enum SnapshotType {
  WIKIPEDIA = 'wikipedia',
  LOCAL = 'local',
}

export type WikipediaPage = {
  id: string
  pageTitle: string
  snapshot: Partial<Snapshot>
  pageViews: PageViews
}

export type Snapshot = {
  fileName: string
  updateInProgress: boolean
  lastUpdated: Date
}

export type PageViews = {
  from: string
  to: string
  views: Views[]
  lastUpdated: Date
}

export type Views = {
  date: string
  count: number
}
