import {HttpHeaders} from '@angular/common/http';

export function returnHeaders() {
  const token = localStorage.getItem('access_token');
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}
