
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

export interface ClaimAnalysis {
  claimType: Claim['claimType'];
  riskScore: number;
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

  analyzeClaim(description: string): Observable<ClaimAnalysis> {
    return this.http.post<ClaimAnalysis>(`${this.apiUrl}/analyze`, { description });
  }

  createClaim(claim: {
    userId: string;
    claimType: 'Auto' | 'Home' | 'Health';
    amount: number;
    description: string;
  }): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, claim);
  }

  deleteClaim(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
  getClaimById(id: string): Observable<Claim> {
  return this.http.get<Claim>(`${this.apiUrl}/${id}`);
  }

  updateClaim(id: string, claim: {
   claimType: 'Auto' | 'Home' | 'Health';
   amount: number;
   description: string;
  }): Observable<Claim> {
   return this.http.put<Claim>(`${this.apiUrl}/${id}`, claim);
 }
}
