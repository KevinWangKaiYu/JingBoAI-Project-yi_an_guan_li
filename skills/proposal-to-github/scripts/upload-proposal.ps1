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
$Prototype = Join-Path $Workspace "src/prototypes/proposal-intelligent-management"
$SharedHook = Join-Path $Workspace "src/common/useHashPage.ts"
$LocalSkills = Join-Path $HOME ".codex/skills"
$SyncSkills = @("proposal-to-github", "github-to-proposal")
if (-not (Test-Path (Join-Path $Prototype "index.tsx"))) { throw "Proposal prototype source was not found: $Prototype" }
if (-not (Test-Path $SharedHook)) { throw "Shared dependency was not found: $SharedHook" }
foreach ($skill in $SyncSkills) { if (-not (Test-Path (Join-Path $LocalSkills "$skill/SKILL.md"))) { throw "Required sync skill was not found: $skill" } }

$statePath = Join-Path $Workspace ".git/proposal-github-sync.json"
$temp = Join-Path $env:TEMP ("proposal-github-upload-" + [guid]::NewGuid())
$GitProxy = Get-SystemHttpsProxy
try {
  if ($GitProxy) { & git -c "http.proxy=$GitProxy" -c core.autocrlf=false clone --quiet --depth 1 --branch main $Repository $temp } else { & git -c core.autocrlf=false clone --quiet --depth 1 --branch main $Repository $temp }
  if ($LASTEXITCODE -ne 0) { throw "GitHub clone failed." }
  & git -C $temp config core.autocrlf false
  if ($GitProxy) { & git -C $temp config http.proxy $GitProxy }
  $remoteHead = (& git -C $temp rev-parse HEAD).Trim()
  if (Test-Path $statePath) {
    $state = Get-Content -Raw $statePath | ConvertFrom-Json
    if ($state.remoteCommit -and $state.remoteCommit -ne $remoteHead) { throw "GitHub has newer proposal changes. Run github-to-proposal before uploading from this computer." }
  }

  Get-ChildItem -LiteralPath $temp -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object { Assert-Within $_.FullName $temp; Remove-Item -LiteralPath $_.FullName -Recurse -Force }
  $remotePrototype = Join-Path $temp "src/prototypes/proposal-intelligent-management"
  $remoteHook = Join-Path $temp "src/common/useHashPage.ts"
  New-Item -ItemType Directory -Path (Split-Path $remotePrototype) -Force | Out-Null
  Copy-Item -LiteralPath $Prototype -Destination $remotePrototype -Recurse -Force
  New-Item -ItemType Directory -Path (Split-Path $remoteHook) -Force | Out-Null
  Copy-Item -LiteralPath $SharedHook -Destination $remoteHook -Force
  $remoteSkills = Join-Path $temp "skills"
  New-Item -ItemType Directory -Path $remoteSkills -Force | Out-Null
  foreach ($skill in $SyncSkills) { Copy-Item -LiteralPath (Join-Path $LocalSkills $skill) -Destination (Join-Path $remoteSkills $skill) -Recurse -Force }
  $downloads = Join-Path $temp "downloads"
  New-Item -ItemType Directory -Path $downloads -Force | Out-Null
  Compress-Archive -LiteralPath @((Join-Path $remoteSkills "proposal-to-github"), (Join-Path $remoteSkills "github-to-proposal")) -DestinationPath (Join-Path $downloads "proposal-github-sync-skills.zip") -Force
  @{ schema = 2; project = "proposal-intelligent-management"; source = "src/prototypes/proposal-intelligent-management"; sharedDependency = "src/common/useHashPage.ts"; skills = @("skills/proposal-to-github", "skills/github-to-proposal"); download = "downloads/proposal-github-sync-skills.zip"; uploadedAt = (Get-Date).ToUniversalTime().ToString("o") } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $temp "proposal-sync-manifest.json") -Encoding utf8

  & git -C $temp add --all
  if (-not (& git -C $temp status --porcelain)) { Write-Output "No proposal source changes to upload."; exit 0 }
  & git -C $temp config user.name "KevinWangKaiYu"
  & git -C $temp config user.email "KevinWangKaiYu@users.noreply.github.com"
  & git -C $temp commit --quiet -m "sync: update proposal editable source"
  if ($LASTEXITCODE -ne 0) { throw "Git commit failed. Configure git user.name and user.email, then retry." }
  & git -C $temp push --porcelain origin main:main
  if ($LASTEXITCODE -ne 0) { throw "GitHub push failed. Remote changes were not overwritten." }
  $pushedHead = (& git -C $temp rev-parse HEAD).Trim()
  @{ remoteCommit = $pushedHead; syncedAt = (Get-Date).ToUniversalTime().ToString("o") } | ConvertTo-Json | Set-Content -LiteralPath $statePath -Encoding utf8
  Write-Output "Uploaded proposal editable source. Commit: $pushedHead"
} finally {
  if (Test-Path $temp) { Remove-Item -LiteralPath $temp -Recurse -Force }
}
