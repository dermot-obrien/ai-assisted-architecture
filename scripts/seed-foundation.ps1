# SPDX-FileCopyrightText: 2026 Dermot O'Brien
# SPDX-License-Identifier: Apache-2.0

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("core", "integration", "infrastructure", "all", "foundation")]
    [string[]]$Profile = @("core"),

    [Parameter(Mandatory = $false)]
    [string]$WorkspaceRoot = (Get-Location).Path,

    [Parameter(Mandatory = $false)]
    [switch]$Force,

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-AbsPath {
    param([string]$PathValue)
    return [System.IO.Path]::GetFullPath($PathValue)
}

function Get-ProfileIncludes {
    param(
        [string]$ProfileFilePath,
        [string]$SectionName
    )

    if (-not (Test-Path $ProfileFilePath)) {
        throw "Profile file not found: $ProfileFilePath"
    }

    $lines = Get-Content -Path $ProfileFilePath
    $inIncludes = $false
    $activeSection = ""
    $values = @()

    foreach ($line in $lines) {
        $trim = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trim) -or $trim.StartsWith("#")) {
            continue
        }

        if ($trim -eq "includes:") {
            $inIncludes = $true
            $activeSection = ""
            continue
        }

        if (-not $inIncludes) {
            continue
        }

        if ($trim -match "^[a-zA-Z_]+:\s*$") {
            $activeSection = $trim.TrimEnd(":")
            continue
        }

        if ($trim -match "^- (.+)$" -and $activeSection -eq $SectionName) {
            $values += $Matches[1].Trim()
            continue
        }
    }

    return ,$values
}

function Copy-SeedItem {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [bool]$IsDirectory
    )

    if (-not (Test-Path $SourcePath)) {
        Write-Warning "Missing seed source: $SourcePath"
        return
    }

    if ((Test-Path $DestinationPath) -and -not $Force) {
        Write-Host "Skip existing: $DestinationPath"
        return
    }

    if ($DryRun) {
        Write-Host "[DryRun] Copy $SourcePath -> $DestinationPath"
        return
    }

    $destParent = Split-Path -Parent $DestinationPath
    if (-not [string]::IsNullOrWhiteSpace($destParent)) {
        New-Item -ItemType Directory -Force -Path $destParent | Out-Null
    }

    if ($IsDirectory -and (Test-Path $DestinationPath) -and $Force) {
        Remove-Item -Path $DestinationPath -Recurse -Force
    }

    if ($IsDirectory) {
        Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force
    } else {
        Copy-Item -Path $SourcePath -Destination $DestinationPath -Force
    }
}

$frameworkRoot = Resolve-AbsPath (Join-Path $PSScriptRoot "..")
$foundationRoot = Join-Path $frameworkRoot "foundation"
$workspaceRootAbs = Resolve-AbsPath $WorkspaceRoot

if (-not (Test-Path $foundationRoot)) {
    throw "Foundation folder not found at: $foundationRoot"
}

if (-not (Test-Path $workspaceRootAbs)) {
    throw "Workspace root not found: $workspaceRootAbs"
}

if ($workspaceRootAbs -eq $frameworkRoot) {
    throw "Workspace root points to framework root. Run this script from a workspace, not from .ai-assisted-architecture."
}

$selectedProfiles = @()
if (($Profile -contains "all") -or ($Profile -contains "foundation")) {
    $selectedProfiles = @("core", "integration", "infrastructure")
} else {
    $selectedProfiles = $Profile | Select-Object -Unique
}

Write-Host "Framework root: $frameworkRoot"
Write-Host "Workspace root: $workspaceRootAbs"
Write-Host ("Profiles: " + ($selectedProfiles -join ", "))
if ($DryRun) {
    Write-Host "Mode: DryRun"
} elseif ($Force) {
    Write-Host "Mode: Force overwrite"
}

$capabilityIds = @()
$abbIds = @()
$sbbIds = @()

