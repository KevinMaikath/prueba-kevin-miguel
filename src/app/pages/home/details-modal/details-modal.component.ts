import {Component, Input, OnInit} from '@angular/core';
import {ImagePreview} from '../../../models/image-preview';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
})
export class DetailsModalComponent implements OnInit {

  @Input() image: ImagePreview;
  selectedSegment: string;

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.selectedSegment = 'Google';
  }

  onBackPressed() {
    this.modalCtrl.dismiss();
  }

  segmentChanged(event) {
    this.selectedSegment = event.detail.value;
  }
}
