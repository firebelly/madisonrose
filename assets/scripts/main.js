// Import external dependencies
import Swup from 'swup';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupGaPlugin from '@swup/ga-plugin';
// import SwupDebugPlugin from '@swup/debug-plugin';

// Import local dependencies
import Router from './util/Router';
import appState from './util/appState';
import imageReveals from './util/imageReveals';

// Routes
import common from './routes/common';
import home from './routes/home';
import singleProperty from './routes/singleProperty';

const swup = new Swup({
  plugins: [
    new SwupBodyClassPlugin(),
    new SwupScrollPlugin({
      animateScroll: false
    }),
    // new SwupDebugPlugin(),
    // new SwupGaPlugin(),
  ],
  linkSelector:
    'a[href^="' +
    window.location.origin +
    '"]:not([href*="/admin"]):not([data-no-swup]), a[href^="/"]:not([href*="/admin"]):not([data-no-swup])',
  containers: ["#page", "#site-nav"]
});

// Set to global to share with modules
window.swup = swup;

// Populate Router instance with DOM routes
const routes = new Router({
  common,
  singleProperty,
  home,
});

// Inits
appState.init();
imageReveals.init();

// Load events
$(document).ready(() => routes.loadEvents());

// Reload events when swup replaces content
swup.on('contentReplaced', () => {
  routes.loadEvents();
  imageReveals.init();
});

swup.on('transitionStart', () => {
  // Remove any focused elements before transition
  document.activeElement.blur()
  // Cleanup calls for js
  routes.unload();
  imageReveals.unload();
});