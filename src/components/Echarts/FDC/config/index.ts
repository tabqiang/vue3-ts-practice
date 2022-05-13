export const optionsGenerated = (data, markArea) => ({
  title: {
    text: 'EES Demo1',
    left: '1%'
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '5%',
    right: '15%',
    bottom: '10%'
  },
  xAxis: {
    data: data.map(function (item) {
      return item[0]
    })
  },
  yAxis: {},
  toolbox: {
    right: 10,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  dataZoom: [
    {
      startValue: '2014-06-01'
    },
    {
      type: 'inside'
    }
  ],
  series: {
    name: 'EES',
    type: 'line',
    data: data.map(function (item) {
      return item[1]
    }),
    markArea: {
      itemStyle: {
        color: ['red', 'yellow', 'green']
      },
      data: markArea
    }
  }
})

// type  yRange =number[]

export const xIndexToxAxis = (start: number, end: number, data: any): string[] => {
  return [data[start][0] as string, data[end][0] as string]
}

export const setMarkArea = ([start, end]: string[], yRange) => {
  console.log(yRange)
  const { LHL: y1, LSL: y2, LCL: y3, UCL: y4, USL: y5, UHL: y6 } = yRange
  return [
    [
      {
        yAxis: y1,
        xAxis: start,
        itemStyle: {
          color: 'red'
        }
      },
      {
        yAxis: y2,
        xAxis: end
      }
    ],
    [
      {
        itemStyle: {
          color: 'yellow'
        },
        yAxis: y2,
        xAxis: start
      },
      {
        yAxis: y3,
        xAxis: end
      }
    ],
    [
      {
        yAxis: y3,
        xAxis: start,
        itemStyle: {
          color: 'green'
        }
      },
      {
        yAxis: y4,
        xAxis: end
      }
    ],
    [
      {
        yAxis: y4,
        xAxis: start,
        itemStyle: {
          color: 'yellow'
        }
      },
      {
        yAxis: y5,
        xAxis: end
      }
    ],
    [
      {
        yAxis: y5,
        xAxis: start,
        itemStyle: {
          color: 'red'
        }
      },
      {
        yAxis: y6,
        xAxis: end
      }
    ]
  ]
}
