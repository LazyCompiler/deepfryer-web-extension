import FryerChart from './features/fryer-chart'
import DomListener from './injected-site/dom-listener'

export default function main (apiToken: string): void {
  console.log('DeepFryer Extension Loaded')

  // Features
  const chartFeature = new FryerChart()

  // DOM elements observer
  // TODO - move the selector and the regex pattern to the server
  const domObserver = new DomListener([
    {
      selector: '#item_main',
      callback: (detectedElement) => {
        // Detect item ID from URL by Regex pattern
        // https://www.website.com/items/123456789-product-name
        const pattern = /https:\/\/www.halilit.com\/items\/(\d+)-/
        const match = window.location.href.match(pattern)
        if (match != null) {
          const itemId = match[1]
          chartFeature.tryInsertingChartIframe(detectedElement, itemId, apiToken)
        }
      }
    }
  ])
  domObserver.start()
}