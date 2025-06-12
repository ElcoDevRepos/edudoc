using DocumentFormat.OpenXml;

namespace Service.Utilities.Excel.Model
{
    public class ColumnDefinition
    {
        /// <summary>
        /// Column header
        /// </summary>
        public string Header { get; set; } = null!;
        /// <summary>
        /// Width is approximately character count
        /// </summary>
        public DoubleValue Width { get; set; } = null!;
        /// <summary>
        /// Property navigation
        /// </summary>
        public string? PropertyName { get; set; } = null!;
        /// <summary>
        /// Skip writing values to this column
        /// </summary>
        public bool LeaveBlank { get; set; } = false;
        /// <summary>
        /// If CellType is omitted, string will be assumed
        /// </summary>
        public CellDataType? CellValue { get; set; }
        /// <summary>
        /// Formula as it would be entered in excel
        /// </summary>
        public string? Formula { get; set; }
        /// <summary>
        /// If true the column will be hidden
        /// </summary>
        public bool IsHidden { get; set; } = false;
    }

    /// <summary>
    /// As the builder grows specific use cases should be added here
    /// </summary>
    public enum CellDataType
    {
        String,
        /// <summary>
        /// Data type assumed to be decimal, #,##.00 format
        /// </summary>
        Currency,
        /// <summary>
        /// Data type assumed to be int, aligned right
        /// </summary>
        Numeric,
        Date,
        MultipleLines,
        NullableNumeric,
        Base64Image,
        TimeSpan,
        Minutes
    }
}
