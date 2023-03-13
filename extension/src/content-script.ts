import { registerFetchMessageHandlerContentScript } from './api/messages-handler'
import main from './main'

registerFetchMessageHandlerContentScript()

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

// TODO - move to the server side
const allowedHostnames = ['halilit.com']

// Get the API token from storage
chrome.storage.local.get('apiToken', function (result) {
  const apiToken: string | undefined = result.apiToken

  if (apiToken && allowedHostnames.includes(window.location.hostname.replace('www.', ''))) {
    main(apiToken)
  }
})