foreach ($profileName in $selectedProfiles) {
    $profilePath = Join-Path $foundationRoot ("profiles/{0}/profile.yaml" -f $profileName)
    if (-not (Test-Path $profilePath)) {
        Write-Warning "Profile not found: $profileName ($profilePath)"
        continue
    }

    $capabilityIds += Get-ProfileIncludes -ProfileFilePath $profilePath -SectionName "capabilities"
    $abbIds += Get-ProfileIncludes -ProfileFilePath $profilePath -SectionName "architecture_building_blocks"
    $sbbIds += Get-ProfileIncludes -ProfileFilePath $profilePath -SectionName "solution_building_blocks"
}

$capabilityIds = $capabilityIds | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique
$abbIds = $abbIds | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique
$sbbIds = $sbbIds | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique

$workspaceCapabilitiesRoot = Join-Path $workspaceRootAbs "capabilities"
$workspaceAbbRoot = Join-Path $workspaceRootAbs "building-blocks/architecture-building-blocks"
$workspaceSbbRoot = Join-Path $workspaceRootAbs "building-blocks/solution-building-blocks"

if (-not $DryRun) {
    New-Item -ItemType Directory -Force -Path $workspaceCapabilitiesRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $workspaceAbbRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $workspaceSbbRoot | Out-Null
}

# Copy canonical capability registry files and diagrams from foundation seed.
$foundationCapabilitiesRoot = Join-Path $foundationRoot "capabilities"
$seedCapabilityFiles = @(
    "capability-model.md",
    "capability-hierarchy.csv",
    "capability-abb-mapping.csv",
    "README.md"
)

foreach ($fileName in $seedCapabilityFiles) {
    Copy-SeedItem `
        -SourcePath (Join-Path $foundationCapabilitiesRoot $fileName) `
        -DestinationPath (Join-Path $workspaceCapabilitiesRoot $fileName) `
        -IsDirectory $false
}

Copy-SeedItem `
    -SourcePath (Join-Path $foundationCapabilitiesRoot "diagrams") `
    -DestinationPath (Join-Path $workspaceCapabilitiesRoot "diagrams") `
    -IsDirectory $true

foreach ($capId in $capabilityIds) {
    Copy-SeedItem `
        -SourcePath (Join-Path $foundationCapabilitiesRoot $capId) `
        -DestinationPath (Join-Path $workspaceCapabilitiesRoot $capId) `
        -IsDirectory $true
}

$foundationAbbRoot = Join-Path $foundationRoot "building-blocks/architecture-building-blocks"
foreach ($abbId in $abbIds) {
    Copy-SeedItem `
        -SourcePath (Join-Path $foundationAbbRoot $abbId) `
        -DestinationPath (Join-Path $workspaceAbbRoot $abbId) `
        -IsDirectory $true
}

$foundationSbbRoot = Join-Path $foundationRoot "building-blocks/solution-building-blocks"
foreach ($sbbId in $sbbIds) {
    Copy-SeedItem `
        -SourcePath (Join-Path $foundationSbbRoot $sbbId) `
        -DestinationPath (Join-Path $workspaceSbbRoot $sbbId) `
        -IsDirectory $true
}

$workspaceManifestSource = Join-Path $foundationRoot "workspace-manifest.example.yaml"
$workspaceManifestDest = Join-Path $workspaceRootAbs "foundation-workspace.yaml"
Copy-SeedItem -SourcePath $workspaceManifestSource -DestinationPath $workspaceManifestDest -IsDirectory $false

Write-Host ""
Write-Host "Seed complete."
Write-Host ("Copied capabilities: " + (@($capabilityIds).Count))
Write-Host ("Copied ABBs: " + (@($abbIds).Count))
Write-Host ("Copied SBBs: " + (@($sbbIds).Count))
Write-Host "Workspace content is canonical. Framework foundation is fallback/read-only."
