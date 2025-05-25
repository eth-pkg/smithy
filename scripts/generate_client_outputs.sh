#!/usr/bin/env bash
#
# Generate help outputs for Ethereum clients and their validator implementations
# This script collects version and help information from various Ethereum clients
# and stores them in organized directories for documentation purposes.
#
# Usage: ./generate_client_outputs.sh
#
# Exit codes:
#   0 - Success
#   1 - General error
#   2 - Command not found
#   3 - Permission denied
#   4 - Invalid version format

set -euo pipefail
IFS=$'\n\t'

readonly SCRIPT_NAME="${0##*/}"
readonly CLIENT_HELP_DIR="data/client-help"
readonly VALIDATOR_HELP_DIR="data/client-help"

log_info() {
    echo "[INFO] $*" >&2
}

log_error() {
    echo "[ERROR] $*" >&2
}

handle_error() {
    local exit_code=$1
    local error_message=$2
    log_error "$error_message"
    exit "$exit_code"
}

check_command() {
    local cmd=$1
    if ! command -v "$cmd" >/dev/null 2>&1; then
        handle_error 2 "Command '$cmd' not found. Please install it first."
    fi
}

extract_version() {
    local output=$1
    local version
    version=$(echo "$output" | grep -oE 'v?[0-9]+\.[0-9]+\.[0-9]+' | head -n1 | sed 's/^v//')
    if [[ -z "$version" ]]; then
        handle_error 4 "Could not extract version from output: $output"
    fi
    echo "$version"
}

safe_execute() {
    local cmd=$1
    local output
    if ! output=$(bash -c "$cmd" 2>&1); then
        handle_error 1 "Failed to execute command: $cmd"
    fi
    echo "$output"
}

create_directories() {
    mkdir -p "$CLIENT_HELP_DIR" "$VALIDATOR_HELP_DIR" || handle_error 3 "Failed to create output directories"
}

declare -A CLIENT_COMMANDS=(
    [besu]="besu"
    [erigon]="erigon"
    [geth]="geth"
    [lighthouse]="lighthouse"
    [lodestar]="lodestar"
    [nethermind]="nethermind"
    [nimbus-eth2]="nimbus_beacon_node"
    [prysm]="beacon-chain"
    [teku]="teku"
    [reth]="reth"
)

declare -A VERSION_COMMANDS=(
    [besu]="--version"
    [erigon]="--version"
    [geth]="--version"
    [lighthouse]="--version"
    [lodestar]="--version"
    [nethermind]="--version"
    [nimbus-eth2]="--version"
    [prysm]="--version"
    [teku]="--version"
    [reth]="--version"
)

declare -A HELP_COMMANDS=(
    [besu]="--help"
    [erigon]="--help"
    [geth]="--help"
    [lighthouse]="beacon --help"
    [lodestar]="beacon --help"
    [nethermind]="--help"
    [nimbus-eth2]="--help"
    [prysm]="--help"
    [teku]="beacon --help"
    [reth]="node --help"
)

declare -A VALIDATOR_COMMANDS=(
    [lighthouse]="lighthouse validator --help"
    [lodestar]="lodestar validator --help"
    [nimbus-eth2]="/usr/lib/eth-node-nimbus-eth2/bin/nimbus_validator_client --help"
    [prysm]="/usr/lib/eth-node-prysm/bin/validator --help"
    [teku]="teku validator-client --help"
)

main() {
    log_info "Starting $SCRIPT_NAME"
    create_directories

    for client in "${!CLIENT_COMMANDS[@]}"; do
        log_info "Processing client: $client"
        check_command "${CLIENT_COMMANDS[$client]}"
        
        local version_output
        version_output=$(safe_execute "${CLIENT_COMMANDS[$client]} ${VERSION_COMMANDS[$client]}")
        local version_number
        version_number=$(extract_version "$version_output")
        
        local help_output
        help_output=$(safe_execute "${CLIENT_COMMANDS[$client]} ${HELP_COMMANDS[$client]}")
        local help_dir="$CLIENT_HELP_DIR/$client"
        local help_file="$help_dir/$client-$version_number.txt"
        
        mkdir -p "$help_dir"
        if [[ ! -f "$help_file" ]]; then
            echo "$help_output" > "$help_file"
            log_info "Generated client help output: $help_file"
        fi
        
        if [[ -n "${VALIDATOR_COMMANDS[$client]:-}" ]]; then
            local validator_output
            validator_output=$(safe_execute "${VALIDATOR_COMMANDS[$client]}")
            local validator_help_dir="$VALIDATOR_HELP_DIR/$client"
            local validator_help_file="$validator_help_dir/$client-validator-$version_number.txt"
            
            mkdir -p "$validator_help_dir"
            if [[ ! -f "$validator_help_file" ]]; then
                echo "$validator_output" > "$validator_help_file"
                log_info "Generated validator help output: $validator_help_file"
            fi
        fi
    done
    
    log_info "Script completed successfully"
}

main
