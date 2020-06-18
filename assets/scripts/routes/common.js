// Common js

import jQueryBridget from 'jquery-bridget';
import Masonry from 'masonry-layout';
import ImagesLoaded from 'imagesloaded';
import Velocity from 'velocity-animate';

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
    _initNewsletterForm();
    _initForms();

    // Keyboard navigation and esc handlers
    $document.keyup(function(e) {
      // esc
      if (e.keyCode === 27) {
        _closeNav();
      }
    });

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
        if (!$target.is('#nav-toggle') && !$target.parents('#nav-toggle').length && !$target.is('.nav-list') && !$target.parents('.nav-list').length) {
          _closeNav();
        }
      });

      $document.on('click', 'a.contact-link', function() {
        if (!appState.breakpoints.md) {
          _closeNav();
        }
      });
    }

    function _openNav() {
      $body.addClass('nav-open');
      if (!$('.page-overlay').length) {
        $body.append('<div class="page-overlay"></div>');
      }

      $('.page-overlay').velocity({
        opacity: 1
      }, {
        display: 'block',
        easing: 'ease-out',
        duration: 350
      });

      $siteNav.velocity({
        opacity: 1
      }, {
        display: 'block',
        easing: 'ease-out',
        duration: 350
      });

      $siteNav.addClass('-active');
    }

    function _closeNav() {
      $body.removeClass('nav-open');

      $siteNav.velocity({
        opacity: 0
      }, {
        display: 'none',
        easing: 'ease-out',
        duration: 350
      });

      $('.page-overlay').velocity({
        opacity: 0
      }, {
        display: 'none',
        easing: 'ease-out',
        duration: 350
      });

      $siteNav.removeClass('-active');
    }

    // Ajaxify newsletter form
    function _initNewsletterForm() {
      let errorIcon = '<svg class="icon-error" aria-hidden="true" role="presentation"><use xlink:href="#icon-error"/></svg>';
      let successIcon = '<svg class="icon-success" aria-hidden="true" role="presentation"><use xlink:href="#icon-success"/></svg>';

      $('form.newsletter').each(function() {
        let $form = $(this);
        let $status = $form.find('.status');
        $form.on('submit', e => {
          e.preventDefault();
          $form.removeClass('error success');
          $status.removeClass('error success');
          $form.addClass('working');
          if ($form.find('input[name=EMAIL]').val()=='') {
            $form.addClass('error');
            $status.addClass('error').text('Please enter your email.');
          } else {
            $.getJSON($form.attr('action'), $form.serialize())
              .done(function(data) {
                console.log(data);
                if (data.result != 'success') {
                  if (data.msg.match(/already subscribed/)) {
                    $form.addClass('error');
                    $status.addClass('error').html(errorIcon + 'Oops! You’re already subscribed to our newsletter.');
                  } else {
                    $form.addClass('error');
                    $status.addClass('error').html(errorIcon + 'Oops! ' + data.msg);
                  }
                } else {
                  $form.removeClass('error').addClass('success');
                  $status.removeClass('error').addClass('success').html(successIcon + 'Success! Check your email to confirm.');
                }
              })
              .fail(function() {
                $form.addClass('error');
                $status.addClass('error').html(errorIcon + 'There was an error subscribing. Please try again.');
              })
              .always(() => $form.removeClass('working'));
          }
        });
      });
    }

    // Forms handling: add has-input to input-wrap after typing for styling labels
    function _initForms() {
      // Add .has-input for styling when field is changed
      $document.on('keyup.forms change.forms blur.forms', 'input,select,textarea', _checkFormInput);

      // Check initial state of fields on load
      $('form').find('input,select,textarea').each(function() {
        let $this = $(this);
        if ($this.val()!=='' && $this.attr('type')!=='hidden') {
          $this.addClass('has-input').parents('.input-wrap:first').addClass('has-input');
        }
      });

      // Add .focus to .input-wrap when focusing input
      $('form').on('focus', 'input, select, textarea', function() {
        $(this).closest('.input-wrap').addClass('-focus');
      }).on('blur', 'input, select, textarea', function() {
        $(this).closest('.input-wrap').removeClass('-focus');
      });

      // Check form fields on state change for has-input or invalid for required
      function _checkFormInput(e) {
        // Ignore tab keyup (would trigger error class when tabbing into field for the first time)
        if (e.which === 9) {
          return;
        }

        let has_input = $(e.target).val() !== '';
        $(e.target).toggleClass('has-input', has_input).parents('.input-wrap:first').toggleClass('has-input', has_input);
        $(e.target).parents('.input-wrap:first').toggleClass('invalid', ($(e.target).prop('required') && $(e.target).val() === ''));
      }
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
