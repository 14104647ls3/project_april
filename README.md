# project_april
Repo for april project

# Setup the Chat & Prediction Image
Make sure docker in installed in your instance

### Build the chat image
`docker build -f dockerfile-chat -t chat .`

### Run the chat image
`docker run -p 3001:3000 chat`
-p option map the local port 3001 to the image port 3000

To access the chat-ui, go to `https://<url>:3001`

# Build the store docker image
`docker build -f dockerfile-store -t store .`

# Run the store docker image
`docker run -p 3002:3000 store `

To access the store, go to `https://<url>:3002`

