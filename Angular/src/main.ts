import { bootstrapApplication } from '@angular/platform-browser';
import { WeatherComponent } from './app/weather.component';

bootstrapApplication(WeatherComponent)
  .catch(err => console.error(err));
