$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Owner  = 'ItzMeShadow999'
$Repo   = 'CustomBadges'
$Branch = 'main'
$PluginFolder = 'customBadges'
$PluginName   = 'CustomBadges'

$PluginFiles = @(
    'index.tsx',
    'native.ts',
    'dashboard/types.ts',
    'dashboard/bridge.ts',
    'dashboard/button.ts',
    'dashboard/buttonRegistry.ts',
    'dashboard/dashboardView.ts',
    'dashboard/html.ts',
    'dashboard/wireSettings.ts'
)

function Step($m) { Write-Host ""; Write-Host "§ $m" -ForegroundColor Magenta }
function Info($m) { Write-Host "  ▸ $m" -ForegroundColor Gray }
function Ok($m)   { Write-Host "  ◆ $m" -ForegroundColor Green }
function Warn($m) { Write-Host "  ▪ $m" -ForegroundColor Yellow }
function Die($m)  { Write-Host "  ✖ $m" -ForegroundColor Red; throw $m }

function Test-Cmd($name) { [bool](Get-Command $name -ErrorAction SilentlyContinue) }

function Refresh-Path {
    $m = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $u = [Environment]::GetEnvironmentVariable('Path', 'User')
    $env:Path = "$m;$u"
}

function Run($exe, $argList) {
    & $exe @argList
    if ($LASTEXITCODE -ne 0) { Die "$exe $($argList -join ' ') failed (exit $LASTEXITCODE)" }
}

$SpinFrames = @('⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏')

function Draw-Spin($frame, $label, $text) {
    try { $w = [Console]::WindowWidth } catch { $w = 80 }
    if ($w -lt 40) { $w = 40 }
    $room = $w - 5 - $label.Length - 3
    if ($room -lt 1) { $text = '' }
    elseif ($text.Length -gt $room) { $text = $text.Substring(0, $room - 1) + '…' }
    $tail = if ($text) { " ▸ $text" } else { '' }
    Write-Host -NoNewline "`r  $frame " -ForegroundColor Magenta
    Write-Host -NoNewline (($label + $tail).PadRight($w - 5)) -ForegroundColor Gray
}

function Clear-Spin {
    try { $w = [Console]::WindowWidth } catch { $w = 80 }
    if ($w -lt 40) { $w = 40 }
    Write-Host -NoNewline ("`r" + (' ' * ($w - 1)) + "`r")
}

function Clean-Line($s) {
    $s = [regex]::Replace($s, '\x1b\[[0-9;?]*[ -/]*[@-~]', '')
    $s = $s -replace '[\r\t]', ' '
    ($s -replace '\s{2,}', ' ').Trim()
}

