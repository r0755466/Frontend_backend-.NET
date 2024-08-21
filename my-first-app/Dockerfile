
# Need node to run angular 
FROM node:16-alpine3.11 as angular 

# Reference to our working dir 
WORKDIR /app

# We make an copy of all the files in the directory 
COPY . .

# We install the needed 
RUN npm install 
RUN npm build 

# Gone use an other image, but swithc to the working directory 
FROM httpd:alpine3.15

# default where apache saves the html files... , we change to there 
WORKDIR /usr/local/apache2/htdocs

EXPOSE 4200
# We gone copy our angular files from the image to there 
COPY --from=angular /app/dist/my-first-app .

CMD ["ng", "serve", "--host", "0.0.0.0"]

