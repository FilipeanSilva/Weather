import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  standalone: true, // Standalone component
  imports: [CommonModule], // <-- Add this here
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  weatherData: any;
  convertedTemp: any;

  constructor(private weatherService: WeatherService) {}

  getWeatherSync(): void {
    this.weatherService.getWeatherSync().subscribe(data => {
      this.weatherData = data;
    });
  }

  getWeatherAsync(): void {
    this.weatherService.getWeatherAsync().subscribe(data => {
      this.weatherData = data;
    });
  }

  convertTemperature(celsius: number): void {
    this.weatherService.convertTemperature(celsius).subscribe(data => {
      this.convertedTemp = data;
    });
  }
}
