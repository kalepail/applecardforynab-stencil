import { fromPairs } from 'lodash-es'

export async function handleResponse(response) {
  const headers = fromPairs([...new Map(response.headers)])

  if (!response.ok)
    throw headers['content-type'] === 'application/json' ? await response.json() : await response.text()
  return headers['content-type'] === 'application/json' ? response.json() : response.text()
}

export function getQueryParams(search) {
  if (!search)
    return

  const hashes = search
    .slice(search.indexOf('?') + 1)
    .split('&')

  const params: any = {}

  hashes.map(hash => {
      const [key, val] = hash.split('=')
      params[key] = decodeURIComponent(val)
  })

  return params
}