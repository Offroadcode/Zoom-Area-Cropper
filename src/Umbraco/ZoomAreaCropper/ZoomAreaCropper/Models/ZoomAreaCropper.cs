using Umbraco.Core.Models;
using Umbraco.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace ZoomAreaCropper.Models
{
    class ZoomAreaCropper
    {
        private readonly static UmbracoHelper Umbraco = new UmbracoHelper(UmbracoContext.Current);

        [JsonProperty("media")]
        public IPublishedContent Media { get; set; }

        [JsonProperty("crops")]
        public IEnumerable<Crop> Crops { get; set; }

        public static ZoomAreaCropper Deserialize(string json)
        {
            // Validate the JSON
            if (json == null || !json.StartsWith("{") || !json.EndsWith("}"))
            {
                return null;
            }

            var jobj = (JObject)JsonConvert.DeserializeObject(json);
            var mediaId = jobj.SelectToken("media").Value<int>("id");

            return new ZoomAreaCropper()
            {
                Media = mediaId != 0 ? Umbraco.TypedMedia(mediaId) : null,
                Crops = jobj.Value<IEnumerable<Crop>>("crops")
            };

        }
    }
}
