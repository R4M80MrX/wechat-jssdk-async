import wx from '@rambox/weixin-js-sdk'

// polyfill for finally
// @ts-ignore
if(!Promise.prototype.finally) {
  // @ts-ignore
  Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
      value  => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    )
  }
}

function promisify<options = any, res = any>(
  wxFunc: (arg: options) => void
): (arg?: options) => Promise<res> {
  return (arg?: options) =>
    new Promise((resolve, reject) => {
      const { success, fail, complete, ...args } = arg as any;

      arg = Object.assign({}, arg, {
        success: arg["success"]
          ? (res: res) => {
              resolve(res);
              arg["success"](res);
            }
          : (res: res) => {
              resolve(res);
            },

        fail: arg["fail"]
          ? (err: any) => {
              reject(err);
              arg["fail"](err);
            }
          : (err: any) => {
              reject(err);
            },
        complete
      });

      wxFunc.call({}, arg);
    });
}

function config(param: wx.ConfigOptions) {
  return new Promise((resolve, reject)=> {
    wx.config(param);
    wx.ready(resolve);
    wx.error((res: {errMsg: string}) => {
      reject(new Error(res.errMsg));
    })
  })
}

export const wxp = {
  config,
  checkJsApi: promisify<wx.checkJsAPIOptions, {checkResult: {[key in wx.JSApiList]: boolean}}>(wx.checkJsApi),
  updateAppMessageShareData: promisify<wx.shareDataOptions>(wx.updateAppMessageShareData),
  updateTimelineShareData: promisify<wx.shareDataOptions>(wx.updateTimelineShareData),
  onMenuShareTimeline: promisify<wx.shareDataOptions>(wx.onMenuShareTimeline),
  onMenuShareAppMessage: promisify<wx.shareAppDataOptions>(wx.onMenuShareAppMessage),
  onMenuShareQQ: promisify<wx.shareDataOptions>(wx.onMenuShareQQ),
  onMenuShareWeibo: promisify<wx.shareDataOptions>(wx.onMenuShareWeibo),
  onMenuShareQZone: promisify<wx.shareDataOptions>(wx.onMenuShareQZone),
  chooseImage: promisify<wx.chooseImageOptions>(wx.chooseImage),
  previewImage: promisify<wx.previewImageOptions>(wx.previewImage),
  uploadImage: promisify<wx.uploadImageOptions>(wx.uploadImage),
  downloadImage: promisify<wx.downloadImageOptions>(wx.downloadImage),
  getLocalImgData: promisify<wx.getLocalImgDataOptions>(wx.getLocalImgData),
  startRecord: promisify<wx.callback>(wx.startRecord),
  stopRecord: promisify<wx.callback>(wx.stopRecord),
  onVoiceRecordEnd: promisify<wx.callback>(wx.onVoiceRecordEnd),
  playVoice: promisify<wx.playVoiceOptions>(wx.playVoice),
  pauseVoice: promisify<wx.pauseVoiceOptions>(wx.pauseVoice),
  stopVoice: promisify<wx.stopVoiceOptions>(wx.stopVoice),
  onVoicePlayEnd: promisify<wx.callback>(wx.onVoicePlayEnd),
  downloadVoice: promisify<wx.downloadVoiceOptions>(wx.downloadVoice),
  translateVoice: promisify<wx.translateVoiceOptions>(wx.translateVoice),
  getNetworkType: promisify<wx.callback>(wx.getNetworkType),
  openLocation: promisify<wx.openLocationOptions>(wx.openLocation),
  getLocation: promisify<wx.getLocationOptions>(wx.getLocation),
  startSearchBeacons: promisify<wx.startSearchBeaconsOptions>(wx.startSearchBeacons),
  stopSearchBeacons: promisify<wx.callback>(wx.stopSearchBeacons),
  onSearchBeacons: promisify<wx.callback>(wx.onSearchBeacons),
  closeWindow: promisify(wx.closeWindow),
  hideMenuItems: promisify<wx.hideMenuItemsOptions>(wx.hideMenuItems),
  showMenuItems: promisify<wx.showMenuItemsOptions>(wx.showMenuItems),
  hideAllNonBaseMenuItem: promisify<wx.callback>(wx.hideAllNonBaseMenuItem),
  showAllNonBaseMenuItem: promisify<wx.callback>(wx.showAllNonBaseMenuItem),
  scanQRCode: promisify<wx.scanQRCodeOptions>(wx.scanQRCode),
  openProductSpecificView: promisify<wx.openProductSpecificViewOptions>(wx.openProductSpecificView),
  chooseCard: promisify<wx.chooseCardOptions>(wx.chooseCard),
  addCard: promisify<wx.addCardOptions>(wx.addCard),
  openCard: promisify<wx.openCardOptions>(wx.openCard),
  chooseWXPay: promisify<wx.chooseWxPayOptions>(wx.chooseWXPay),
  openAddress: promisify<wx.callback>(wx.openAddress),
}