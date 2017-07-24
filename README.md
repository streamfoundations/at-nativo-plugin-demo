# Videojs-vast-vpaid support plugin for AdTracer

[Demo](https://rawgit.com/streamfoundations/at-nativo-plugin-demo/master/index.html)

### Load
You can load it via a script tag:
```
<script src="https://cdn.watchingthat.com/wt.nativo-plugin.min.js"></script>
``` 

### Init
This is a videojs plugin so it's instantiated like this:
```
player.wtAdTracerNativoPlugin({
  clientId: '<client ID you got from WatchingThat>',
  clientSecret: '<secret for the ID above>',
  adTagUrl: 'http://ad.url',
});
```

The `adTagUrl` should be the url to an actual Ad. Like `http://pubads.g.doubleclick.net/gampad/ads?env=....`.
It must be the same url that you're fetching the `vastClient` plugin

The plugin listens for events triggered by the [vastClient](https://github.com/MailOnline/videojs-vast-vpaid) plugin so you need
to make sure you call that plugin as well:
```
player.vastClient({
  adTagUrl: 'http://same.as.url.above',
  adsEnabled: true,
  ...
});
```
