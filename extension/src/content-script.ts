import { registerFetchMessageHandlerContentScript } from './api/messages-handler'
import main from './main'

function contentScript() {
  // TODO - move to the server side
  const allowedHostnames = ['halilit.com']
  if (!allowedHostnames.includes(window.location.hostname.replace('www.', ''))) {
    return
  }

  registerFetchMessageHandlerContentScript()

  // Get the API token from storage
  chrome.storage.local.get('apiToken', function (result) {
    const apiToken: string | undefined = result.apiToken

    if (apiToken) {
      main(apiToken)
    }
  })
}

contentScript()
