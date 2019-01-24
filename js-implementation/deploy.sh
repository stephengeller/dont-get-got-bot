#!/usr/bin/env bash

set -e

JS_FOLDER=$(dirname $0)
SRC=${JS_FOLDER}/src

source .env

function get_clean_packages() {
    echo "Fetching node_modules"
    cd ${JS_FOLDER}
    rm -rf node_modules && npm install
    cd - > /dev/null
}

function zip_files() {
    cd ${SRC}
    echo "Zipping up..."
    zip -r ../${NAME_OF_ZIPPED_FILE} * # &>/dev/null
    cd - &>/dev/null
}

function cleanup_zip() {
    rm -rf ${NAME_OF_ZIPPED_FILE}.zip
}

function upload_to_aws() {
    echo "Uploading to AWS Lambda..."
    aws lambda update-function-code --profile personal --publish --region ${REGION} --function-name ${FUNCTION_NAME} --zip-file fileb://${JS_FOLDER}/${NAME_OF_ZIPPED_FILE}.zip
    cleanup_zip
    echo "Done."
}

get_clean_packages
zip_files
upload_to_aws