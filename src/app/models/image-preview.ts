export class ImagePreview {
  imageUrl: string;
  userId: string;
  isDogClarifai: boolean;
  isDogGoogle: boolean;
  labelsClarifai: {name: string, value: number}[];
  labelsGoogle: {name: string, value: number}[];
}