function Run-Quiet($label, $exe, $argList, $workDir) {
    if (-not $workDir) { $workDir = (Get-Location).ProviderPath }
    $quoted = @($argList | ForEach-Object { if ($_ -match '\s') { '"' + $_ + '"' } else { $_ } })
    $out = [IO.Path]::GetTempFileName()
    $err = [IO.Path]::GetTempFileName()
    $files = @($out, $err)

    $p = Start-Process -FilePath 'cmd.exe' -ArgumentList (@('/c', $exe) + $quoted) `
        -WorkingDirectory $workDir -NoNewWindow -PassThru `
        -RedirectStandardOutput $out -RedirectStandardError $err
    $null = $p.Handle

    $streams = @($null, $null)
    $readers = @($null, $null)
    $bufs    = @('', '')
    for ($k = 0; $k -lt 2; $k++) {
        try {
            $streams[$k] = [IO.File]::Open($files[$k], 'Open', 'Read', 'ReadWrite')
            $readers[$k] = New-Object IO.StreamReader($streams[$k])
        } catch { }
    }

    try { $width = [Console]::WindowWidth } catch { $width = 80 }
    if ($width -lt 40) { $width = 40 }
    try { [Console]::CursorVisible = $false } catch { }

    $last = ''
    $i = 0
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try {
        while ($true) {
            for ($k = 0; $k -lt 2; $k++) {
                if ($readers[$k]) {
                    $chunk = $readers[$k].ReadToEnd()
                    if ($chunk) {
                        $parts = @(($bufs[$k] + $chunk) -split "`n")
                        $bufs[$k] = $parts[$parts.Count - 1]
                        for ($j = 0; $j -lt $parts.Count - 1; $j++) {
                            $c = Clean-Line $parts[$j]
                            if ($c) { $last = $c }
                        }
                    }
                }
            }
            if ($p.HasExited) { break }

            $frame = $SpinFrames[$i % $SpinFrames.Count]
            $i++
            $room = $width - 5 - $label.Length - 3
            $text = $last
            if ($room -lt 1) { $text = '' }
            elseif ($text.Length -gt $room) { $text = $text.Substring(0, $room - 1) + '…' }
            $tail = if ($text) { " ▸ $text" } else { '' }
            Write-Host -NoNewline "`r  $frame " -ForegroundColor Magenta
            Write-Host -NoNewline (($label + $tail).PadRight($width - 5)) -ForegroundColor Gray
            Start-Sleep -Milliseconds 80
        }
        $p.WaitForExit()
    } finally {
        try { [Console]::CursorVisible = $true } catch { }
        Write-Host -NoNewline ("`r" + (' ' * ($width - 1)) + "`r")
        for ($k = 0; $k -lt 2; $k++) {
            if ($readers[$k]) { $readers[$k].Dispose() }
            if ($streams[$k]) { $streams[$k].Dispose() }
        }
    }

    $code = $p.ExitCode
    $secs = [math]::Round($sw.Elapsed.TotalSeconds, 1)
    if ($code -ne 0) {
        Warn "$label failed (exit $code). Last output:"
        foreach ($f in $files) {
            Get-Content $f -Tail 30 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
        }
        Remove-Item $files -Force -ErrorAction SilentlyContinue
        Die "$exe $($argList -join ' ') failed (exit $code)"
    }
    Remove-Item $files -Force -ErrorAction SilentlyContinue
    Ok "$label (${secs}s)"
}

function Ensure-WingetPackage($cmd, $id, $label) {
    if (Test-Cmd $cmd) { Ok "$label found"; return }
    if (-not (Test-Cmd 'winget')) { Die "$label is missing and winget is not available. Install $label manually and re-run." }
    Info "installing $label via winget"
    & winget install --id $id -e --silent --accept-package-agreements --accept-source-agreements
    Refresh-Path
    if (-not (Test-Cmd $cmd)) { Die "$label installed but not on PATH yet. Open a new PowerShell window and re-run." }
    Ok "$label installed"
}

$BannerArt = @'
   █████████                      █████                             ███████████                █████                          
  ███▒▒▒▒▒███                    ▒▒███                             ▒▒███▒▒▒▒▒███              ▒▒███                           
 ███     ▒▒▒  █████ ████  █████  ███████    ██████  █████████████   ▒███    ▒███  ██████    ███████   ███████  ██████   █████ 
▒███         ▒▒███ ▒███  ███▒▒  ▒▒▒███▒    ███▒▒███▒▒███▒▒███▒▒███  ▒██████████  ▒▒▒▒▒███  ███▒▒███  ███▒▒███ ███▒▒███ ███▒▒  
▒███          ▒███ ▒███ ▒▒█████   ▒███    ▒███ ▒███ ▒███ ▒███ ▒███  ▒███▒▒▒▒▒███  ███████ ▒███ ▒███ ▒███ ▒███▒███████ ▒▒█████ 
▒▒███     ███ ▒███ ▒███  ▒▒▒▒███  ▒███ ███▒███ ▒███ ▒███ ▒███ ▒███  ▒███    ▒███ ███▒▒███ ▒███ ▒███ ▒███ ▒███▒███▒▒▒   ▒▒▒▒███
 ▒▒█████████  ▒▒████████ ██████   ▒▒█████ ▒▒██████  █████▒███ █████ ███████████ ▒▒████████▒▒████████▒▒███████▒▒██████  ██████ 
  ▒▒▒▒▒▒▒▒▒    ▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒     ▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒▒▒▒ ▒▒▒ ▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒███ ▒▒▒▒▒▒  ▒▒▒▒▒▒  
                                                                                                     ███ ▒███                 
                                                                                                    ▒▒██████                  
                                                                                                     ▒▒▒▒▒▒                   
'@

