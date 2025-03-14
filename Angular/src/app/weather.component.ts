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
  weatherData: any;

  constructor(private weatherService: WeatherService) {}

  getWeather(): void {
    if (!this.cityName.trim()) {
      alert('Please enter a city name.');
      return;
    }

    this.weatherService.getWeatherByCity(this.cityName).subscribe({
      next: data => this.weatherData = data,
      error: error => alert('Error fetching weather data.')
    });
  }
}
