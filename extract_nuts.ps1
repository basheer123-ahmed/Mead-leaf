$zipPath = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\downloads\tree_nuts.zip'
$outModel = 'C:\Users\bashe\.gemini\antigravity\scratch\Mead-leaf\ai-service\models\nut_model.h5'

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entry = $zip.Entries | Where-Object { $_.Name -eq 'nuts_100.0.h5' } | Select-Object -First 1

if ($entry) {
    New-Item -ItemType Directory -Force -Path (Split-Path $outModel) | Out-Null
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $outModel, $true)
    Write-Host "✅ Model extracted to: $outModel"
} else {
    Write-Host "❌ nuts_100.0.h5 not found in zip"
}
$zip.Dispose()
