using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace API.Common.SearchUtilities
{
    /// <summary>
    /// collection of static methods for making repetitive extra params logic easier
    /// </summary>
    public static class SearchStaticMethods
    {
        private static Dictionary<string, List<T>> GetListFromExtraParams<T>(string extraParams, Func<string, T> selector, params string[] fieldNames)
        {
            var nvc = HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraParams));
            var result = new Dictionary<string, List<T>>();
            foreach (string fieldName in fieldNames)
            {
                if (nvc[fieldName] != null)
                {
                    result.Add(fieldName, nvc[fieldName].Split(',').Select(selector).ToList());
                }
                else
                {
                    result.Add(fieldName, new List<T>());
                }
            }
            return result;
        }

        private static Dictionary<string, T> GetSingleParamMappingFromExtraParams<T>(string extraParams, Func<string, T> converter, params string[] fieldNames)
        {
            var nvc = HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraParams));
            var result = new Dictionary<string, T>();
            foreach (string fieldName in fieldNames)
            {
                if (nvc[fieldName] != null)
                {
                    result.Add(fieldName, converter(nvc[fieldName]));
                }
                else
                {
                    throw new KeyNotFoundException($"Field name {fieldName} not found in extra parameters");
                }
            }
            return result;
        }

        /// <summary>
        /// Get a list of ints from the extra params.
        ///
        /// Usage example from UserRolesController:
        /// var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "typeids");
        /// var typeIdList = extraParamLists["typeids"];
        /// cspFull.AddedWhereClause.Add(role => typeIdList.Contains(role.UserTypeId));
        /// </summary>
        /// <param name="extraParams">String of extra params to parse from</param>
        /// <param name="fieldNames">Field names to include</param>
        /// <returns>Dictionary mapping field name to list of integer values to search against for that field</returns>
        public static Dictionary<string, List<int>> GetIntListFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetListFromExtraParams(extraParams, Int32.Parse, fieldNames);
        }

        public static Dictionary<string, List<bool>> GetBoolListFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetListFromExtraParams(extraParams, (queryVal) => (queryVal == "1"), fieldNames);
        }

        /// <summary>
        /// Get an untransformed list of strings from the extra params.
        /// </summary>
        /// <param name="extraParams">String of extra params to parse from (usually included in object passed to search endpoint)</param>
        /// <param name="fieldNames">Field names to include</param>
        /// <returns>Dictionary mapping field name to list of string values to search against for that field</returns>
        public static Dictionary<string, List<string>> GetStringListFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetListFromExtraParams(extraParams, (str) => str, fieldNames);
        }

        public static Dictionary<string, int> GetIntParametersFromExtraParams(string extraParams, params string[] fieldNames)
        {
            return GetSingleParamMappingFromExtraParams(extraParams, Int32.Parse, fieldNames);
        }
    }
}
