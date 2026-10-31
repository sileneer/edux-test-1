#!/usr/bin/env bash
# Runs once, when the Codespace is created.
set -e

npm install -g @opencode/cli@2.2.4 serve@14.2.6

# Sessions started outside the project ignore project config, so set the safe
# free model globally as well.
mkdir -p ~/.config/opencode
cp opencode.json ~/.config/opencode/opencode.json

# The forwarded port is private to the attendee's GitHub account, so a fixed
# password here is only a fallback for the sign-in link.
opencode service set port 4096
opencode service set password edux

# `edux` prints a fresh sign-in link.
chmod +x .devcontainer/start.sh
sudo ln -sf "$PWD/.devcontainer/start.sh" /usr/local/bin/edux
