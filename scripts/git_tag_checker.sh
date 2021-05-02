#!/bin/bash
# Check if the version of package.json is already in the git tag
VERSION=$(npx -c 'echo "$npm_package_version"')
COUNT=$(git tag | grep -c v${VERSION}$)
echo | git tag

if [ ${COUNT} -eq 0 ]; then
    printf '%s\n' "OK v${VERSION} does not exist" >&1
    exit 0
else
    printf '%s\n' "ERROR! v${VERSION} already exists" >&2
    exit 1
fi
