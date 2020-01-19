import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {DatabaseService} from '../../services/database.service';
import {ImagePreview} from '../../models/image-preview';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {DetailsModalComponent} from './details-modal/details-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  imageList: ImagePreview[];
  splitImageList: ImagePreview[][];

  addImageActionSheet: HTMLIonActionSheetElement;

  constructor(private authService: AuthService,
              private database: DatabaseService,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.imageList = [];
    this.splitImageList = [];
    this.loadData();
  }

  /**
   * Get the data needed for the image preview list.
   */
  loadData() {
    this.database.getImageListObservable()
      .subscribe(querySnapshot => {
        this.imageList = [];
        querySnapshot.forEach((docSnapshot) => {
          const image = docSnapshot.payload.doc.data() as ImagePreview;
          this.imageList.push(image);
        });
        this.splitImagesInTwo();
      });
  }

  logout() {
    this.authService.logoutUser();
  }

  /**
   * Split the imagePreviewList in 2, for easier layout handling.
   */
  private splitImagesInTwo() {
    this.splitImageList = [];
    let i, j;
    for (i = 0, j = this.imageList.length; i < j; i += 2) {
      const temparray = this.imageList.slice(i, i + 2);
      this.splitImageList.push(temparray);
    }
  }

  async onAddClicked() {
    await this.actionSheetInit();
    await this.addImageActionSheet.present();
  }

  /**
   * Initialize the action sheet buttons.
   */
  async actionSheetInit() {
    this.addImageActionSheet = await this.actionSheetCtrl.create({
      header: 'Add an image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePictureWithCamera();
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.getPictureFromGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.actionSheetCancel();
          }
        }]
    });
  }

  async takePictureWithCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    await this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.database.uploadImage(base64Image);
    }, (err) => {
      console.log(err);
    });
  }

  async getPictureFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    await this.camera.getPicture(options).then((imageData) => {
      const base64Image = 'data:image/jpeg;base64,' + imageData;
      this.database.uploadImage(base64Image);
    }, (err) => {
      console.log(err);
    });
  }

  actionSheetCancel() {
    this.addImageActionSheet.dismiss();
  }

  onImageClicked(image: ImagePreview) {
    this.presentDetailsModal(image);

  }

  async presentDetailsModal(image: ImagePreview) {
    const modal = await this.modalCtrl.create({
      component: DetailsModalComponent,
      componentProps: {
        image
      }
    });

    return await modal.present();
  }
}
