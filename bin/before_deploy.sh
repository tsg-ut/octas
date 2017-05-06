#!/bin/bash

set -ev

# Deploy built files to gh-pages
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin
git checkout gh-pages .gitignore
