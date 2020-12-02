#! /bin/bash

######################################################################
#
# This script generates an SSL certficate for local development. To
# execute the script, run `bash create-dev-ssl-cert.sh`. Sudo is
# needed to save the certificate to your Mac KeyChain if you're using Mac. 
# After the cert is generated, you can use `HTTPS=true yarn start` to run the web 
# server.
#
# Author: Danny Garber
# Created: 12/02/2020
#
######################################################################

CWD=$(pwd)
LOCAL_CERT_PATH=$CWD/.cert

CERT_NAME='footscouter'

# Ask user permission to run the script
CONTINUE="n/a"
printf "⚠️  This script will create/modify the folder $LOCAL_CERT_PATH\n"
printf "⚠️  This script will alert you when it must run in sudo mode\n"
printf ""
while [[ ! "$CONTINUE" =~ ^[yYnN]$ ]]
do read -ep '   Do you want to continue? [y/N] ' -n 1 -r CONTINUE
  if [[ "$CONTINUE" == "" ]]; then
    CONTINUE="N"
  fi
done

if [[ "$CONTINUE" =~ ^[nN]$ ]]; then
  printf 'Script aborted by used\n'
  exit 0
fi
printf '\n'

# -- ./.cert --

printf "⚙️  $LOCAL_CERT_PATH... "
mkdir -p $LOCAL_CERT_PATH
cd $LOCAL_CERT_PATH
printf '✅\n'

# -- CERT_NAME.crt --

printf '🔑 Generating self-signed certificate and key... '
FILE=$CERT_NAME.crt
if [[ -f "$FILE" ]]; then
  printf 'already exists ✅ \n'
else
  printf '🆕\n'
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_NAME.key -out $CERT_NAME.crt
fi

# -- Add to Trusted Root Authority --

printf '🔒 Adding to the Trusted Root Authority... '
certutil -addstore "Root" $CERT_NAME.crt

printf '✅\n'