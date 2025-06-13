#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="${script_dir}:${PATH}"

printf 'Added %s to PATH\n' "${script_dir}"
printf 'You can now use '\''smithy'\'' command from anywhere\n'
printf 'To make this permanent, add this line to your ~/.bashrc or ~/.zshrc:\n'
printf 'export PATH="%s:${PATH}"\n' "${script_dir}" 