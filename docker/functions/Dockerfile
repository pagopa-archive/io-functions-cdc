FROM node:12.22.1

WORKDIR /usr/src/app

RUN npm i -g azure-functions-core-tools@3 --unsafe-perm true

ENV AzureWebJobsScriptRoot=/usr/src/app \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY docker/functions/import-cert.sh /

ENTRYPOINT [ "/import-cert.sh" ]
CMD ["func", "start", "--javascript"]
