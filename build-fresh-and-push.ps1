# Build, Tag, and Push Docker Images - Fresh Build (No Cache)
# This script performs a completely fresh Docker build with no cache and pushes to Docker Hub

param(
    [string]$ImageTag = "latest",
    [string]$DockerHubUsername = "eventcoresolutions",
    [string]$ImageName = "eventcore-frontend",
    [string]$Dockerfile = "Dockerfile"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fresh Docker Build and Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$fullImageName = "${DockerHubUsername}/${ImageName}"
$taggedImageName = "${fullImageName}:${ImageTag}"

# Step 1: Remove existing images with the same tag (optional cleanup)
Write-Host "Step 1: Cleaning up existing images (if any)..." -ForegroundColor Yellow
Write-Host "Checking for existing image: $taggedImageName" -ForegroundColor Gray
$imageExists = docker images $taggedImageName --format "{{.Repository}}:{{.Tag}}" 2>$null | Select-String -Pattern $taggedImageName
if ($imageExists) {
    Write-Host "Removing existing image: $taggedImageName" -ForegroundColor Gray
    docker rmi $taggedImageName 2>$null
} else {
    Write-Host "No existing image found (first-time build)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Step 2: Building fresh Docker image (no cache)..." -ForegroundColor Yellow
Write-Host "Image: $taggedImageName" -ForegroundColor Gray
Write-Host "Dockerfile: $Dockerfile" -ForegroundColor Gray
Write-Host ""

# Step 2: Build with --no-cache and --pull for completely fresh build
# This ensures:
# - No cached layers are used (--no-cache)
# - Base images are pulled fresh (--pull)
# - All assets/images in public/ folder are included
$buildArgs = @(
    "build",
    "--no-cache",
    "--pull",
    "-f", $Dockerfile,
    "-t", $taggedImageName,
    "."
)

Write-Host "Running: docker $($buildArgs -join ' ')" -ForegroundColor Gray
docker $buildArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Verifying image was created..." -ForegroundColor Yellow
docker images $taggedImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Failed to verify image!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Pushing image to Docker Hub..." -ForegroundColor Yellow
Write-Host "Pushing: $taggedImageName" -ForegroundColor Gray
docker push $taggedImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Failed to push image to Docker Hub!" -ForegroundColor Red
    Write-Host "Make sure you are logged in: docker login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Success! Fresh build completed and pushed to Docker Hub" -ForegroundColor Green
Write-Host "Image: $taggedImageName" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

