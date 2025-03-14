import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [WeatherService]  
})
export class WeatherComponent {
  cityName: string = '';
  currentCity: string = ''; // New property to store the city name of current weather data
  weatherData: any;
  today = new Date();
  showAdvanced = false;
  errorMessage: string | null = null;

  constructor(private weatherService: WeatherService) {}

  getWeather(): void {
    if (!this.cityName.trim()) {
      this.errorMessage = 'Please enter a city name.';
      return;
    }

    this.errorMessage = null;
    this.weatherService.getWeatherByCity(this.cityName).subscribe({
      next: data => {
        this.weatherData = data;
        this.currentCity = this.cityName; // Only update currentCity after successful API call
      },
      error: error => this.errorMessage = 'Error fetching weather data. Please check the city name and try again.'
    });
  }
  
  getWeatherIcon(weatherCode: number): string {
    // Map weather codes to Font Awesome icons
    const iconMap: {[key: number]: string} = {
      0: 'fas fa-sun', // Clear sky
      1: 'fas fa-cloud-sun', // Mainly clear
      2: 'fas fa-cloud-sun', // Partly cloudy
      3: 'fas fa-cloud', // Overcast
      45: 'fas fa-smog', // Fog
      48: 'fas fa-smog', // Depositing rime fog
      51: 'fas fa-cloud-rain', // Light drizzle
      53: 'fas fa-cloud-rain', // Moderate drizzle
      55: 'fas fa-cloud-showers-heavy', // Dense drizzle
      61: 'fas fa-cloud-rain', // Slight rain
      63: 'fas fa-cloud-rain', // Moderate rain
      65: 'fas fa-cloud-showers-heavy', // Heavy rain
      71: 'fas fa-snowflake', // Slight snow
      73: 'fas fa-snowflake', // Moderate snow
      75: 'fas fa-snowflake', // Heavy snow
      80: 'fas fa-cloud-rain', // Slight rain showers
      81: 'fas fa-cloud-showers-heavy', // Moderate rain showers
      82: 'fas fa-cloud-showers-heavy', // Violent rain showers
      95: 'fas fa-bolt', // Thunderstorm
      96: 'fas fa-bolt', // Thunderstorm with slight hail
      99: 'fas fa-bolt', // Thunderstorm with heavy hail
    };
    
    return iconMap[weatherCode] || 'fas fa-question';
  }

  getWeatherDescription(weatherCode: number): string {
    const descriptions: {[key: number]: string} = {
      0: 'Clear Sky',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Light Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      80: 'Rain Showers',
      81: 'Moderate Showers',
      82: 'Violent Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Severe Thunderstorm',
    };
    
    return descriptions[weatherCode] || 'Unknown';
  }

  getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
}