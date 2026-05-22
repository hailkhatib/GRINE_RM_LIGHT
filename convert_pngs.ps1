Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -Path .\assets\*.png
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    if ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8) {
        Write-Host "Converting $($file.Name)..."
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $tempPath = $file.FullName + ".temp.png"
        $img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
        Remove-Item -Path $file.FullName -Force
        Rename-Item -Path $tempPath -NewName $file.Name
    }
}
Write-Host "Done!"
