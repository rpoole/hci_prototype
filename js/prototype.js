$(document).ready(function(){
  $('#save-btn').click(function() {
    $(this).button('loading');
    $(this).disabled = true;
    setTimeout(function() {
      $('#save-btn').button('reset');
    }, 2000);
  });
});
