FROM node:14.4.0

WORKDIR /Users/ismaelperez/Workspace/Javascript/FullStack/PERN-stack/face-detect-server

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]