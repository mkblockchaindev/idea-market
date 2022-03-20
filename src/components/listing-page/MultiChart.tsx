import { Chart } from 'chart.js'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'react-query'
import moment from 'moment'
import useBreakpoint from 'use-breakpoint'
import { BREAKPOINTS } from 'utils/constants'

export const bindChartEvents = (myChart: Chart, containerElement, setChart) => {
  const legendItemSelector = '.legend-item'
  const labelSeletor = '#legend-checkbox'

  const legendItems = [...containerElement.querySelectorAll(legendItemSelector)]
  legendItems.forEach((item, i) => {
    item.addEventListener('click', (e) => updateDataset(e.target.parentNode, i))
  })

  const updateDataset = (currentEl, index) => {
    const selectedMeta = myChart.getDatasetMeta(index) // Meta data for selected dataset
    const axis = myChart.options.scales.yAxes.find(
      (axis) => axis.id === selectedMeta.yAxisID
    )
    const otherAxis = myChart.options.scales.yAxes.find(
      (axis) => axis.id !== selectedMeta.yAxisID
    )
    const labelEl = currentEl.querySelector(labelSeletor)
    const isSelectedHidden = selectedMeta.hidden === true // Is selected dataset hidden before click?
    if (!isSelectedHidden) {
      selectedMeta.hidden = true
      labelEl.checked = false
      axis.display = false
      axis.gridLines.display = false
      otherAxis.gridLines.display = true
    } else {
      selectedMeta.hidden = false
      labelEl.checked = true
      axis.display = true
      axis.gridLines.display = true
      otherAxis.gridLines.display = false
    }
    myChart.update()
    setChart(myChart)
  }
}

type Props = {
  rawTokenName: string
}

const MultiChart = ({ rawTokenName }: Props) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'mobile')

  const [viewsData, setViewsData] = useState({
    counts: [],
    dates: [],
  })
  const [trendsData, setTrendsData] = useState({
    counts: [],
    dates: [],
  })
  const [fetchViews] = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch(`/api/markets/wikipedia/pageViews?title=${rawTokenName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  const [fetchTrends] = useMutation<{
    message: string
    data: any
  }>(() =>
    fetch(`/api/markets/wikipedia/googleTrends?keyword=${rawTokenName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json()
        throw new Error(response.message)
      }
      return res.json()
    })
  )

  useEffect(() => {
    fetchViews().then(({ data }) => {
      const dates = data.pageViews.map((item) =>
        moment.utc(item.date, 'YYYY-MM-DD').toString()
      )
      const counts = data.pageViews.map((item) => item.count)
      setViewsData({ dates, counts })
    })
    fetchTrends().then(({ data }) => {
      const dates = data.trends.map((item) =>
        moment.utc(item.date, 'YYYY-MM-DD').toString()
      )
      const counts = data.trends.map((item) => item.count)
      setTrendsData({ dates, counts })
    })
  }, [fetchViews, fetchTrends])

  const ref = useRef(null)
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (chart) {
      chart.destroy()
    }

    setChart(
      new Chart(ref.current.getContext('2d'), {
        data: {
          labels:
            trendsData && trendsData.dates.length > 0
              ? trendsData?.dates
              : viewsData?.dates,
          datasets: [
            {
              type: 'line',
              label: 'Page Views',
              order: 0,
              data: viewsData?.counts,
              pointRadius: 0, // Controls whether points are shown without hover
              hoverRadius: 5,
              fill: false,
              borderWidth: 3,
              lineTension: 0.25,
              yAxisID: 'left-y-axis',
              borderColor: '#4E63F1',
            },
            {
              type: 'line',
              label: 'Google Trends',
              order: 1,
              data: trendsData?.counts,
              pointRadius: 0,
              hoverRadius: 5,
              fill: false,
              borderWidth: 3,
              lineTension: 0.25,
              yAxisID: 'right-y-axis',
              borderColor: '#0CAE74',
            },
          ],
        },
        options: {
          hover: {
            intersect: false,
          },
          animation: {
            duration: 0,
          },
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                // type: 'time',
                display: true,
                ticks: {
                  display: true,
                  maxTicksLimit: 14,
                  maxRotation:
                    breakpoint === 'md' ||
                    breakpoint === 'sm' ||
                    breakpoint === 'mobile'
                      ? 50
                      : 0, // Stops ticks from rotating
                  callback: function (value: string, index, values) {
                    // Set custom tick value
                    if (value.includes('Jan')) {
                      // Include year for January tick
                      return `${moment(value).format('MMM YY')}`
                    }

                    return `${moment(value).format('MMM')}`
                  },
                },
                gridLines: { display: false, drawBorder: false },
              },
            ],
            yAxes: [
              {
                id: 'left-y-axis',
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 11,
                },
              },
              {
                id: 'right-y-axis',
                position: 'right',
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 11,
                  display:
                    trendsData && trendsData.dates.length > 0 ? true : false, // Only show if there is trends data
                },
                gridLines: {
                  display: false, // On load, don't show grid lines for right-y-axis because they are not aligned with left-y-axis
                },
              },
            ],
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 7,
              bottom: 0,
            },
          },
          legendCallback: (chart) => {
            const renderLabels = (chart) => {
              const { data } = chart
              return data.datasets
                .map(
                  (dataset, i) => `
                    <button
                      id="legend-${i}-item"
                      class="legend-item border rounded p-2 flex items-center space-x-2"
                    >
                      <input id="legend-checkbox" type="checkbox" checked={true} style="color: ${
                        dataset.borderColor
                      }" />
                      <span class="label" style="color: ${
                        dataset.borderColor
                      }">${dataset.label}${
                    dataset.data.length <= 0 ? ' [NO DATA]' : ''
                  }</span>
                    </button>
                  `
                )
                .join('')
            }
            return `
              <div class="chartjs-legend flex space-x-2">
                ${renderLabels(chart)}
              </div>
            `
          },
        },
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewsData, trendsData, breakpoint])

  useEffect(() => {
    if (chart) {
      // Need to do this to create custom legend HTML
      document.getElementById('chart-legends').innerHTML =
        chart.generateLegend()
      // Need to do this to update chart on custom legend events
      bindChartEvents(chart, document, setChart)
    }
  }, [chart])

  return (
    <div className="h-full py-5 px-2 md:p-5 bg-white border rounded-md dark:bg-gray-700 dark:border-gray-500 border-brand-border-gray">
      <div className="relative">
        <div
          id="chart-legends"
          className="flex justify-center md:block mb-6"
        ></div>
        <div
          style={{
            position: 'relative',
            height: '350px',
            width: '100%',
          }}
        >
          <canvas
            ref={ref}
            style={{ display: 'block', width: '100%' }}
          ></canvas>
        </div>
      </div>
    </div>
  )
}

export default MultiChart
