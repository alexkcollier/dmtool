const CACHE = 'dmtool-data'
const DATA_URL = new URL('https://dmtool-e98e4.firebaseio.com')
const dataTypes = ['bestiary', 'items', 'spells']

self.addEventListener('install', event => event.waitUntil(precache()))

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(DATA_URL)) {
    // respond from cache
    event.respondWith(fromCache(event.request))
    // update the cache
    event.waitUntil(updateCache(event.request).then(promptRefresh))
  }
})

async function precache () {
  const cache = await caches.open(CACHE)
  cache.addAll(
    dataTypes.map((type) => {
      const url = new URL(`${type}.json`, DATA_URL)
      const headers = new Headers({ 'X-Firebase-ETag': true })
      return new Request(url, { headers })
    })
  )
}

async function fromCache (request) {
  // get the cached response for a given request
  const cache = await caches.open(CACHE)
  const matching = await cache.match(request)
  // fall back to network if no match
  return matching || fetch(request)
}

async function updateCache (request) {
  const cache = await caches.open(CACHE)
  const response = await fetch(request)
  await cache.put(request, response.clone())
  // update the cache with response
  return response
}

async function promptRefresh (response) {
  const clients = await self.clients.matchAll()

  clients.forEach((client) => {
    const message = {
      type: 'refresh',
      url: response.url,
      eTag: response.headers.get('ETag'),
    }

    client.postMessage(JSON.stringify(message))
  })
}
