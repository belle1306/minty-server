# minty-server

How to test

npm -i nodemon

npm -i ngrok

cd into minty-server directory

It is dependant on Pinata's API to upload the textures to IPFS so you'll need Pinata account to use with their API keys

create a .env file with two keys:

PINATA_API_KEY=3f39081da41e9ba-----
PINATA_SECRET_API_KEY=cb446f3ac820489bff246f55fb7b1c4c9efaf50b92f5f86886750e----------

Now you can run the app

nodemon app.js

ngrok http 8080

get the ngrok url (e.g. https://e39baa4c01d9.ngrok.io)

and paste into the Android file Constants.java 

public static final String APP_ENDPOINT = "https://e39baa4c01d9.ngrok.io";
