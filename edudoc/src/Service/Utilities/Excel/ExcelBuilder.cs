using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Office2013.PowerPoint.Roaming;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Model.DTOs;
using Service.Utilities.Excel.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Service.Utilities.Excel
{
    public class ExcelBuilder : IExcelBuilder
    {
        public ExcelBuilder()
        {
        }
        public byte[] CreateExcelDocument<T>(ExcelDocumentConfiguration<T> documentConfig)
        {
            var stream = new MemoryStream();
            // Create a spreadsheet document by supplying the filepath.
            // By default, AutoSave = true, Editable = true, and Type = xlsx.
            SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.
                Create(stream, SpreadsheetDocumentType.Workbook);

            // Add a WorkbookPart to the document.
            WorkbookPart workbookpart = spreadsheetDocument.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();

            // Add Sheets to the Workbook.
            Sheets sheets = spreadsheetDocument.WorkbookPart.Workbook.
                AppendChild<Sheets>(new Sheets());

            AddExcelSheet(sheets, spreadsheetDocument, workbookpart, 1, documentConfig, documentConfig.DocumentData);
            AddExcelSheet(sheets, spreadsheetDocument, workbookpart, 2, documentConfig, documentConfig.SecondaryDocumentData);

            workbookpart.Workbook.Save();

            // Close the document.
            spreadsheetDocument.Dispose();

            return stream.ToArray();
        }

        private void AddExcelSheet<T>(Sheets sheets, SpreadsheetDocument spreadsheetDocument, WorkbookPart workbookpart,
            int sheetId, ExcelDocumentConfiguration<T> documentConfig, IEnumerable<T> documentData)
        {
            // Add a WorksheetPart to the WorkbookPart.
            WorksheetPart worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
            SheetData sheetData = new SheetData();
            worksheetPart.Worksheet = new Worksheet(sheetData);

            // Append a new worksheet and associate it with the workbook.
            Sheet sheet = new Sheet()
            {
                Id = $"{spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart)}",
                SheetId = (uint)sheetId,
                Name = $"Sheet {sheetId}",
            };
            sheets.Append(sheet);

            // BUILD DOCUMENT
            BuildDocumentColumns(worksheetPart, documentConfig.ColumnsConfig);

            // Header Rows
            var rowCount = documentConfig.HeaderConfig.Count();
            rowCount++;
            for (int i = 1; i <= documentConfig.ColumnsConfig.Count(); i++)
            {
                var col = documentConfig.ColumnsConfig[i - 1];
                UInt32Value column = (uint)i;
                var colheader = AddStringCell(ExcelConstants.ColumnMap[column], (uint)rowCount, col.Header, worksheetPart);
            }
            rowCount++;
            BuildSpreadsheetDataRows(worksheetPart, documentConfig.ColumnsConfig, documentData, (uint)rowCount, out uint endRow);
        }

        /// <summary>
        /// Configure each column
        /// </summary>
        /// <example>
        /// Min = 1, Max = 1 ==> Apply this to column 1 (A)
        /// Min = 2, Max = 2 ==> Apply this to column 2 (B)
        /// Width = 25 ==> Set the width to 25
        /// CustomWidth = true ==> Tell Excel to use the custom width
        /// lstColumns.Append(new Column() { Min = 1, Max = 1, Width = 9.36, CustomWidth = true });
        /// </example>
        /// <see href="https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.column?view=openxml-2.8.1"/>
        private void BuildDocumentColumns(WorksheetPart worksheetPart, List<ColumnDefinition> colConfig)
        {
            Columns lstColumns = new();

            for (int i = 1; i <= colConfig.Count(); i++)
            {
                UInt32Value column = (uint)i;
                var colDef = colConfig[i - 1];
                var col = new Column() { Min = column, Max = column, Width = colDef.Width, CustomWidth = true, Hidden = colDef.IsHidden };
                lstColumns.Append(col);
            }

            worksheetPart.Worksheet.InsertAt(lstColumns, 0);
        }

        private Cell AddStringCell(string column, uint row, string cellValue, WorksheetPart worksheetPart)
        {
            Cell cell = InsertCellInWorksheet(column, row, worksheetPart);
            cell.CellValue = new CellValue(cellValue);
            cell.DataType = CellValues.String;
            return cell;
        }

        // Given a column name, a row index, and a WorksheetPart, inserts a cell into the worksheet.
        // If the cell already exists, returns it.
        private Cell InsertCellInWorksheet(string columnName, uint rowIndex, WorksheetPart worksheetPart, int linesPerCell = 1)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();
            string cellReference = columnName + rowIndex;

            // If the worksheet does not contain a row with the specified row index, insert one.
            Row row;
            if (sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).Count() != 0)
            {
                row = sheetData.Elements<Row>().Where(r => r.RowIndex == rowIndex).First();
            }
            else
            {
                row = new Row() { RowIndex = rowIndex };
                row.Height = 18 * linesPerCell;
                row.CustomHeight = true;
                sheetData.Append(row);
            }

            // If there is not a cell with the specified column name, insert one.
            if (row.Elements<Cell>().Where(c => c.CellReference.Value == columnName + rowIndex).Count() > 0)
            {
                return row.Elements<Cell>().Where(c => c.CellReference.Value == cellReference).First();
            }
            else
            {
                // Cells must be in sequential order according to CellReference. Determine where to insert the new cell.
                Cell refCell = null;
                foreach (Cell cell in row.Elements<Cell>())
                {
                    if (string.Compare(cell.CellReference.Value, cellReference, true) > 0)
                    {
                        refCell = cell;
                        break;
                    }
                }

                Cell newCell = new Cell() { CellReference = cellReference };
                row.InsertBefore(newCell, refCell);

                worksheet.Save();
                return newCell;
            }
        }

        private void BuildSpreadsheetDataRows<T>(WorksheetPart worksheetPart, List<ColumnDefinition> colConfig, IEnumerable<T> docData, uint startRow, out uint endRow)
        {
            Worksheet worksheet = worksheetPart.Worksheet;
            SheetData sheetData = worksheet.GetFirstChild<SheetData>();
            TimeZoneInfo tz = CommonFunctions.GetTimeZone();
            int lineHeight = 18;

            foreach (var data in docData)
            {
                Row row = CreateDataRow(startRow, lineHeight);

                for (int i = 1; i <= colConfig.Count; i++)
                {
                    UInt32Value column = (uint)i;
                    var colDef = colConfig[i - 1];
                    string columnName = ExcelConstants.ColumnMap[column];
                    Cell cell = AddCellToRow(columnName, startRow, row);

                    switch (colDef.CellValue)
                    {
                        case CellDataType.Numeric:
                            int intValue = GetPropValue<int>(data, colDef.PropertyName);
                            BuildNumericCell(cell, intValue);
                            break;
                        case CellDataType.Date:
                            DateTime dateValue = GetPropValue<DateTime>(data, colDef.PropertyName);
                            BuildDateCell(cell, dateValue);
                            break;
                        case CellDataType.TimeSpan:
                            TimeSpan timeValue = GetPropValue<TimeSpan>(data, colDef.PropertyName);
                            DateTime utc = GetPropValue<DateTime>(data, "EncounterDate").ToUniversalTime();
                            var isDst = tz.IsDaylightSavingTime(utc);
                            int offset = isDst ? -240 : -300;
                            BuildTimeCell(cell, timeValue, offset);
                            break;
                        case CellDataType.Minutes:
                            TimeSpan startTime = GetPropValue<TimeSpan>(data, "EncounterStartTime");
                            TimeSpan endTime = GetPropValue<TimeSpan>(data, "EncounterEndTime");
                            BuildMinutesCell(cell, startTime, endTime);
                            break;
                        case CellDataType.String:
                        default:
                            var value = GetPropValue<string>(data, colDef.PropertyName);
                            BuildStringCell(cell, value);
                            cell.CellValue = new CellValue(value);
                            break;
                    }

                    if (colDef.Formula != null)
                    {
                        cell.CellFormula = new CellFormula(colDef.Formula);
                    }
                }
                sheetData.Append(row);
                startRow++;
            }
            endRow = startRow;
            worksheet.Save();
        }

        private Row CreateDataRow(uint startRow, int lineHeight)
        {
            return new()
            {
                RowIndex = startRow,
                Height = lineHeight,
                CustomHeight = true
            };
        }

        private Cell AddCellToRow(string column, uint line, Row row)
        {
            string cellReference = column + row;
            Cell cell = new() { CellReference = cellReference };

            // Cells must be in sequential order according to CellReference. Determine where to insert the new cell.
            Cell refCell = row.Elements<Cell>().Where(c => string.Compare(c.CellReference.Value, cellReference, true) > 0).FirstOrDefault();
            row.InsertBefore(cell, refCell);
            return cell;
        }

        private void BuildNumericCell(Cell cell, int value)
        {
            cell.CellValue = new CellValue(value.ToString());
            cell.DataType = CellValues.Number;
        }

        private void BuildDateCell(Cell cell, DateTime value)
        {
            cell.CellValue = new CellValue(value.ToUniversalTime().ToShortDateString());
            cell.DataType = CellValues.String;
        }

        private void BuildTimeCell(Cell cell, TimeSpan value, int offset)
        {
            DateTime time = DateTime.Today.Add(value).AddMinutes(offset);
            cell.CellValue = new CellValue(time.ToShortTimeString());
            cell.DataType = CellValues.String;
        }

        private void BuildMinutesCell(Cell cell, TimeSpan startTime, TimeSpan endTime)
        {
            TimeSpan duration = endTime - startTime;
            cell.CellValue = new CellValue(duration.TotalMinutes.ToString());
            cell.DataType = CellValues.Number;
        }

        private void BuildStringCell(Cell cell, string value)
        {
            cell.CellValue = new CellValue(value.ToString());
            cell.DataType = CellValues.String;
        }

        private T GetPropValue<T>(Object obj, String name)
        {
            Object retval = GetPropValue(obj, name);
            if (retval == null) { return default(T); }

            // throws InvalidCastException if types are incompatible
            return (T)retval;
        }

        private Object GetPropValue(Object obj, String name)
        {
            foreach (String part in name.Split('.'))
            {
                if (obj == null) { return null; }

                Type type = obj.GetType();
                PropertyInfo info = type.GetProperty(part);

                // if child object is a generic list, return property of 1st item
                if (type.Namespace == "System.Collections.Generic")
                {
                    info = type.GenericTypeArguments[0].GetProperty(part);
                    foreach (object o in obj as IEnumerable)
                    {
                        return info.GetValue(o, null);
                    }
                    return null;
                }

                if (info == null) { return null; }

                obj = info.GetValue(obj, null);
            }
            return obj;
        }
    }
}
