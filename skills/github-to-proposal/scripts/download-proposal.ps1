param(
  [string]$Workspace = (Get-Location).Path
)

$ErrorActionPreference = "Stop"
$Repository = "https://github.com/KevinWangKaiYu/JingBoAI-Project-yi_an_guan_li.git"

function Assert-Within([string]$Path, [string]$Root) {
  $fullPath = [IO.Path]::GetFullPath($Path)
  $fullRoot = [IO.Path]::GetFullPath($Root).TrimEnd('\') + '\'
  if (-not $fullPath.StartsWith($fullRoot, [StringComparison]::OrdinalIgnoreCase)) { throw "Refusing to operate outside workspace: $fullPath" }
}

function Get-SystemHttpsProxy {
  $uri = [Uri]"https://github.com"
  $proxy = [System.Net.WebRequest]::GetSystemWebProxy().GetProxy($uri)
  if ($proxy -and $proxy.Host -ne $uri.Host) { return $proxy.AbsoluteUri.TrimEnd('/') }
}

$Workspace = (& git -C $Workspace rev-parse --show-toplevel).Trim()
$PrototypeRoot = Join-Path $Workspace "src/prototypes"
$Prototype = Join-Path $PrototypeRoot "proposal-intelligent-management"
$SharedHook = Join-Path $Workspace "src/common/useHashPage.ts"
$backupRoot = Join-Path $Workspace (".codex-sync-backups/proposal-intelligent-management/" + (Get-Date -Format "yyyyMMdd-HHmmss"))
$temp = Join-Path $env:TEMP ("proposal-github-download-" + [guid]::NewGuid())
$GitProxy = Get-SystemHttpsProxy
try {
  if ($GitProxy) { & git -c "http.proxy=$GitProxy" -c core.autocrlf=false clone --quiet --depth 1 --branch main $Repository $temp } else { & git -c core.autocrlf=false clone --quiet --depth 1 --branch main $Repository $temp }
  if ($LASTEXITCODE -ne 0) { throw "GitHub clone failed." }
  $remoteHead = (& git -C $temp rev-parse HEAD).Trim()
  $remotePrototype = Join-Path $temp "src/prototypes/proposal-intelligent-management"
  $remoteHook = Join-Path $temp "src/common/useHashPage.ts"
  if (-not (Test-Path (Join-Path $remotePrototype "index.tsx"))) { throw "GitHub does not contain a valid editable proposal source." }
  if (-not (Test-Path $remoteHook)) { throw "GitHub does not contain the required shared hook." }

  $staging = Join-Path $PrototypeRoot (".proposal-intelligent-management-incoming-" + [guid]::NewGuid())
  Assert-Within $staging $Workspace
  Copy-Item -LiteralPath $remotePrototype -Destination $staging -Recurse -Force
  if (-not (Test-Path (Join-Path $staging "index.tsx"))) { throw "Downloaded source validation failed." }

  New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
  if (Test-Path $Prototype) { Copy-Item -LiteralPath $Prototype -Destination (Join-Path $backupRoot "prototype") -Recurse -Force }
  if (Test-Path $SharedHook) { New-Item -ItemType Directory -Path (Join-Path $backupRoot "common") -Force | Out-Null; Copy-Item -LiteralPath $SharedHook -Destination (Join-Path $backupRoot "common/useHashPage.ts") -Force }

  Assert-Within $Prototype $Workspace
  if (Test-Path $Prototype) { Remove-Item -LiteralPath $Prototype -Recurse -Force }
  Move-Item -LiteralPath $staging -Destination $Prototype
  Copy-Item -LiteralPath $remoteHook -Destination $SharedHook -Force
  @{ remoteCommit = $remoteHead; syncedAt = (Get-Date).ToUniversalTime().ToString("o") } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $Workspace ".git/proposal-github-sync.json") -Encoding utf8
  Write-Output "Downloaded proposal editable source. Backup: $backupRoot  Commit: $remoteHead"
} finally {
  if (Test-Path $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
}
