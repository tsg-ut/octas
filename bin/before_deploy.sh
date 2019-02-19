#!/bin/bash

set -ev

# Deploy built files to gh-pages
cat << EOS >> .gitignore
!/index.js
!/worker.js
!*.html
!*.css
!*.map
EOS
