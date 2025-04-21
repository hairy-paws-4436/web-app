export function returnHeaders() {
  const token = localStorage.getItem('access_token');
  let headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
