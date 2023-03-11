import getConfig from '../core/config'

class ApiGateway {
  apiBaseUrl: string
  constructor () {
    this.apiBaseUrl = getConfig().apiBaseUrl
  }
}

export default ApiGateway
