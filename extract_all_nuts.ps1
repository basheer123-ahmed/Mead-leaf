$zipPath = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\downloads\tree_nuts.zip'
$outDir = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\dataset\tree_nuts'

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Write-Host "Extracting tree nuts dataset to $outDir..."

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
    }
}

$zip.Dispose()
Write-Host "✅ Tree nuts extraction complete! Total files: $count"
