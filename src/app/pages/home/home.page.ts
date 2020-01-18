import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {DatabaseService} from '../../services/database.service';
import {ImagePreview} from '../../models/image-preview';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  imageList: ImagePreview[];
  splitImageList: ImagePreview[][];

  constructor(private authService: AuthService,
              private database: DatabaseService) {
  }

  ngOnInit() {
    this.imageList = [];
    this.splitImageList = [];
    this.loadData();
  }

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

  private splitImagesInTwo() {
    this.splitImageList = [];
    let i, j;
    for (i = 0, j = this.imageList.length; i < j; i += 2) {
      const temparray = this.imageList.slice(i, i + 2);
      this.splitImageList.push(temparray);
    }
  }
}
