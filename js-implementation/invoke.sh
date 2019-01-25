#!/usr/bin/env bash

source ../.env

OUTPUT_FILE=output.txt

aws lambda invoke \
    --function-name ${FUNCTION_ARN} \
    --region ${REGION} \
    --invocation-type RequestResponse \
    --profile personal \
    ./${OUTPUT_FILE}

cat ${OUTPUT_FILE} && rm -rf ${OUTPUT_FILE}