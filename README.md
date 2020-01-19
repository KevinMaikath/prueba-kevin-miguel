# Squaads Test
Ionic app that distinguishes whether in a photo, uploaded from the gallery or taken from the camera of the device, there is a dog or not. Use the Google Cloud Vision and Clarifai APIs, comparing both results.

  ## How the app works
  
To properly use this app, you just need to login (register if needed) with your email and start uploading images from your gallery or take them with your camera.
  
  Once an image has been uploaded, it will be processed by both Google Cloud Vision and Clarifai and then displayed into your home screen with the results.
  
  In the home screen you will only see whether an image has a dog (if both API's consider that it has dog) or not, but you can click on each image preview and a details screen will show up. In this details screen, you will be able to see all the results from both API's (not only if it has a dog, but any other tag that matches the image).

## Project set-up

### Dependencies
Once in project's root directory run the following steps in your terminal:
1. Install frontend dependencies:
```Shell
npm install
```

2. Add your web app's Firebase configuration to your environment (./src/environments/environment.ts) file:

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

3. Install backend dependencies:
```Shell
cd functions
npm install
```
4. Inside 'functions', create a configuration file: 
```Shell
code config.ts
```
5. And add your Clarifai API key:
```Typescript
const apiKey: string = <YOUR_API_KEY>;

module.exports = {apiKey}; 
```


## Get Clarifai API Key

If you do not have a Clarifai API Key yet, you can get one __[here](https://clarifai.com)__.

## Enable Google Cloud Vision API

To enable GCV API just follow __[this link](https://console.cloud.google.com/flows/enableapi?apiid=vision.googleapis.com&redirect=https%3A%2F%2Fconsole.cloud.google.com&hl=es&_ga=2.1594545.-1071505474.1574962685)__.



## Ionic app build

Here we will show you how to build a mobile application from this Ionic project, using [Capacitor](https://capacitor.ionicframework.com). Just follow the next steps:

1. Enable Capacitor in your project.
```Shell
ionic integrations enable capacitor
```

2. Build the project.
```Shell
ionic build
```
This will create a folder named 'www', which is the main app folder.

3. Create the app, depending on the target OS.
```Shell
ionic cap add android
ionic cap add ios
```

At this point, we recommend you to sync the app main folder with each OS build.
```Shell
ionic cap sync
```

Now you have a folder for each OS that contains the app. You can open these folders with their specific code IDE this way:
```Shell
ionic cap open android
ionic cap open ios
```