CREATE FUNCTION dbo.CurrentSchoolYear()
RETURNS int
AS
-- Returns the stock level for the product.
BEGIN
    return datepart(year, getdate()) +  IIF(datepart(MONTH, getdate()) >= 7,1,0);
END;
