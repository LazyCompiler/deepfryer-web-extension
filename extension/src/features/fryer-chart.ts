import getConfig from "../core/config"

class FryerChart {
  tryInsertingChartIframe (detectedElement: HTMLElement, itemId: string): void {
    const iframeContainer = document.createElement('div')
    iframeContainer.style.minWidth = '935px'
    iframeContainer.style.maxWidth = '1589px'
    iframeContainer.style.display = 'flex'
    iframeContainer.style.height = '340px'
    iframeContainer.style.border = '0px none'
    iframeContainer.style.margin = '10px 0px 0px'

    detectedElement?.parentNode?.insertBefore(
      iframeContainer,
      detectedElement.nextSibling
    )

    this.appendChartIframe(iframeContainer, itemId)
  }

  appendChartIframe (element: HTMLElement, itemId: string): void {
    const hostname = window.location.hostname.replace('www.', '')

    const iframe = document.createElement('iframe')
    iframe.src = `${getConfig().baseUrl}/extension/${hostname}/items/${itemId}`
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = 'none'

    // Make sure the iframe is apended already
    if (element.querySelector('iframe') != null) {
      console.log('iframe already exists')
      return
    }

    element.appendChild(iframe)
  }
}

export default FryerChart
