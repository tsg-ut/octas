#!/bin/bash

set -ev

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
 # Deploy built files to gh-pages
 git checkout gh-pages .gitignore
fi
