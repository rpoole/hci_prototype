$(document).ready(function(){
  $('#save-btn').click(function() {
    $(this).button('loading');
    $(this).disabled = true;
    setTimeout(function() {
      $('#save-btn').button('reset');
    }, 2000);
  });

  $('.item-modal').click(function() {
    $('.load-prog').show();
    $('.load-msg').hide();
    setTimeout(function() {
      $('.load-prog').hide();
      $('.load-msg').show();
    }, 3000);
  });

});
