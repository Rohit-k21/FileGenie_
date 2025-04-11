import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8954'

  constructor(private http: HttpClient) { }

  sendMessage(collection: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/prompt_query`, {
      collection: collection,
      query: message,
    });
  }

  getCollections(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/collections`);
  }
}
