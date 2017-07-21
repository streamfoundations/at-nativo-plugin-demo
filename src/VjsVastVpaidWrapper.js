import { utils } from '@watchingthat/tracy-plugin-common';

class VjsVastVpaidWrapper {
  player;
  adServerUrl;

  SHORT_NAME = 'ntvp';

  static VPAID_EVENTS = {
    'vpaid.AdStarted': 'sa',
    'vpaid.AdImpression': 'eimp',
    // 'vpaid.AdPaused': 'pause',
    // 'vpaid.resumeAd': 'resume',
    'vpaid.AdVideoFirstQuartile': 'efq',
    'vpaid.AdVideoMidpoint': 'esq',
    'vpaid.AdVideoThirdQuartile': 'etq',
    'vpaid.AdVideoComplete': 'ecp',
    // contentPauseRequested: 'contentPauseRequested',
    // contentResumeRequested: 'contentResumeRequested',
    // allAdsCompleted: 'allAdsCompleted',
    // click: 'click',
    // volumeChange: 'volumeChange',
    // skip: 'skip',
    // skippableStateChange: 'skippableStateChange',
    // durationChange: 'durationChange',
    // linearChange: 'linearChange'
  };

  constructor(player, options) {
    this.player = player;
    this.adServerUrl = options.adTagUrl;
    console.warn('vastObj', player.vast);
    console.warn('player', player);
  }

  cleanup() {
    this.adServerUrl = null;
    this.player = null;
  }

  get videoSlot() {
    return this.player.el().querySelector('.vjs-tech');
  }

  get adTech() {
    let tech = 'html5';

    try {
      tech = this.player.techName_.toLowerCase();
    } catch (err) {
      // do nothing
    }
    return tech;
  }

  get adTagUrl() {
    return this.adServerUrl;
  }

  set adTagUrl(value) {
    this.adServerUrl = value;
  }

  wireVPAIDEvents(cb) {
    utils.log('start.wireEvents');
    Object.keys(VjsVastVpaidWrapper.VPAID_EVENTS).forEach((event) => {
      this.player.on(event, this._onVPAIDEvent(cb));
    });
  }

  _onVPAIDEvent = (cb) => (e) => {
    console.warn('_onVPAIDEvent e', e);
    const eventType = VjsVastVpaidWrapper.VPAID_EVENTS[e.type] || e.type;
    const ad = {};
    const adObj = {};
    // const ad = e.getAd();
    // const adObj = {
    //   adId: ad.getAdId(),
    //   adSystem: ad.getAdSystem(),
    //   advertiserName: ad.getAdvertiserName(),
    //   dealId: ad.getDealId(),
    //   wrapperAdIds: ad.getWrapperAdIds(),
    //   wrapperAdSystems: ad.getWrapperAdSystems(),
    //   // mediaUrl: ad.getMediaUrl(),
    //   isLinear: ad.isLinear(),
    // };

    cb(eventType, adObj, ad);
  };

  onAdError(cb) {
    this.player.on('vast.adError', cb);
  }
}

export default VjsVastVpaidWrapper;
