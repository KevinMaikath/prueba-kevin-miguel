import {Component, Input, OnInit} from '@angular/core';
import {ImagePreview} from '../../../models/image-preview';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
})
export class DetailsModalComponent implements OnInit {

  @Input() image: ImagePreview;

  constructor() {
  }

  ngOnInit() {
  }

}
