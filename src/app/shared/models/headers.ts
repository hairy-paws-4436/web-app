import { HttpHeaders } from '@angular/common/http';

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

export function getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('access_token');
  let headers = new HttpHeaders();

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
