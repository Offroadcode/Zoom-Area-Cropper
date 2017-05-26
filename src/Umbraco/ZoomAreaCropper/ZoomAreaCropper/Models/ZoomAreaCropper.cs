using Umbraco.Core.Models;
using Umbraco.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;

namespace ZoomAreaCropper.Models
{
    public class ZoomAreaCropper
    {
        private readonly static UmbracoHelper Umbraco = new UmbracoHelper(UmbracoContext.Current);

        [JsonProperty("media")]
        public IPublishedContent Media { get; set; }

        [JsonProperty("crops")]
        public IEnumerable<Crop> Crops { get; set; }

        /// <summary>
        /// Confirms that the media is not null and has a URL
        /// </summary>
        public bool HasMedia
        {
            get
            {
                return Media != null && !string.IsNullOrEmpty(Media.Url);
            }
        }

        /// <summary>
        /// Confirms that crops isn't null and has children
        /// </summary>
        public bool HasCrops
        {
            get { return Crops != null && Crops.Any(); }
        }

        public static ZoomAreaCropper Deserialize(string json)
        {
            var model = new ZoomAreaCropper();


            // Validate the JSON
            if (json == null || !json.StartsWith("{") || !json.EndsWith("}"))
            {
                return null;
            }

            dynamic jobj = JObject.Parse(json);
            var mediaId = jobj.SelectToken("media").Value<int>("id");
            var crops = jobj.SelectToken("crops").Children();

            var cropList = new List<Crop>();

            foreach (JToken crop in crops)
            {
                var item = new Crop
                {
                    Name = crop.Value<string>("name"),
                    Height = crop.Value<int>("height"),
                    Url = crop.Value<string>("url"),
                    Width = crop.Value<int>("width"),
                    X = crop.Value<int>("x"),
                    Y = crop.Value<int>("y"),
                    Zoom = crop.Value<decimal>("zoom")
                };

                cropList.Add(item);
            }

            model.Media = mediaId != 0 ? Umbraco.TypedMedia(mediaId) : null;
            model.Crops = cropList;

            return model;

        }
    }
}
