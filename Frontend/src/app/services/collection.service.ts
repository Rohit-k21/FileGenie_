// src/app/services/collection.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private apiUrl = 'http://127.0.0.1:8954'; // Adjust based on your Flask server

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch collections for the logged-in user
  getCollections(): Observable<string[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ collections: string[] }>(`${this.apiUrl}/get_collection`, { headers }).pipe(
      map((response) => response.collections)
    );
  }

  // Set the current collection
  setCollection(collectionName: string): Observable<{ collection_name: string }> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post<{ collection_name: string }>(
      `${this.apiUrl}/set_collection`,
      { collection_name: collectionName },
      { headers }
    );
  }
}