function Enable-VT {
    try {
        Add-Type -Namespace CB -Name Con -MemberDefinition @'
[DllImport("kernel32.dll")] public static extern IntPtr GetStdHandle(int h);
[DllImport("kernel32.dll")] public static extern bool GetConsoleMode(IntPtr h, out int m);
[DllImport("kernel32.dll")] public static extern bool SetConsoleMode(IntPtr h, int m);
'@
        $h = [CB.Con]::GetStdHandle(-11)
        $m = 0
        if ([CB.Con]::GetConsoleMode($h, [ref]$m)) { return [CB.Con]::SetConsoleMode($h, ($m -bor 4)) }
        return $false
    } catch { return $false }
}

function Get-Blurple($t) {
    $stops = @(@(71, 82, 196), @(88, 101, 242), @(124, 140, 248), @(165, 176, 255))
    $t = [math]::Max(0, [math]::Min(1, $t))
    $s = $t * ($stops.Count - 1)
    $i = [math]::Min([int][math]::Floor($s), $stops.Count - 2)
    $f = $s - $i
    $a = $stops[$i]
    $b = $stops[$i + 1]
    return @(
        [int]($a[0] + ($b[0] - $a[0]) * $f),
        [int]($a[1] + ($b[1] - $a[1]) * $f),
        [int]($a[2] + ($b[2] - $a[2]) * $f)
    )
}

function Show-Banner {
    $lines = @($BannerArt -split "`r?`n" | Where-Object { $_.Length -gt 0 })
    $max = ($lines | Measure-Object -Property Length -Maximum).Maximum
    try { $w = [Console]::WindowWidth } catch { $w = 120 }
    if ($w -lt ($max + 1)) {
        Write-Host "◆ CustomBadges" -ForegroundColor Magenta
        return
    }
    if (-not (Enable-VT)) {
        for ($row = 0; $row -lt $lines.Count; $row++) {
            $color = if ($row -lt 7) { 'Blue' } else { 'DarkBlue' }
            Write-Host $lines[$row] -ForegroundColor $color
        }
        return
    }
    $esc = [char]27
    $rows = $lines.Count
    for ($row = 0; $row -lt $rows; $row++) {
        $line = $lines[$row].PadRight($max)
        $sb = New-Object System.Text.StringBuilder
        $lastQ = -1
        for ($c = 0; $c -lt $line.Length; $c++) {
            $ch = $line[$c]
            if ($ch -eq ' ') { [void]$sb.Append(' '); continue }
            $t = ($c / $max) * 0.85 + ($row / $rows) * 0.15
            $q = [int][math]::Round($t * 24)
            if ($q -ne $lastQ) {
                $rgb = Get-Blurple ($q / 24)
                [void]$sb.Append("$esc[38;2;$($rgb[0]);$($rgb[1]);$($rgb[2])m")
                $lastQ = $q
            }
            [void]$sb.Append($ch)
        }
        [void]$sb.Append("$esc[0m")
        Write-Host $sb.ToString()
    }
}

Write-Host ""
Show-Banner
Write-Host ""
Write-Host "◆ CustomBadges installer" -ForegroundColor Magenta
Write-Host "  Third-party plugin. Client mods are against Discord's ToS, use at your own risk." -ForegroundColor DarkGray

Step "Choose client"
$client = $env:CB_CLIENT
if (-not $client) {
    Write-Host "  [1] Vencord"
    Write-Host "  [2] Equicord"
    $pick = Read-Host "  Select 1 or 2"
    $client = if ($pick -eq '2') { 'equicord' } else { 'vencord' }
}
$client = $client.ToLower()
switch ($client) {
    'vencord'  { $ClientName = 'Vencord';  $RepoUrl = 'https://github.com/Vendicated/Vencord' }
    'equicord' { $ClientName = 'Equicord'; $RepoUrl = 'https://github.com/Equicord/Equicord' }
    default    { Die "Unknown client '$client'. Use vencord or equicord." }
}
Ok $ClientName

Step "Choose version"
$variant = $env:CB_VARIANT
if (-not $variant) {
    Write-Host "  [1] Dashboard : sidebar dashboard + click popup (DOM injection)"
    Write-Host "  [2] React     : native Vencord BadgeAPI, no DOM injection, settings tab only"
    $pick = Read-Host "  Select 1 or 2"
    $variant = if ($pick -eq '2') { 'react' } else { 'main' }
}
switch ($variant.ToLower()) {
    'react' {
        $Branch = 'CustomBadges-React'
        $PluginFiles = @('index.tsx', 'native.ts')
        $VariantLabel = 'React'
    }
    { $_ -in 'main', 'dashboard' } {
        $VariantLabel = 'Dashboard'
    }
    default { Die "Unknown version '$variant'. Use main or react." }
}
Ok "$VariantLabel (branch: $Branch)"

