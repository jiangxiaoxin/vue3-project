function asc<T extends number[]>(arr: T): T {
  arr.sort(function (a, b) {
    return a - b
  })
  return arr
}

function quantile(ascArr: number[], p: number): number {
  const H = (ascArr.length - 1) * p + 1
  const h = Math.floor(H)
  const v = +ascArr[h - 1]
  const e = H - h
  return e ? v + e * (ascArr[h] - v) : v
}
/**
 * See:
 *  <https://en.wikipedia.org/wiki/Box_plot#cite_note-frigge_hoaglin_iglewicz-2>
 *  <http://stat.ethz.ch/R-manual/R-devel/library/grDevices/html/boxplot.stats.html>
 *
 * Helper method for preparing data.
 *
 * @param {Array.<number>} rawData like
 *        [
 *            [12,232,443], (raw data set for the first box)
 *            [3843,5545,1232], (raw data set for the second box)
 *            ...
 *        ]
 * @param {Object} [opt]
 *
 * @param {(number|string)} [opt.boundIQR=1.5] Data less than min bound is outlier.
 *      default 1.5, means Q1 - 1.5 * (Q3 - Q1).
 *      If 'none'/0 passed, min bound will not be used.
 * @param {(number|string)} [opt.layout='horizontal']
 *      Box plot layout, can be 'horizontal' or 'vertical'
 * @return {Object} {
 *      boxData: Array.<Array.<number>>
 *      outliers: Array.<Array.<number>>
 *      axisData: Array.<string>
 * }
 */
export default function (
  rawData: number[][],
  opt: {
    boundIQR?: number | 'none'
    layout?: 'horizontal' | 'vertical'
  }
): {
  boxData: number[][]
  outliers: number[][]
  axisData: string[]
} {
  opt = opt || {}
  const boxData = []
  const outliers = []
  const axisData: string[] = []
  const boundIQR = opt.boundIQR
  const useExtreme = boundIQR === 'none' || boundIQR === 0

  for (let i = 0; i < rawData.length; i++) {
    axisData.push(i + '')
    const ascList = asc(rawData[i].slice())

    const Q1 = quantile(ascList, 0.25)
    const Q2 = quantile(ascList, 0.5)
    const Q3 = quantile(ascList, 0.75)
    const min = ascList[0]
    const max = ascList[ascList.length - 1]

    const bound = (boundIQR == null ? 1.5 : (boundIQR as number)) * (Q3 - Q1)

    const low = useExtreme ? min : Math.max(min, Q1 - bound)
    const high = useExtreme ? max : Math.min(max, Q3 + bound)

    boxData.push([low, Q1, Q2, Q3, high])

    for (let j = 0; j < ascList.length; j++) {
      const dataItem = ascList[j]
      if (dataItem < low || dataItem > high) {
        const outlier = [i, dataItem]
        opt.layout === 'vertical' && outlier.reverse()
        outliers.push(outlier)
      }
    }
  }
  return {
    boxData: boxData,
    outliers: outliers,
    axisData: axisData
  }
}

/**
 * 在 ECharts 中，boundIQR 是一个与箱线图（Boxplot）相关的参数，用于确定数据的上下限（即异常值的界定）。具体来说，boundIQR 是用来计算箱线图的上边界（UpperLimit）和下边界（LowerLimit）的参数，它基于四分位数和四分位间距（InterQuartile Range，IQR）来确定。

四分位间距（IQR）是上四分位数（Q3，即75%分位数）与下四分位数（Q1，即25%分位数）之间的差值。boundIQR 参数用于定义如何基于 IQR 来计算异常值的界限。通常情况下，如果数据点落在 Q1 - 1.5 * IQR 或 Q3 + 1.5 * IQR 之外，这些数据点会被认为是异常值（outliers）
。

在 ECharts 的 dataTool.prepareBoxplotData 方法中，boundIQR 参数可以被设置为一个数值，用来调整计算上下限的系数。例如，如果 boundIQR 设置为 1.5，那么上下限的计算公式将是：

UpperLimit = Q3 + 1.5 * IQR
LowerLimit = Q1 - 1.5 * IQR
如果 boundIQR 设置为 none，则不进行任何调整，直接使用数据的最大值和最小值作为上下限
。这个参数可以根据具体的数据分布和业务需求进行调整，以便更准确地识别异常值。
 */
