import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,  // <-- Make it standalone
  imports: [CommonModule, FormsModule],  // <-- Import CommonModule & FormsModule
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
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

    this.weatherService.getWeatherByCity(this.cityName).subscribe(
      data => this.weatherData = data,
      error => alert('Error fetching weather data.')
    );
  }
}
