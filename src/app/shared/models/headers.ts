import {HttpHeaders} from '@angular/common/http';

export function returnHeaders() {
  const token = localStorage.getItem('toke');
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}
