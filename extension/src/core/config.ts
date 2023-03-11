interface CommonConfig {
  readonly isDev: boolean
  readonly apiBaseUrl: string
  readonly baseUrl: string
}

class StagingConfig implements CommonConfig {
  public readonly isDev: boolean = true
  public readonly apiBaseUrl: string = 'http://localhost:3000'
  public readonly baseUrl: string = 'http://localhost:3000'
}

class ProductionConfig implements CommonConfig {
  public readonly isDev: boolean = false
  public readonly apiBaseUrl: string = 'https://api.fryer.co.il'
  public readonly baseUrl: string = 'https://fryer.co.il'
}

export default function getConfig (): CommonConfig {
  if (process.env.NODE_ENV === 'production') {
    return new ProductionConfig()
  } else {
    return new StagingConfig()
  }
}
