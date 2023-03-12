interface SelectorCallback {
  selector: string
  callback: (element: HTMLElement) => void
}

class DomListener {
  private observer?: MutationObserver
  callbacks: SelectorCallback[]

  constructor (callbacks: SelectorCallback[]) {
    this.onDomChange = this.onDomChange.bind(this)
    this.observer = undefined
    this.callbacks = callbacks
  }

  start (): void {
    // Check for existing elements on the DOM that match the selectors before starting the observer
    for (const callback of this.callbacks) {
      const elements = document.querySelectorAll(callback.selector)
      for (const element of elements) {
        callback.callback(element as HTMLElement)
      }
    }

    // Start the observer
    this.observer = new MutationObserver(this.onDomChange)
    this.observer.observe(document, {
      childList: true,
      subtree: true
    })

    console.log('DOM Listener Started')
  }

  stop (): void {
    this.observer?.disconnect()
  }

  private onDomChange (
    mutationRecords: MutationRecord[],
    observer: MutationObserver
  ): void {
    for (const mutation of mutationRecords) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            console.log('DOM Listener: Detected new element', node)
            for (const callback of this.callbacks) {
              const elements = node.querySelectorAll(callback.selector)
              for (const element of elements) {
                callback.callback(element as HTMLElement)
              }
            }
          }
        }
      }
    }
  }
}

export default DomListener
