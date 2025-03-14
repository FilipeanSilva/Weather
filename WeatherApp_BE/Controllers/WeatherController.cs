using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace WeatherApp.Controllers
{
    [Route("api/weather")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        private const string OpenMeteoUrl = "https://api.open-meteo.com/v1/forecast";

        // Synchronous method
        [HttpGet("sync")]
        public IActionResult GetWeatherSync(double latitude = 47.3769, double longitude = 8.5417)
        {
            string url = $"{OpenMeteoUrl}?latitude={latitude}&longitude={longitude}&current_weather=true";
            HttpResponseMessage response = _httpClient.GetAsync(url).Result;

            if (!response.IsSuccessStatusCode)
                return BadRequest("Error fetching weather data");

            var weatherData = response.Content.ReadAsStringAsync().Result;
            return Ok(weatherData);
        }

        // Asynchronous method
        [HttpGet("async")]
        public async Task<IActionResult> GetWeatherAsync(double latitude = 47.3769, double longitude = 8.5417)
        {
            string url = $"{OpenMeteoUrl}?latitude={latitude}&longitude={longitude}&current_weather=true";
            HttpResponseMessage response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return BadRequest("Error fetching weather data");

            var weatherData = await response.Content.ReadAsStringAsync();
            return Ok(weatherData);
        }

        // Static function for temperature conversion
        public static class WeatherUtils
        {
            public static double CelsiusToFahrenheit(double celsius)
            {
                return (celsius * 9 / 5) + 32;
            }
        }

        // Using the static function in an API endpoint
        [HttpGet("convert")]
        public IActionResult ConvertTemperature(double celsius)
        {
            double fahrenheit = WeatherUtils.CelsiusToFahrenheit(celsius);
            return Ok(new { Celsius = celsius, Fahrenheit = fahrenheit });
        }
    }
}