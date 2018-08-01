#!/bin/bash
set -euxo pipefail

FILES=data/*.json
for FILE in $FILES
do
    sed -i "s/$1/$2/g" $FILE
done

FILES=data/entities/*
for FILE in $FILES
do
    sed -i "s/$1/$2/g" $FILE
done
