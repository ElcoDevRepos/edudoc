using System.Data.SqlClient;
using System.Data.SqlClient;
using Model.Partials;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;


namespace Model
{
    [MetadataType(typeof(ContactPhoneMetaData))]
    public partial class ContactPhone : IHasPhoneNumber, IHasPrimary
    {
        internal sealed class ContactPhoneMetaData
        {
            private ContactPhoneMetaData()
            { }

            [JsonIgnore]
            public Contact Contact { get; set; } // FK_ContactPhones_CustomerContacts
        }
    }

}
