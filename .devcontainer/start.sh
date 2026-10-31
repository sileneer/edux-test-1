#!/usr/bin/env bash
# Runs each time the Codespace opens, and when an attendee types `edux`.

cd "$(dirname "$(readlink -f "$0")")/.." || exit 1

opencode service start >/dev/null 2>&1

# Website preview on port 3000.
if ! curl -s -o /dev/null -m 2 http://127.0.0.1:3000/; then
  nohup serve --no-port-switching -l 3000 . >/dev/null 2>&1 &
fi

# A session with one message appears on the OpenCode home page, which gives
# attendees one click into this project.
if [ ! -f ~/.edux-ready ]; then
  echo "Getting OpenCode ready..."
  timeout 90 opencode run "Welcome me to my EduX project in one short, friendly sentence." >/dev/null 2>&1 \
    && touch ~/.edux-ready
fi

public_url="${EDUX_PUBLIC_URL:-https://${CODESPACE_NAME}-4096.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}}"

echo
echo "=============================================================="
echo "  Open the link below to start OpenCode."
echo "  It works once and lasts 5 minutes."
echo "  Need a new link? Type:  edux"
echo "=============================================================="
opencode pair --url "$public_url"
