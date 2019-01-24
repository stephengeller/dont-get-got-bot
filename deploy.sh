#!/usr/bin/env bash

set -e

SRC=dont_get_got_bot

source .env

function zip_files() {
    cd ${SRC}
    echo "Zipping up..."
    zip -r ../${NAME_OF_ZIPPED_FILE} . &>/dev/null
    cd - &>/dev/null
}

function cleanup_zip() {
    rm -rf ${NAME_OF_ZIPPED_FILE}.zip
}

function upload_to_aws() {
    echo "Uploading to AWS Lambda..."
    aws lambda update-function-code --profile personal --publish --region ${REGION} --function-name ${FUNCTION_NAME} --zip-file fileb://${NAME_OF_ZIPPED_FILE}.zip
    cleanup_zip
    echo "Done."
}

zip_files
upload_to_aws