import WTCore from '@watchingthat/tracy-plugin-common';

class VjsVastVpaidPlugin {
  player;
  options;
  playSent = false;

  SHORT_NAME = 'ntv';

  PLAYER_EVENTS = {
    'vpaid.AdStarted': { type: 'sa' },
    'vpaid.AdImpression': { type: 'imp' },
    'vpaid.AdPaused': null,
    'vpaid.resumeAd': null,
    'vpaid.AdVideoFirstQuartile': { type: 'efq' },
    'vpaid.AdVideoMidpoint': { type: 'esq' },
    'vpaid.AdVideoThirdQuartile': { type: 'etq' },
    'vpaid.AdVideoComplete': { type: 'ecp' },
    'vast.adError': (e) => {
      console.warn('vast.adError e', e);
      if (e.type === 'vast.adError' && e.error && e.error.code) {
        return { type: 'error', st: 'vast', err: e.error.code };
      }
      this.utils.log('onAdError event does not look like an vast.adError event', e);
      return { type: 'error', st: 'player', err: 'non-vast' };
    },
    play: () => {
      if (!this.playSent) {
        this.playSent = true;
        return { type: 'play' };
      }
    },
  };

  constructor(player, options = {}) {
    this.player = player;
    this.options = options;
    this.options.src = this.SHORT_NAME;
    if (this.options.debug === 'debug') {
      // eslint-disable-next-line no-debugger
      debugger;
    }
    this.utils = new WTCore(options, this.getAdTech, this.getVideoSlot, this.getDebugData);
    this.setAdURL(options.adTagUrl);
  }

  start() {
    Object.keys(this.PLAYER_EVENTS).forEach((eventName) => {
      this.player.on(eventName, this._onPlayerEvent);
    });
  }

  setAdURL = (originalAdURL) => {
    this.utils.setAdURL(originalAdURL, originalAdURL);
  };

  _onPlayerEvent = (e) => {
    this.utils.log('Adapter._onPlayerEvent', e.type, e);
    console.warn('vastObj', this.player.vast);
    if (this.PLAYER_EVENTS[e.type]) {
      if (typeof this.PLAYER_EVENTS[e.type] === 'function') {
        const obj = this.PLAYER_EVENTS[e.type](e);

        if (obj) {
          return this.utils.onEvent(obj, e);
        }
      } else {
        this.utils.onEvent(this.PLAYER_EVENTS[e.type], e);
      }
    }
  };

  cleanup() {
    this.player = null;
  }

  getAdTech = () => {
    let tech = 'html5';

    try {
      tech = this.player.techName_.toLowerCase();
    } catch (err) {
      // do nothing
    }
    return tech;
  };

  getVideoSlot = () => this.player.el().querySelector('.vjs-tech');

  getDebugData = () => ({});
}

export default VjsVastVpaidPlugin;
