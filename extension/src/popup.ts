const settingsButton = document.createElement('input')
settingsButton.value = 'Modify API Token'
settingsButton.type = 'button'

settingsButton.addEventListener('click', () => {
  chrome.runtime.openOptionsPage()
})

document.body.appendChild(settingsButton)