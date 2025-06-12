using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;

namespace API.Auth.Helpers
{
    public static class GoogleAuthHelper
    {
        private const string GoogleApiTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";

        internal class GoogleApiTokenInfo
        {
            public string hd { get; set; }
            public string aud { get; set; } // Client Secret
            public string email { get; set; }
            public string name { get; set; }
            public string iss { get; set; } // Issuer
            public long iat { get; set; } // Issued at Time
        }


        public static bool VerifyGoogleToken(string token, string clientId)
        {
            if (!TokenMatchesClientId(token, clientId)) return false;

            if (!TokenIsValid(token)) return false;

            return true;
        }

        private static bool TokenIsValid(string token)
        {
            var httpClient = new HttpClient();
            var requestUri = new Uri(string.Format(GoogleApiTokenInfoUrl, token));

            HttpResponseMessage httpResponseMessage;
            try
            {
                httpResponseMessage = httpClient.GetAsync(requestUri).Result;
            }
            catch (Exception)
            {
                return false;
            }

            if (httpResponseMessage.StatusCode != HttpStatusCode.OK)
            {
                return false;
            }

            var response = httpResponseMessage.Content.ReadAsStringAsync().Result;
            if (string.IsNullOrWhiteSpace(response)) return false;

            return true;
        }

        private static bool TokenMatchesClientId(string token, string clientId)
        {
            var encoded = token.Split('.')[1];
            var decoded = Base64UrlDecode(encoded);

            var googleApiTokenInfo = JsonConvert.DeserializeObject<GoogleApiTokenInfo>(decoded);

            return googleApiTokenInfo.aud.Contains(clientId);
        }

        private static string Base64UrlDecode(string value, Encoding encoding = null)
        {
            string urlDecodedValue = value.Replace('_', '/').Replace('-', '+');

            switch (value.Length % 4)
            {
                case 2:
                    urlDecodedValue += "==";
                    break;
                case 3:
                    urlDecodedValue += "=";
                    break;
            }

            return Encoding.ASCII.GetString(Convert.FromBase64String(urlDecodedValue));
        }
    }
}
