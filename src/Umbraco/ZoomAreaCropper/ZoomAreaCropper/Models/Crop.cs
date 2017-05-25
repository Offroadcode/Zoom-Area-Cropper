using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;


namespace ZoomAreaCropper.Models
{
    class Crop
    {
        [JsonProperty("height")]
        public int Height { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("x")]
        public int X { get; set; }

        [JsonProperty("y")]
        public int Y { get; set; }

        [JsonProperty("zoom")]
        public decimal Zoom { get; set; } 

        public static Crop Deserialize(string json)
        {
            if (json == null || !json.StartsWith("{") || !json.EndsWith("}"))
            {
                return null;
            }

            var jobj = (JProperty)JsonConvert.DeserializeObject(json);
            return new Crop
            {
                Height = (int)jobj.Value["height"],
                Name = (string)jobj.Value["name"],
                Url = (string)jobj.Value["url"],
                Width = (int)jobj.Value["width"],
                X = (int)jobj.Value["x"],
                Y = (int)jobj.Value["y"],
                Zoom = (int)jobj.Value["z"]
            };
        }
    }
}
