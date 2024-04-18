# project_april
Repo for april project

# Setup the Chat & Prediction Image
Make sure docker in installed in your instance
You can use either `Docker Compose` or `Docker` method

# Docker Compose Method
## Build and Run all instance at once
`docker-compose up`

## Shutdown all instance
`docker-compose down`

# Docker Method
## Build the chat image
`docker build -f dockerfile-chat -t chat .`

## Run the chat image
`docker run -p 3001:3000 chat`
-p option map the local port 3001 to the image port 3000

To access the chat-ui, go to `https://<url>:3001`

## Build the store docker image
`docker build -f dockerfile-store -t store .`

## Run the store docker image
`docker run -p 3002:3000 store `

To access the store, go to `https://<url>:3002`

# GET/POST from chat to recommend API
`http://<url>:<port>/recommend?id1=<appid>&id2=<appid> .... &id9=<appid>`
The port is 3002 by defualt, defined in dockerfile
`id1` should be the selected game, and it should be rendered as a larger image