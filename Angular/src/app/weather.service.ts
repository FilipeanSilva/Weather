import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private backendApiUrl = 'http://localhost:5103/api/weather';
  private geocodingApiUrl = 'https://nominatim.openstreetmap.org/search';
  private weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';
  
  constructor(private http: HttpClient) {}
  
  getWeatherByCity(city: string): Observable<any> {
    // First try the backend API
    return this.http.get(`${this.backendApiUrl}/city?city=${city}`).pipe(
      catchError(error => {
        console.log('Backend API unavailable, falling back to direct API calls', error);
        return this.getWeatherDirectly(city);
      })
    );
  }
  
  private getWeatherDirectly(city: string): Observable<any> {
    // Step 1: Get coordinates from Nominatim
    const headers = new HttpHeaders().set(
      'User-Agent', 
      'WeatherApp/1.0 (https://github.com/your-username/Weather)'
    );
    
    const geoUrl = `${this.geocodingApiUrl}?q=${encodeURIComponent(city)}&format=json`;
    
    return this.http.get<GeocodeResult[]>(geoUrl, { headers }).pipe(
      switchMap(results => {
        if (!results || results.length === 0) {
          return throwError(() => new Error('No coordinates found for the given city.'));
        }
        
        // Step 2: Get weather data from Open-Meteo
        const lat = results[0].lat;
        const lon = results[0].lon;
        const weatherUrl = `${this.weatherApiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
        
        return this.http.get(weatherUrl);
      }),
      catchError(error => {
        console.error('Error in direct API call:', error);
        return throwError(() => error);
      })
    );
  }
}
