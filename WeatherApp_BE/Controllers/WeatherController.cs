using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;

namespace WeatherApp.Controllers
{
    [Route("api/weather")]
    [ApiController]
    public class WeatherController : ControllerBase
    {
        private static readonly HttpClient _httpClient = new HttpClient();

        private const string OpenMeteoUrl = "https://api.open-meteo.com/v1/forecast";


        private const string WeatherApiUrl = "https://api.open-meteo.com/v1/forecast";
        private const string CityGeoCodeApi = "https://nominatim.openstreetmap.org/search";

        public class GeocodeResult
        {
            public double Lat { get; set; }
            public double Lon { get; set; }
        }


        [HttpGet("city")]
        public async Task<IActionResult> GetCityCords(string city)
        {
            if (string.IsNullOrWhiteSpace(city))
                return BadRequest("City name is required.");

            string geoUrl = $"{CityGeoCodeApi}?q={city}&format=json";

            Console.WriteLine($"Fetching city coordinates from: {city} : {geoUrl}");

            // Create a new HttpClientHandler to force IPv4
            HttpClientHandler handler = new HttpClientHandler();

            using (HttpClient client = new HttpClient(handler))
            {
                // ✅ Set a generic but valid User-Agent (required by Nominatim)
                client.DefaultRequestHeaders.UserAgent.ParseAdd("MyWeatherApp/1.0");

                HttpResponseMessage geoResponse = await client.GetAsync(geoUrl);

                if (!geoResponse.IsSuccessStatusCode)
                {
                    string errorContent = await geoResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"Error fetching city coordinates: {geoResponse.StatusCode} - {errorContent}");
                    return BadRequest($"Error fetching city coordinates: {geoResponse.StatusCode}");
                }

                string jsonResponse = await geoResponse.Content.ReadAsStringAsync();
                // Console.WriteLine($"API Response: {jsonResponse}");

                var results = JsonConvert.DeserializeObject<List<GeocodeResult>>(jsonResponse);

                if (results == null || results.Count == 0)
                {
                    Console.WriteLine("No coordinates found for the given city.");
                    return NotFound("No coordinates found for the given city.");
                }

                Console.WriteLine($"First result: Lat={results[0].Lat}, Lon={results[0].Lon}");
                return Ok(results.First());  // Return the first match
            }
        }

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