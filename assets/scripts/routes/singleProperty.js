import jQueryBridget from 'jquery-bridget';
import Player from '@vimeo/player/dist/player.js';

const singleProperty = {

  init() {
    // Set up libraries to use with jQuery
    jQueryBridget( 'player', Player, $ );

    // Init
    _initPropertyVideo();

    function _initPropertyVideo() {
      if (!$('.property-video').length) {
        return;
      }

      var propertyVideos = $('.property-video');

      propertyVideos.each(function() {
        var $propertyVideo = $(this);
        var vidId = $propertyVideo.attr('id');
        var $container = $propertyVideo.closest('.property-video-container');

        var options = {
          responsive: true
        };

        if ($propertyVideo[0].hasAttribute('data-url')) {
          options['url'] = $propertyVideo.attr('data-url');
        } else {
          options['id'] = $propertyVideo.attr('data-id');
        }

        var player = new Player(vidId, options);

        $('.property-video-play').on('click', function() {
          $container.addClass('playing');
          player.play();
        });

        // Show thumbnail when video finishes
        player.on('ended', function() {
          $container.removeClass('playing');
        });
      });
    }
  },

  finalize() {

  },

  unload() {

  },

};

export default singleProperty