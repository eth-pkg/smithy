#!/bin/bash

# Define main directory
MAIN_DIR="data/client-help"
mkdir -p "$MAIN_DIR"

# Define associative arrays
declare -A client_commands
declare -A version_commands
declare -A help_commands

client_commands=(
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

version_commands=(
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

help_commands=(
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

extract_version() {
  # Extracts the first version-like pattern: 1.2.3, 25.4.1, etc.
  # Removes leading 'v' and trailing '-stable' or any non-numeric suffix
  echo "$1" | grep -oE 'v?[0-9]+\.[0-9]+\.[0-9]+' | head -n1 | sed 's/^v//'
}

for client in "${!client_commands[@]}"; do
  command="${client_commands[$client]}"
  version_output=$($command ${version_commands[$client]})
  version_number=$(extract_version "$version_output")
  help_output=$($command ${help_commands[$client]})
  HELP_DIR="$MAIN_DIR/$client"
  HELP_FILE="$HELP_DIR/$client-$version_number.txt"
  mkdir -p "$HELP_DIR"
  if [[ ! -f "$HELP_FILE" ]]; then
    echo "$help_output" > "$HELP_FILE"
  fi
done
