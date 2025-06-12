using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.Partials.Interfaces
{
    public interface IBaseDocument
    {
        string FilePath { get; set; }
        string Name { get; set; }
        int? UploadedBy { get; set; }
        DateTime DateUpload { get; set; }
    }
}
