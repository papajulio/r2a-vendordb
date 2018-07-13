#!/bin/bash
set -euxo pipefail

FILES=data/*
for FILE in $FILES
do
    sed -i "s/$1/$2/g" $FILE
done