Step "Prerequisites"
Ensure-WingetPackage 'git'  'Git.Git'            'Git'
Ensure-WingetPackage 'node' 'OpenJS.NodeJS.LTS'  'Node.js'
if (-not (Test-Cmd 'pnpm')) {
    Info "installing pnpm"
    & npm install -g pnpm
    Refresh-Path
    if (-not (Test-Cmd 'pnpm')) { Die "pnpm install failed. Run: npm install -g pnpm" }
}
Ok "pnpm found"

Step "Source"
$dir = $env:CB_DIR
$hasSource = $false
if ($env:CB_YES -eq '1') {
    if ($dir -and (Test-Path (Join-Path $dir 'package.json'))) { $hasSource = $true }
} else {
    $a = Read-Host "  Do you already have $ClientName built from source (cloned from GitHub, not the installer)? [y/N]"
    if ($a -match '^(y|yes)$') { $hasSource = $true }
}

if ($hasSource) {
    if (-not $dir) {
        Write-Host "  Enter the path to your $ClientName folder (repo root, its src folder, or src\userplugins)" -ForegroundColor DarkGray
        $dir = Read-Host "  Path"
        if (-not $dir) { Die "No path given." }
    }
    $dir = $dir.Trim().Trim('"').TrimEnd('\', '/')
    $leaf = Split-Path $dir -Leaf
    if ($leaf -ieq 'userplugins') { $dir = Split-Path (Split-Path $dir -Parent) -Parent }
    elseif ($leaf -ieq 'src')     { $dir = Split-Path $dir -Parent }
    if (-not (Test-Path (Join-Path $dir 'package.json')) -or -not (Test-Path (Join-Path $dir 'src'))) {
        Die "$dir does not look like a $ClientName source folder (package.json or src missing)."
    }
    Ok "using existing source at $dir"
} else {
    if (-not $dir) {
        $default = Join-Path $env:USERPROFILE $ClientName
        if ($env:CB_YES -eq '1') {
            $dir = $default
        } else {
            $dir = Read-Host "  Where should $ClientName be cloned? Enter a folder path (blank = $default)"
            if (-not $dir) { $dir = $default }
        }
    }
    $dir = $dir.Trim().Trim('"').TrimEnd('\', '/')
    if (Test-Path (Join-Path $dir '.git')) {
        Info "existing clone at $dir, pulling latest"
        Push-Location $dir
        try { Run-Quiet 'Updating source' 'git' @('pull', '--ff-only') $dir } finally { Pop-Location }
    } elseif (Test-Path $dir) {
        Die "$dir exists but is not a git repo. Set `$env:CB_DIR to another path or remove it."
    } else {
        Info "cloning $ClientName into $dir"
        Run-Quiet "Cloning $ClientName" 'git' @('clone', $RepoUrl, $dir)
    }
    Ok $dir
}

Step "Plugin files"
$pluginDir = Join-Path $dir "src\userplugins\$PluginFolder"
New-Item -ItemType Directory -Force -Path $pluginDir | Out-Null

$prefix = ''
try {
    $tree = Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repo/git/trees/${Branch}?recursive=1" -Headers @{ 'User-Agent' = 'CustomBadges-Installer' }
    $idx = $tree.tree | Where-Object { $_.type -eq 'blob' -and $_.path -match '(^|/)index\.tsx$' } | Sort-Object { $_.path.Length } | Select-Object -First 1
    if ($idx -and $idx.path -match '/') { $prefix = ($idx.path -replace '[^/]+$', '') }
    if ($prefix) { Info "plugin root in repo: $prefix" }
} catch {
    Warn "could not read repo tree, assuming files are at repo root"
}

$base = "https://raw.githubusercontent.com/$Owner/$Repo/$Branch/$prefix"
$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'CustomBadges-Installer')
$sw = [Diagnostics.Stopwatch]::StartNew()
$total = $PluginFiles.Count
$n = 0
$i = 0
try { [Console]::CursorVisible = $false } catch { }
try {
    foreach ($f in $PluginFiles) {
        $n++
        $dest = Join-Path $pluginDir ($f -replace '/', '\')
        New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
        $task = $wc.DownloadFileTaskAsync("$base$f", $dest)
        do {
            Draw-Spin $SpinFrames[$i % $SpinFrames.Count] "Downloading ($n/$total)" $f
            $i++
            Start-Sleep -Milliseconds 60
        } while (-not $task.IsCompleted)
        if ($task.IsFaulted -or $task.IsCanceled) {
            Clear-Spin
            Die "failed to download $f"
        }
    }
} finally {
    try { [Console]::CursorVisible = $true } catch { }
    Clear-Spin
    $wc.Dispose()
}
$secs = [math]::Round($sw.Elapsed.TotalSeconds, 1)
Ok "Plugin files ($total files, ${secs}s) copied to $pluginDir"
if ($VariantLabel -eq 'React' -and (Test-Path (Join-Path $pluginDir 'dashboard'))) {
    Warn "old dashboard folder found in $pluginDir. The React version does not use it, safe to delete."
}

Step "Discord"
$procs = Get-Process -Name 'Discord', 'DiscordPTB', 'DiscordCanary', 'DiscordDevelopment' -ErrorAction SilentlyContinue
if ($procs) {
    $close = $true
    if ($env:CB_YES -ne '1') {
        $a = Read-Host "  Discord is running. Close it now? [Y/n]"
        if ($a -match '^(n|no)$') { $close = $false }
    }
    if ($close) {
        $procs | Stop-Process -Force
        Start-Sleep -Seconds 2
        Ok "Discord closed"
    } else {
        Warn "leaving Discord open, restart it manually after inject"
    }
} else {
    Ok "Discord not running"
}

Step "Build"
Push-Location $dir
try {
    Run-Quiet 'Installing dependencies' 'pnpm' @('install') $dir
    Run-Quiet 'Building' 'pnpm' @('build') $dir

    Step "Inject"
    $doInject = $true
    if ($hasSource -and $env:CB_YES -ne '1') {
        $s = Read-Host "  Already injected into Discord? Skip inject [y/N]"
        if ($s -match '^(y|yes)$') { $doInject = $false }
    }
    if ($doInject) {
        Info "pick your Discord install when prompted"
        Run 'pnpm' @('inject')
        Ok "inject complete"
    } else {
        Ok "inject skipped"
    }
} finally {
    Pop-Location
}

Step "Enable plugin"
try {
    $settingsDir  = Join-Path $env:APPDATA "$ClientName\settings"
    $settingsFile = Join-Path $settingsDir 'settings.json'
    New-Item -ItemType Directory -Force -Path $settingsDir | Out-Null

    if (Test-Path $settingsFile) {
        $json = Get-Content $settingsFile -Raw | ConvertFrom-Json
    } else {
        $json = [pscustomobject]@{}
    }
    if (-not $json.PSObject.Properties['plugins']) {
        $json | Add-Member -NotePropertyName plugins -NotePropertyValue ([pscustomobject]@{})
    }
    if (-not $json.plugins.PSObject.Properties[$PluginName]) {
        $json.plugins | Add-Member -NotePropertyName $PluginName -NotePropertyValue ([pscustomobject]@{ enabled = $true })
    } elseif (-not $json.plugins.$PluginName.PSObject.Properties['enabled']) {
        $json.plugins.$PluginName | Add-Member -NotePropertyName enabled -NotePropertyValue $true
    } else {
        $json.plugins.$PluginName.enabled = $true
    }
    $json | ConvertTo-Json -Depth 32 | Set-Content -Path $settingsFile -Encoding UTF8
    Ok "$PluginName enabled in $settingsFile"
} catch {
    Warn "could not auto-enable. Open $ClientName Settings > Plugins and enable $PluginName."
}

Step "Launch"
$update = Join-Path $env:LOCALAPPDATA 'Discord\Update.exe'
if (Test-Path $update) {
    Start-Process $update -ArgumentList '--processStart', 'Discord.exe'
    Ok "Discord launched"
} else {
    Warn "start Discord manually"
}

Write-Host ""
Write-Host "◆ Done." -ForegroundColor Magenta
Write-Host "  ▸ In Discord press Ctrl+R if the plugin does not show up yet." -ForegroundColor Gray
Write-Host "  ▸ Open the plugin settings and click Verify Discord Account to get your session token." -ForegroundColor Gray
Write-Host ""
