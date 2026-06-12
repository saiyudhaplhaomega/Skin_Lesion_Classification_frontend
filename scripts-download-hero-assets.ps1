# Downloads the Higgsfield-generated hero assets into public/brand/hero/
# Works from any working directory (paths resolved relative to this script).
$dir = Join-Path $PSScriptRoot "public/brand/hero"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Invoke-WebRequest -Uri "https://d8j0ntlcm91z4.cloudfront.net/user_3EzXhysSkoxmB6V6CunhZjsDZ6Q/hf_20260611_215824_8787c21c-c0d1-4e50-ba87-a2f43a01d472.png" -OutFile (Join-Path $dir "hero-dark.png")
Invoke-WebRequest -Uri "https://d8j0ntlcm91z4.cloudfront.net/user_3EzXhysSkoxmB6V6CunhZjsDZ6Q/hf_20260611_221228_feb68108-98f9-4623-9d49-77418a28ede8.mp4" -OutFile (Join-Path $dir "hero-loop.mp4")
Write-Host "Done. hero-dark.png + hero-loop.mp4 saved to $dir"
Start-Sleep -Seconds 4
