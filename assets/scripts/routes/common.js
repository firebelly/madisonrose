// Common js

import jQueryBridget from 'jquery-bridget';
import Masonry from 'masonry-layout';
import ImagesLoaded from 'imagesloaded';

import appState from '../util/appState';

// Shared vars
let $window = $(window),
    $body = $('body'),
    $document = $(document),
    $siteNav = $('.site-nav'),
    $navToggle = $('#nav-toggle'),
    transitionElements = [],
    resizeTimer;

export default {
  // JavaScript to be fired on all pages
  init() {
    // Set up libraries to be used with jQuery
    jQueryBridget( 'masonry', Masonry, $ );
    ImagesLoaded.makeJQueryPlugin( $ );

    // Transition elements to enable/disable on resize
    transitionElements = [$siteNav];

    // Init Functions
    _initHoverPairs();
    _initMobileNav();

    function _initHoverPairs() {
      $(document).on('mouseenter', '[data-hover-pair]', function(e) {
        var hoverPair = $(this).attr('data-hover-pair');
        $('[data-hover-pair="'+hoverPair+'"]').addClass('-hover');
      }).on('mouseleave', '[data-hover-pair]', function(e) {
        var hoverPair = $(this).attr('data-hover-pair');
        $('[data-hover-pair="'+hoverPair+'"]').removeClass('-hover');
      });
    }

    function _initMobileNav() {
      $navToggle.on('click', function() {
        if ($(this).is('.-active')) {
          _closeNav();
        } else {
          _openNav();
        }
      });
    }

    function _openNav() {
      $body.addClass('nav-open');
      $siteNav.addClass('-active');
      $navToggle.addClass('-active').html('close');
    }

    function _closeNav() {
      $body.removeClass('nav-open');
      $siteNav.removeClass('-active');
      $navToggle.removeClass('-active').html('menu');
    }

    // Disabling transitions on certain elements on resize
    function _disableTransitions() {
      $.each(transitionElements, function() {
        $(this).css('transition', 'none');
      });
    }

    function _enableTransitions() {
      $.each(transitionElements, function() {
        $(this).attr('style', '');
      });
    }

    function _resize() {
      // Disable transitions when resizing
      _disableTransitions();

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
      }, 250);
    }
    $(window).resize(_resize);

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
