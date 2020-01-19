# Squaads Test
Ionic app that distinguishes whether in a photo, uploaded from the gallery or taken from the camera of the device, there is a dog or not. Use the Google Cloud Vision and Clarifai APIs, comparing both results.

## Getting started
Everything you need to know to run this app is explained in this README. However, for an initial set-up and run, it is recommended follow this section order:
1. [Install project's dependencies](#dependencies)
2. [Create a user](#create-user).
3. [Sign in with a user](#sign-in).
4. [Upload an image](#image-upload).
5. [Image processing results](#image-processing-results)

Now the API should be ready to run. Check the [API Usage](#api-usage) for more details.

## Project set-up

### Dependencies
Once in project's root directory run the following steps in your terminal:
1. Install frontend dependencies:
```Shell
npm install
```
2. Add your web app's Firebase configuration to your environment (./src/environments/environment.ts) file

```Typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: <API_KEY>,
    authDomain: <AUTH_DOMAIN>,
    databaseURL: <DATABASE_URL>,
    projectId: <PROJECT_ID>,
    storageBucket: <STORAGE_BUCKET>,
    messagingSenderId: <MESSAGING_SENDER_ID>,
    appId: <APP_ID>
  } 
};
```

3. Install backend dependencies.
```Shell
cd functions
npm install
```
4. Inside 'functions', create a configuration file and add your Clarifai API key.
```Shell
code config.ts
```
```Typescript
const apiKey: string = <YOUR_API_KEY>;

module.exports = {apiKey}; 
```