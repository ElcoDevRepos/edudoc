using System.Collections.Generic;

namespace Service.Utilities.Excel.Model
{
    public class ExcelDocumentConfiguration<T>
    {
        public ExcelDocumentConfiguration(string worksheetName, IEnumerable<T> tableData, IEnumerable<T> secondaryDocumentData)
        {
            HeaderConfig = new List<HeaderDefinition>();
            ColumnsConfig = new List<ColumnDefinition>();
            WorksheetName = worksheetName;
            DocumentData = tableData;
            SecondaryDocumentData = secondaryDocumentData;
        }
        public List<HeaderDefinition> HeaderConfig { get; set; }
        public List<ColumnDefinition> ColumnsConfig { get; set; }
        public string WorksheetName { get; set; }
        public IEnumerable<T> DocumentData { get; set; }
        public IEnumerable<T> SecondaryDocumentData { get; set; }
    }

    /// <summary>
    /// Defines the Rows to build out the header
    /// </summary>
    public class HeaderDefinition
    {
        public HeaderDefinition()
        {
            Cells = new List<HeaderCellData>();
        }
        public List<HeaderCellData> Cells { get; set; }

        public void AddCell(string value, bool bold = false)
        {
            Cells.Add(new HeaderCellData
             {
                 Value = value,
                 Bold = bold
             });
        }

        /// <summary>
        /// Skips one cell
        /// </summary>
        public void SkipCell()
        {           
            Cells.Add(new HeaderCellData { Skip = true });
        }

        /// <summary>
        /// Skips the given number of cells
        /// </summary>
        /// <param name="count"></param>
        public void SkipCells(int count)
        {
            while (count > 0)
            {
                Cells.Add(new HeaderCellData { Skip = true });
                count--;
            }           
        }
    }

    /// <summary>
    /// Used for simple export only, limited styling options, string data type assumed
    /// </summary>
    public class HeaderCellData
    {
        /// <summary>
        /// Cell value
        /// </summary>
        public string? Value { get; set; }
        /// <summary>
        /// Applys bold text styling, defaults to false
        /// </summary>
        public bool Bold { get; set; } = false;
        /// <summary>
        /// Skips over a cell
        /// </summary>
        public bool Skip { get; set; } = false;
    }
}
