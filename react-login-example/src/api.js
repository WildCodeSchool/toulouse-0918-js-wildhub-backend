const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const fetchWrapper = (url, method, body) => fetch(url, {
  method, headers, body: body ? JSON.stringify(body) : undefined
})
  .then(response => {
    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
    return response.json();
  })

export const post = (url, data) => fetchWrapper(url, 'POST', data);
