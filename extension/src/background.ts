import { registerFetchMessageHandlerBackground } from './api/messages-handler'

// Allow transfering of HTTP requests to server and back to client
registerFetchMessageHandlerBackground()

chrome.runtime.onInstalled.addListener(() => {
  let apiToken = undefined
  chrome.storage.local.get('apiToken', function (retrieved_data) {
    console.log(retrieved_data)
    apiToken = retrieved_data.apiToken

    if (!apiToken) {
      chrome.runtime.openOptionsPage()
    }
  })
})
