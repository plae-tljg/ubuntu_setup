#!/bin/bash
appimage=$(find /home/fit/.app -name "cursor*.AppImage" -print -quit)
if [[ -f "$appimage" ]]; then
    exec "$appimage"
else
    echo "Cursor AppImage not found!" >&2
    exit 1
fi
