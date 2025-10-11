$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Open('C:\projects\staff-medical-system\docs\小原病院アンケート結果.xlsx')
$worksheet = $workbook.Worksheets.Item(1)
$range = $worksheet.UsedRange
$rowCount = $range.Rows.Count
$colCount = $range.Columns.Count

Write-Host "Total Rows: $rowCount"
Write-Host "Total Columns: $colCount"
Write-Host ""

for($i=1; $i -le [Math]::Min(50, $rowCount); $i++){
    $rowData = @()
    for($j=1; $j -le $colCount; $j++){
        $cellValue = $range.Cells.Item($i,$j).Text
        $rowData += $cellValue
    }
    Write-Host "Row $i : $($rowData -join ' | ')"
}

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
