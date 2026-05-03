#!/bin/bash

# Build, Tag, and Push Docker Images - Fresh Build (No Cache)
# This script performs a completely fresh Docker build with no cache and pushes to Docker Hub

set -e  # Exit on error

# Default values
IMAGE_TAG=${1:-"latest"}
DOCKERHUB_USERNAME=${2:-"eventcoresolutions"}
IMAGE_NAME=${3:-"eventcore-frontend"}
DOCKERFILE=${4:-"Dockerfile"}
ENV_FILE=${5:-".env.prod"}

FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}"
TAGGED_IMAGE_NAME="${FULL_IMAGE_NAME}:${IMAGE_TAG}"

get_env_file_value() {
    local name="$1"

    if [ ! -f "$ENV_FILE" ]; then
        return 0
    fi

    awk -F= -v key="$name" '
        $0 !~ /^[[:space:]]*#/ && $1 == key {
            sub(/^[^=]*=/, "", $0)
            print $0
            exit
        }
    ' "$ENV_FILE"
}

resolve_build_arg() {
    local name="$1"
    local env_value="${!name}"

    if [ -n "$env_value" ]; then
        printf '%s' "$env_value"
        return 0
    fi

    get_env_file_value "$name"
}

echo "========================================"
echo "Fresh Docker Build and Push Script"
echo "========================================"
echo ""

# Step 1: Remove existing images with the same tag (optional cleanup)
echo "Step 1: Cleaning up existing images..."
echo "Removing existing image: $TAGGED_IMAGE_NAME"
docker rmi "$TAGGED_IMAGE_NAME" 2>/dev/null || true

echo ""
echo "Step 2: Building fresh Docker image (no cache)..."
echo "Image: $TAGGED_IMAGE_NAME"
echo "Dockerfile: $DOCKERFILE"
echo ""

# Step 2: Build with --no-cache and --pull for completely fresh build
# This ensures:
# - No cached layers are used (--no-cache)
# - Base images are pulled fresh (--pull)
# - All assets/images in public/ folder are included
BUILD_ARGS=(
    docker build
    --no-cache
    --pull
    -f "$DOCKERFILE"
    -t "$TAGGED_IMAGE_NAME"
)

PUBLIC_BUILD_ARGS=(
    NEXT_PUBLIC_API_BASE_URL
    NEXT_PUBLIC_ROOT_DOMAIN
    NEXT_PUBLIC_SAAS_TENANT_ID
    NEXT_PUBLIC_APP_ENV
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
)

for arg_name in "${PUBLIC_BUILD_ARGS[@]}"; do
    arg_value="$(resolve_build_arg "$arg_name")"
    if [ -n "$arg_value" ]; then
        BUILD_ARGS+=(--build-arg "$arg_name=$arg_value")
    fi
done

if [ -z "$(resolve_build_arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)" ]; then
    echo "Warning: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY was not found in the environment or $ENV_FILE. Google Places will be disabled in this build."
fi

BUILD_ARGS+=(.)

echo "Running docker build with configured public build args"
"${BUILD_ARGS[@]}"

if [ $? -ne 0 ]; then
    echo ""
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Step 3: Verifying image was created..."
docker images "$TAGGED_IMAGE_NAME"

if [ $? -ne 0 ]; then
    echo ""
    echo "Failed to verify image!"
    exit 1
fi

echo ""
echo "Step 4: Pushing image to Docker Hub..."
echo "Pushing: $TAGGED_IMAGE_NAME"
docker push "$TAGGED_IMAGE_NAME"

if [ $? -ne 0 ]; then
    echo ""
    echo "Failed to push image to Docker Hub!"
    echo "Make sure you are logged in: docker login"
    exit 1
fi

echo ""
echo "========================================"
echo "Success! Fresh build completed and pushed to Docker Hub"
echo "Image: $TAGGED_IMAGE_NAME"
echo "========================================"

