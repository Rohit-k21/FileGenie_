import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUrl = 'http://127.0.0.1:8954/pdf_upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ progress: number; response?: any }> {
    const formData = new FormData();
    formData.append('file', file);

    const id = localStorage.getItem("id")
    const token = localStorage.getItem("access_token")
    formData.append("id",id)
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

    return this.http
      .post(this.apiUrl, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            return { progress };
          } else if (event.type === HttpEventType.Response) {
            return { progress: 100, response: event.body };
          }
          return { progress: 0 };
        })
      );
  }
}