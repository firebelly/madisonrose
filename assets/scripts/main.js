// Import external dependencies

// Import local dependencies
import Router from './util/Router';
import imageReveals from './util/imageReveals';
import appState from './util/appState';

// Routes
import common from './routes/common';
import home from './routes/home';
import singleProperty from './routes/singleProperty';

// Populate Router instance with DOM routes
const routes = new Router({
  common,
  singleProperty,
  home,
});

// Inits
imageReveals.init();
appState.init();

// Load events
$(document).ready(() => routes.loadEvents());