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
    $navOpen = $('#nav-toggle'),
    $navClose = $('#nav-close'),
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
      $navOpen.on('click', _openNav);
      $navClose.on('click', _closeNav);

      $document.on('click', 'body.nav-open', function(e) {
        var $target = $(e.target);
        if (!$target.is('#nav-toggle') && !$target.parents('#nav-toggle').length && !$target.is('.site-nav') && !$target.parents('.site-nav').length) {
          _closeNav();
        }
      });
    }

    function _openNav() {
      $body.addClass('nav-open');
      $siteNav.addClass('-active');
    }

    function _closeNav() {
      $body.removeClass('nav-open');
      $siteNav.removeClass('-active');
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
