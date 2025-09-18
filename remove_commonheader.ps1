$files = Get-ChildItem -Path "src\app" -Filter "*.tsx" -Recurse | Where-Object { $_.Name -ne "page.tsx" -or $_.DirectoryName -eq "C:\projects\staff-medical-system\src\app" }

foreach ($file in $files) {
    if ($file.FullName -eq "C:\projects\staff-medical-system\src\app\page.tsx") {
        continue
    }
    
    $content = Get-Content $file.FullName -Raw
    if ($content -match "import CommonHeader from") {
        $newContent = $content -replace "import CommonHeader from '@/components/CommonHeader';`r?`n", ""
        $newContent = $newContent -replace "<CommonHeader[^/>]*/>(`r?`n)?", ""
        $newContent = $newContent -replace "<CommonHeader[^>]*>[^<]*</CommonHeader>(`r?`n)?", ""
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}
