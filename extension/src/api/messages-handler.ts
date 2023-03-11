// A messages handlers for the background script and the content script layers

import EVENTS from '../core/events'
import { type FetchRequest, type FetchResponse } from './fetch-wrapper'

const EVENT_NAME = 'df-fetch-messaging-background-request'

// Content Script
export function registerFetchMessageHandlerContentScript (): void {
  console.log('Fetch Wrapper / Listening to Fetch events')

  const listener = (event: Event): void => {
    const customEvent = event as CustomEvent
    const ajaxRequest = customEvent.detail as FetchRequest

    // launch response via event
    const eventName = `${EVENTS.Fetch.ToBackground}_${ajaxRequest.responseId}`

    if (!ajaxRequest.requestData.url.includes('/log')) {
      console.log(
        `Fetch Request ${eventName} (${new URL(ajaxRequest.requestData.url).pathname})`
      )
    }

    const messageConfig = {
      name: EVENT_NAME,
      message: ajaxRequest
    }
    try {
      chrome.runtime.sendMessage(messageConfig, (response: FetchResponse) => {
        document.dispatchEvent(
          new CustomEvent(eventName, {
            detail: JSON.parse(JSON.stringify(response))
          })
        )
      })
    } catch (error) {
      console.error('The extension has been upgraded. Please reload the page!', error)
    }
  }

  // wait for request
  document.addEventListener(EVENTS.Fetch.FromBackground, listener)
}

// Background
export function registerFetchMessageHandlerBackground (): void {
  console.log('Fetch Wrapper / Listening to Fetch events')

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.name === EVENT_NAME) {
      // perform an ajax request in the background script
      const ajaxRequest = request.message as FetchRequest

      fetch(ajaxRequest.requestData.url, {
        method: ajaxRequest.requestData.config?.method,
        mode: 'cors',
        body: JSON.stringify(ajaxRequest.requestData.config?.data)
      })
        .then(async (response) => {
          const responseText = await response.text()
          const parsedResponse = JSON.parse(responseText)

          const succeededResponse: FetchResponse<any> = {
            succeeded: true,
            data: parsedResponse
          }
          sendResponse(succeededResponse)
        })
        .catch((error) => {
          console.log(error)
          const failedResponse: FetchResponse<any> = {
            succeeded: false,
            data: {
              message: error
            }
          }

          sendResponse(failedResponse)
        })

      return true
    }

    return false
  })
}
