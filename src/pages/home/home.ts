import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { VideoPlayer } from '@ionic-native/video-player';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: any;
  videoId: any;
  flag_upload = true;
  flag_play = true;

  constructor(public navCtrl: NavController, public streamingMedia: StreamingMedia, 
    public fileChooser: FileChooser, private mediaCapture: MediaCapture, 
    private navParams: NavParams, private transfer: FileTransfer, 
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController, private videoPlayer: VideoPlayer) { }

  playVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { this.flag_upload = true; console.log('Video played'); },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape'
    };
    this.streamingMedia.playVideo(this.videoId, options);
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Gallery',
          handler: () => {
            this.getVideo();
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.capturevideo();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  getVideo() {
    this.fileChooser.open()
      .then(uri => {
        this.videoId = uri;
        this.flag_play = false;
        this.flag_upload = false;
      })
      .catch(e => console.log(e));
  }
  capturevideo() {
    let options: CaptureVideoOptions = { limit: 1, duration: 60, quality: 100 };
    this.mediaCapture.captureVideo(options)
      .then((videodata: MediaFile[]) => {
        var i, path, len;
        for (i = 0, len = videodata.length; i < len; i += 1) {
          path = videodata[i].fullPath;
          // do something interesting with the file
        }
        this.videoId = path;
        this.flag_play = false;
        this.flag_upload = false;
      });
  }
  uploadVideo() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.videoId,
      httpMethod: 'POST',
      headers: {},
      mimeType: "mp4",
      params: { 'type': 'video-perfil', 'entityName': 'UserBundle:Cuidador', 'entityId': 40, 'isActive': true },
      chunkedMode: false
    }
    this.presentLoading();
    fileTransfer.upload(this.videoId, 'http://54.152.202.228/SeniorFirst/web/media/file-send-app/', options1)
      .then((data) => {
        this.loader.dismissAll();
        this.flag_upload = true;
        let response = JSON.parse(data.response);
        this.showToast('bootom', 'Video is uploaded Successfully!' + response.path);
      }, (err) => {
        // error
        alert("error " + JSON.stringify(err));
      });
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Uploading…"
    });
    this.loader.present();
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position
    });
    toast.present(toast);
  }

  reproducirVideo() {
    this.videoPlayer.play('http://54.152.202.228/SeniorFirst/web/uploads/e7c63a0089697e7d9e0b15d4f0a37858.mp4').then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }
}
