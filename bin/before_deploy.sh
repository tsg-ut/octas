#!/bin/bash

set -ev

# Deploy built files to gh-pages
cat << EOS >> .gitignore
!/index.js
!*.html
!*.css
!*.map
EOS
