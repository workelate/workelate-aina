#!/usr/bin/env bash
# PostToolUse hook on Edit/Write for site/** — the receipt mechanism
cd "$(dirname "$0")/../.." || exit 0
npm run -s verify || {
  echo "VERIFY FAILED — fix before proceeding. Do not move to the next section."
  exit 2   # exit 2 feeds output back to Claude as a blocking correction
}
