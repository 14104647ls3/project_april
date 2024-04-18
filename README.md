# project_april
Repo for april project

# Setup the Chat & Prediction Image
Make sure docker in installed in your instance

### Build the image
`docker build -f dockerfile-chat -t chat .`

### Run the image
`docker run -p 3001:3000 chat`
-p option map the local port 3001 to the image port 3000

To access the chat-ui, go to `https://<url>:3001`