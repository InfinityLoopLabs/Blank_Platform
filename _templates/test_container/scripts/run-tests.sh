#!/usr/bin/env bash
set -euo pipefail

PLATFORM_REPO_PATH="${PLATFORM_REPO_PATH:-/workspace/platform}"
TEMPLATE_REPO_PATH="${TEMPLATE_REPO_PATH:-/workspace/react_template}"
CONFIG_FILE_NAME="${CONFIG_FILE_NAME:-infinityloop.config.js}"
REPO1_URL="${REPO1_URL:-}"
REPO2_URL="${REPO2_URL:-}"

CLONED_BASE="/workspace/cloned"

log() {
  printf '[test-container] %s\n' "$1"
}

resolve_repo() {
  local local_path="$1"
  local repo_url="$2"
  local clone_path="$3"

  if [ -n "$repo_url" ]; then
    mkdir -p "$CLONED_BASE"
    if [ -d "$clone_path/.git" ]; then
      log "Pulling latest changes for $clone_path"
      git -C "$clone_path" pull --ff-only
    else
      log "Cloning $repo_url into $clone_path"
      git clone --depth 1 "$repo_url" "$clone_path"
    fi
    printf '%s\n' "$clone_path"
    return
  fi

  printf '%s\n' "$local_path"
}

assert_config_exists() {
  local repo_path="$1"
  local config_path="$repo_path/$CONFIG_FILE_NAME"

  if [ ! -f "$config_path" ]; then
    log "Missing required config file: $config_path"
    exit 1
  fi

  log "Config found: $config_path"
}

main() {
  local platform_repo
  local template_repo

  platform_repo="$(resolve_repo "$PLATFORM_REPO_PATH" "$REPO1_URL" "$CLONED_BASE/platform")"
  template_repo="$(resolve_repo "$TEMPLATE_REPO_PATH" "$REPO2_URL" "$CLONED_BASE/react_template")"

  log "Go version: $(go version)"
  log "Node version: $(node --version)"
  log "NPM version: $(npm --version)"

  assert_config_exists "$platform_repo"
  assert_config_exists "$template_repo"

  log "Building CLI library from $platform_repo"
  cd "$platform_repo"
  npm install
  npm run build --workspace cli

  log "Running CLI against platform repo config"
  node cli/dist/cli.js --cwd "$platform_repo"

  log "Running CLI against template repo config"
  node cli/dist/cli.js --cwd "$template_repo"

  log "All checks completed successfully."
}

main "$@"
