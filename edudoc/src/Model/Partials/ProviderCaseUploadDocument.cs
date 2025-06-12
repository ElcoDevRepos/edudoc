using System.Data.SqlClient;
using System.Data.SqlClient;
using Model.Partials.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(ProviderCaseUploadDocumentMetaData))]
    public partial class ProviderCaseUploadDocument : IBaseDocument
    {
        internal sealed class ProviderCaseUploadDocumentMetaData
        {
            private ProviderCaseUploadDocumentMetaData()
            {
            }

        }
    }
}
