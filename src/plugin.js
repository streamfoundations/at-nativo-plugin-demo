import { PluginCore } from '@watchingthat/tracy-plugin-common';
import { version as VERSION } from '../package.json';
import VjsVastVpaidWrapper from './VjsVastVpaidWrapper';

// Default options for the plugin.
const defaults = {};

// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options = {}) => {
  let debug = false;

  try {
    debug = !!localStorage.getItem('wtDebug');
  } catch (err) {
    // do nothing;
  }

  if (typeof player.vast !== 'undefined') {
    debug = options.wtDebug || debug;

    const adManagerWrapper = new VjsVastVpaidWrapper(player, options);
    const wtat = new PluginCore(player, adManagerWrapper, options, options.wtUrl || window.wtUrl, debug);

    wtat.start();
    if (debug) {
      window.wtat = wtat;
    }
    player.addClass('vjs-wt-nativo-plugin');
  }
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function wtAdTracerNativoPlugin
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const wtAdTracerNativoPlugin = function wtAdTracerNativoPlugin(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options, { wtVersion: `ntv-${VERSION}` }));
  });
};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = window.videojs.registerPlugin || window.videojs.plugin;

// Register the plugin with video.js.
registerPlugin('wtAdTracerNativoPlugin', wtAdTracerNativoPlugin);

// Include the version number.
wtAdTracerNativoPlugin.VERSION = VERSION;

export default wtAdTracerNativoPlugin;
