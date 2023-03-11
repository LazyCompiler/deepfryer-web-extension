import { registerFetchMessageHandlerBackground } from './api/messages-handler'
import { EXTENSION_LOADED_VAR_NAME } from './core/global-variables'

// Allow transfering of HTTP requests to server and back to client
registerFetchMessageHandlerBackground()

// Check if need and inject the script
const injectableHostnames = ['halilit.com']

// On new tab open
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('onUpdated', tabId, changeInfo, tab)
  if (changeInfo.status === 'complete' && tab.url !== undefined) {
    const isInjectableUrl = injectableHostnames.includes(
      new URL(tab.url).hostname.replace('www.', '')
    )
    if (isInjectableUrl) {
      isScriptInjected(tabId)
        .then((isInjected) => {
          if (!isInjected) {
            chrome.scripting
              .executeScript({
                target: { tabId },
                files: ['js/injected_script.js'],
                injectImmediately: true
              })
              .then(() => {
                console.log('injected')
              })
              .catch((error) => {
                console.error(error)
              })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
})

async function isScriptInjected (tabId: number): Promise<boolean> {
  const response = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => typeof window[EXTENSION_LOADED_VAR_NAME] !== 'undefined'
  })
  return response[0].result
}
