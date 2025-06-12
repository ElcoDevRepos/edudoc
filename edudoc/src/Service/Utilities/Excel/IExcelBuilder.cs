
using Service.Utilities.Excel.Model;

namespace Service.Utilities.Excel
{
    public interface IExcelBuilder
    {
        byte[] CreateExcelDocument<T>(ExcelDocumentConfiguration<T> documentConfig);
    }
}
