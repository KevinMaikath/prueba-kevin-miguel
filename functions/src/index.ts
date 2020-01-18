// Google Cloud Functions
import * as functions from "firebase-functions";

// CLarifai
const Clarifai = require("clarifai");
const config = require('../config.ts');;

const app = new Clarifai.App({
  apiKey: config.apiKey
});

// Firebase
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// Cloud Vision
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();

// Dedicated bucket for cloud function invocation
const bucketName: string = "squaads-vision";
const collectionPath: string = "photos";
const collectionPathClarifai: string = "photosClarifai";

/**
 * Once a new image has been detected, it will be processed (with Google Cloud Vision API) 
 * and its results (isDog, imageUrl and labels) stored in a database document
 */
export const imageTagger = functions.storage
  .bucket(bucketName)
  .object()
  .onFinalize(async object => {
    // File data
    const filePath: string = object.name || "";

    // Location of saved file in bucket
    const imageUri: string = `gs://${bucketName}/${filePath}`;

    // Getting image url
    const metadata: any = object.metadata || "";
    const token: string = metadata.firebaseStorageDownloadTokens;
    const imageUrl: string = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${token}`;

    // Doc reference to save image processing results
    const docRef = admin
      .firestore()
      .collection(collectionPath)
      .doc();

    // Await the cloud vision response
    const results = await visionClient.labelDetection(imageUri);

    // Map the data to desired format
    const labels = results[0].labelAnnotations.map(
      (obj: { description: any; score: any }) => { return {name: obj.description, value: obj.score}}
    );

    // Checking if the 'Dog' tag exists in labels
    const isDog = labels.findIndex((label: any) => {return label.name === 'Dog'}) !== -1;

    return docRef.set({ isDog, imageUrl, labels });
  });

/**
 * Once a new image has been detected, it will be processed (with Clarifai API) 
 * and its results (isDog, imageUrl and labels) stored in a database document
 */
export const imageTaggerClarifai = functions.storage
  .bucket(bucketName)
  .object()
  .onFinalize(async object => {
    // File data
    const filePath: string = object.name || '';

    // Doc reference to save image processing results
    const docRef = admin
      .firestore()
      .collection(collectionPathClarifai)
      .doc();

    // Getting image url
    const metadata: any = object.metadata || "";
    const token: string = metadata.firebaseStorageDownloadTokens;
    const imageUrl: string = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${token}`;

    // Await the Clarifai response
    app.models
      .initModel({
        id: Clarifai.GENERAL_MODEL,
        version: "aa7f35c01e0642fda5cf400f543e7c40"
      })
      .then((generalModel: any) => {
        return generalModel.predict(imageUrl);
      })
      .then((response: any) => {
        const concepts = response["outputs"][0]["data"]["concepts"];
        const labels = concepts.map((concept: any) => {return {name: concept.name, value: concept.value}});
        const isDog = labels.findIndex((label: any) => {return label.name === 'dog'}) !== -1;

        return docRef.set({ isDog, imageUrl, labels });
      });
  });