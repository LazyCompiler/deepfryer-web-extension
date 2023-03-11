import { EXTENSION_LOADED_VAR_NAME } from './core/global-variables'
import FryerChart from './features/fryer-chart'
import DomListener from './injected-site/dom-listener'

declare global {
  interface Window {
    [EXTENSION_LOADED_VAR_NAME]: boolean
  }
}

function main (): void {
  console.log('DeepFryer Extension Loaded')
  setInterval(() => {
    window[EXTENSION_LOADED_VAR_NAME] = true
  }, 1000)

  // Features
  const chartFeature = new FryerChart()

  // DOM elements observer
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
          chartFeature.tryInsertingChartIframe(detectedElement, itemId)
        }
      }
    }
  ])
  domObserver.start()
}

main()
