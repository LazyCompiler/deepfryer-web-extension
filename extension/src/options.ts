// Get the form
const form = document.querySelector('form') as HTMLFormElement

chrome.storage.local.get('apiToken', function (result) {
  const apiToken: string | undefined = result.apiToken

  const input = document.createElement('input')
  input.name = 'api'
  input.type = 'text'
  input.placeholder = 'API Token'

  if (apiToken) {
    input.value = apiToken
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const apiToken = formData.get('api')

    chrome.storage.local
      .set({ apiToken: apiToken })
      .then(() => {
        console.log('Saved')
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        window.close()
      })
  })

  const submit = document.createElement('input')
  submit.type = 'submit'
  submit.value = 'Save'

  form.appendChild(input)
  form.appendChild(submit)
})
