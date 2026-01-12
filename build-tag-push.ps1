# Build, Tag, and Push Docker Images - Tenant Frontend
# This script builds images with 'dev' tag, tags them as 'latest', and pushes both

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Tenant Frontend Docker Image (dev tag)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$imageName = "eventcoresolutions/eventcore-frontend"

# Step 1: Build image with dev tag using docker-compose
Write-Host "Building $imageName:dev" -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Tagging dev image as latest" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Step 2: Tag dev image as latest
Write-Host "Tagging $imageName:dev -> $imageName:latest" -ForegroundColor Yellow
docker tag "${imageName}:dev" "${imageName}:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to tag image" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Pushing images to Docker Hub (latest tag only)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Step 3: Push only latest tag (matching backend pattern)
Write-Host "Pushing $imageName:latest" -ForegroundColor Yellow
docker push "${imageName}:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push $imageName:latest" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Done! Tenant Frontend image built, tagged, and pushed." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

