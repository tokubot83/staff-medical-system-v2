$ErrorActionPreference = "Stop"

try {
    $filePath = "C:\projects\staff-medical-system\docs\小原病院_職員アンケート分析レポート.xlsx"

    # Check if file exists
    if (-Not (Test-Path $filePath)) {
        Write-Host "File not found: $filePath"
        exit 1
    }

    Write-Host "Opening file: $filePath"

    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $workbook = $excel.Workbooks.Open($filePath)

    Write-Host "Workbook opened successfully"
    Write-Host "Number of worksheets: $($workbook.Worksheets.Count)"
    Write-Host ""

    # Read all sheets
    foreach ($sheet in $workbook.Worksheets) {
        Write-Host "================================"
        Write-Host "Sheet Name: $($sheet.Name)"
        Write-Host "================================"

        $range = $sheet.UsedRange
        $rowCount = $range.Rows.Count
        $colCount = $range.Columns.Count

        Write-Host "Rows: $rowCount, Columns: $colCount"
        Write-Host ""

        # Read first 100 rows
        $maxRows = [Math]::Min(100, $rowCount)
        for($i=1; $i -le $maxRows; $i++){
            $rowData = @()
            for($j=1; $j -le $colCount; $j++){
                $cellValue = $range.Cells.Item($i,$j).Text
                $rowData += $cellValue
            }
            Write-Host "Row $i : $($rowData -join ' | ')"
        }
        Write-Host ""
    }

    $workbook.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

    Write-Host "Successfully completed"
}
catch {
    Write-Host "Error occurred: $_"
    if ($excel) {
        $excel.Quit()
    }
}
