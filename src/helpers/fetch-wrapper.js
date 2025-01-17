export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
  patch: request('PATCH')
}

function request(method) {
  return (url, body, { credentials } = {}) => {
    const requestOptions = {
      method: method,
      headers: { Accept: 'application/json' }
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    if (credentials) {
      requestOptions.credentials = credentials
    }
    return fetch(url, requestOptions).then(handleResponse)
  }
}

async function handleResponse(response) {
  const isJson = response.headers?.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  // check for error response
  if (!response.ok) {
    if ([401, 403].includes(response.status)) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      // handle error
      return
    }

    // get error message from body or default to response status
    const error = data ? (data.message ? data.message : JSON.stringify(data)) : response.status
    return Promise.reject(error)
  }

  return {
    data,
    status: response.status
  }
}
