import { registerFetchMessageHandlerContentScript } from './api/messages-handler'
import main from './main'

registerFetchMessageHandlerContentScript()

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

// Get the API token from storage
chrome.storage.local.get('apiToken', function (result) {
  const apiToken: string | undefined = result.apiToken

  if (apiToken) {
    main(apiToken)
  } else {
    console.error('No API token found')
  }
})
