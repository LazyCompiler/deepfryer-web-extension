// This class is wrapping fetch requests since we can't simply preform HTTP requests from injected scripts
// Chrome allows us to launch those only from content_script.js or background.js

import { v4 as uuidv4 } from 'uuid'
import EVENTS from '../core/events'

export enum HttpMethod {
  GET = 'get',
  POST = 'post'
}

export interface FetchResponse<T = unknown> {
  succeeded: boolean
  data: T
}

export interface FetchRequest {
  requestData: {
    url: string
    config?: FetchRequestConfig
  }
  responseId: string
}

interface FetchRequestConfig {
  method: HttpMethod
  data?: unknown
}

export async function get<T = any, R = T> (url: string): Promise<R> {
  const config = {
    method: HttpMethod.GET
  }

  return await request<T, R>(url, config)
}

export async function post<T = unknown, R = T> (url: string, data?: any): Promise<R> {
  const config = {
    method: HttpMethod.POST,
    data
  }

  return await request<T, R>(url, config)
}

async function request<T = unknown, R = T> (
  url: string,
  config?: FetchRequestConfig
): Promise<R> {
  const responseId = uuidv4()

  return await new Promise<R>((resolve, reject): void => {
    // dispatch event as request
    const request: FetchRequest = {
      requestData: {
        url,
        config
      },
      responseId
    }

    document.dispatchEvent(
      new CustomEvent(EVENTS.Fetch.FromBackground, { detail: request })
    )

    // wait for response event
    const eventName = `${EVENTS.Fetch.ToBackground}_${responseId}`
    const callback = function (event: Event): void {
      const customEvent = event as CustomEvent

      document.removeEventListener(eventName, callback, false)

      const response: FetchResponse<R> = customEvent.detail

      if (response.succeeded) {
        resolve(response.data)
      } else {
        reject(response.data)
      }
    }
    document.addEventListener(eventName, callback)
  })
}
