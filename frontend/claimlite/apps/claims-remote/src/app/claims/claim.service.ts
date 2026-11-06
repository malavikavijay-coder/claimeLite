import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Claim {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  claimType: 'Auto' | 'Home' | 'Health';
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  private apiUrl = 'http://localhost:3000/api/claims';

  constructor(private http: HttpClient) {}

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl);
  }

  createClaim(claim: {
    userId: string;
    claimType: 'Auto' | 'Home' | 'Health';
    amount: number;
    description: string;
  }): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim);
  }
}