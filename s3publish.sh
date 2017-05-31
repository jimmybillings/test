file=layout.css
filename=layout.css
bucket=wazee-ui-platform
resource="/${bucket}/${file}"
contentType="text/css"
dateValue=`date -R`
stringToSign="PUT\n\n${contentType}\n${dateValue}\n${resource}"
s3Key=AKIAJT242KRYYRDK5NOA
s3Secret=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
signature=`echo -en ${stringToSign} | openssl sha1 -hmac ${s3Secret} -binary | base64`
curl -X PUT -T "${file}" \
  -H "Host: ${bucket}.s3.amazonaws.com" \
  -H "Date: ${dateValue}" \
  -H "Content-Type: ${contentType}" \
  -H "Authorization: AWS ${s3Key}:${signature}" \
  https://${bucket}.s3.amazonaws.com/${file}

