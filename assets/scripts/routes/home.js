const home = {
  init() {
    $('body').addClass('loaded');
  },

  finalize(){

  },

  unload() {
    $('body').removeClass('loaded');
  },
};

export default home