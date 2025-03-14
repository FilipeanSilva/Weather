import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:5103/api/weather';

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/city?city=${city}`);
  }
}
