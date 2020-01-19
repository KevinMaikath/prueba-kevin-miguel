// Google Cloud Functions
import * as functions from "firebase-functions";

// CLarifai
const Clarifai = require("clarifai");
const config = require("../config.ts");

const app = new Clarifai.App({
  apiKey: config.apiKey
});

// Firebase
import * as admin from "firebase-admin";
import { DocumentReference } from "@google-cloud/firestore";

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
    const imageUrl: string = getImageUrl(filePath, object);

    // Doc reference to save image processing results
    const docRef = admin
      .firestore()
      .collection(collectionPath)
      .doc();

    // Await the cloud vision response
    const results = await visionClient.labelDetection(imageUri);

    // Map the data to desired format
    const onlyNameAndValue = (o: any) => {
      return { name: o.description, value: o.score };
    };
    const labels = results[0].labelAnnotations.map(onlyNameAndValue);

    // Checking if the 'Dog' tag exists in labels
    const isDog = isLabel(labels, "dog");

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
    const filePath: string = object.name || "";

    // Doc reference to save image processing results
    const docRef: DocumentReference = admin
      .firestore()
      .collection(collectionPathClarifai)
      .doc();

    // Getting image url
    const imageUrl: string = getImageUrl(filePath, object);

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
        const onlyNameAndValue = (c: any) => {
          return { name: c.name, value: c.value };
        };
        const labels = concepts.map(onlyNameAndValue);
        const isDog = isLabel(labels, "dog");

        return docRef.set({ isDog, imageUrl, labels });
      });
  });

/**
 * Gets the image url
 * @param filePath
 * @param object
 */
const getImageUrl = (
  filePath: string,
  object: functions.storage.ObjectMetadata
): string => {
  const metadata: any = object.metadata;
  const token: string = metadata.firebaseStorageDownloadTokens;
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${token}`;
};

/**
 * Finds out if there is a certain label in the array
 * @param labels Array of labels
 * @param name Label name to look for
 */
const isLabel = (labels: any[], name: string): boolean => {
  return (
    labels.findIndex((label: any) => {
      label.name.toLowerCase() === name;
    }) !== -1
  );
};
