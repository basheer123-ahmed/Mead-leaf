$zipPath = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\downloads\medicinal_plants.zip'
$outDir = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\dataset\medicinal_plants'

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Write-Host "Extracting dataset to $outDir..."

# Extract a balanced sample or full dataset safely
$count = 0
foreach ($entry in $zip.Entries) {
    if (-not $entry.FullName.EndsWith('/')) {
        $destFile = Join-Path $outDir $entry.FullName
        $parent = Split-Path $destFile
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Force -Path $parent | Out-Null
        }
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destFile, $true)
        $count++
        if ($count % 500 -eq 0) {
            Write-Host "Extracted $count files..."
        }
    }
}

$zip.Dispose()
Write-Host "✅ Extraction complete! Total files: $count"
