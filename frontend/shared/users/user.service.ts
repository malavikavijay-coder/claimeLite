import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: {
    fullName: string;
    email: string;
    phone: string;
  }): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  deleteUser(id: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/${id}`
  );
}
getUserById(id: string): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}

updateUser(id: string, user: {
  fullName: string;
  email: string;
  phone: string;
}): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${id}`, user);
}
}