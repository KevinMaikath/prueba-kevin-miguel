// Google Cloud Functions
import * as functions from "firebase-functions";

// Firebase
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// Cloud Vision
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();

// Dedicated bucket for cloud function invocation
const bucketName: string = "squaads-vision";
const collectionPath: string = "photos";

/**
 * Once a new image has been detected, it will be processed and 
 * its results (isDog, imageUrl and labels) stored in a database document
 */
export const imageTagger = functions.storage

  .bucket(bucketName)
  .object()
  .onFinalize(async object => {
    // File data
    const filePath: string = object.name || "";

    // Location of saved file in bucket
    const imageUri: string = `gs://${bucketName}/${filePath}`;

    // Doc reference to save image processing results
    const docRef = admin
      .firestore()
      .collection(collectionPath)
      .doc();

    // Await the cloud vision response
    const results = await visionClient.labelDetection(imageUri);

    // Map the data to desired format
    const labels = results[0].labelAnnotations.map(
      (obj: { description: any }) => obj.description
    );

    // Checking if the 'Dog' tag exists in labels
    const isDog = labels.includes("Dog");

    // Getting image url
    const metadata: any = object.metadata || "";
    const token: string = metadata.firebaseStorageDownloadTokens;
    const imageUrl: string = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${filePath}?alt=media&token=${token}`;

    return docRef.set({ isDog, imageUrl, labels });
  });
