grayedOut = false

function validateDate(date){
  var re = /\d{2}-\d{2}-\d{4}/;
  return re.test(date);
}

function capitalizeFirstLetter(string){
  return string.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  });
}

function getURLParameter(name) {
  return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
      );
}

function dbInsertItem(itemname, quantity, expires, onSuccess){
  $.ajax({
    type: 'GET',
  url: 'http://hcigroup3.webscript.io/test/insert_item',
  data: {
    'item_name' : itemname,
  'quantity' : quantity,
  'expires' : expires
  },
  success : onSuccess
  });
}

function dbRemoveItem(itemname, onSuccess){
  $.ajax({
    type: 'GET',
  url: 'http://hcigroup3.webscript.io/test/remove_item',
  data: {
    'item_name' : itemname
  },
  success : onSuccess
  });
}

function dbGetItems(onSuccess) {
  $.getJSON('http://hcigroup3.webscript.io/test/get_items', onSuccess);
}

function shopdbInsertItem(itemname, onSuccess){
  $.ajax({
    type: 'GET',
  url: 'http://hcigroup3.webscript.io/test/add_shoppinglist_item',
  data: {
    'item_name' : itemname
  },
  success : onSuccess
  });
}

function shopdbRemoveItem(itemname, onSuccess){
  $.ajax({
    type: 'GET',
  url: 'http://hcigroup3.webscript.io/test/remove_shoppinglist_item',
  data: {
    'item_name' : itemname
  },
  success : onSuccess
  });
}

function shopdbGetItems(onSuccess) {
  $.getJSON('http://hcigroup3.webscript.io/test/get_shoppinglist', onSuccess);
}

function filter_table(filter_text){
  $("td").each(function() {
    if ($(this).text() == filter_text) 
    $(this).closest('tr').toggle();
  });
}

function grayOut(vis, options) {
  // Pass true to gray out screen, false to ungray
  // options are optional.  This is a JSON object with the following (optional) properties
  // opacity:0-100         // Lower number = less grayout higher = more of a blackout 
  // zindex: #             // HTML elements with a higher zindex appear on top of the gray out
  // bgcolor: (#xxxxxx)    // Standard RGB Hex color code
  // grayOut(true, {'zindex':'50', 'bgcolor':'#0000FF', 'opacity':'70'});
  // Because options is JSON opacity/zindex/bgcolor are all optional and can appear
  // in any order.  Pass only the properties you need to set.
  var options = options || {}; 
  var zindex = options.zindex || 50;
  var opacity = options.opacity || 90;
  var opaque = (opacity / 100);
  var bgcolor = options.bgcolor || '#000000';
  var dark=document.getElementById('darkenScreenObject');
  if (!dark) {
    // The dark layer doesn't exist, it's never been created.  So we'll
    // create it here and apply some basic styles.
    // If you are getting errors in IE see: http://support.microsoft.com/default.aspx/kb/927917
    var tbody = document.getElementsByTagName("body")[0];
    var tnode = document.createElement('div');           // Create the layer.
    tnode.style.position='absolute';                 // Position absolutely
    tnode.style.top='0px';                           // In the top
    tnode.style.left='0px';                          // Left corner of the page
    tnode.style.overflow='hidden';                   // Try to avoid making scroll bars            
    tnode.style.display='none';                      // Start out Hidden
    tnode.id='darkenScreenObject';                   // Name it so we can find it later
    tbody.appendChild(tnode);                            // Add it to the web page
    dark=document.getElementById('darkenScreenObject');  // Get the object.
  }
  if (vis) {
    // Calculate the page width and height 
    if( document.body && ( document.body.scrollWidth || document.body.scrollHeight ) ) {
      var pageWidth = document.body.scrollWidth+'px';
      var pageHeight = document.body.scrollHeight+'px';
    } else if( document.body.offsetWidth ) {
      var pageWidth = document.body.offsetWidth+'px';
      var pageHeight = document.body.offsetHeight+'px';
    } else {
      var pageWidth='100%';
      var pageHeight='100%';
    }   
    //set the shader to cover the entire page and make it visible.
    dark.style.opacity=opaque;                      
    dark.style.MozOpacity=opaque;                   
    dark.style.filter='alpha(opacity='+opacity+')'; 
        dark.style.zIndex=zindex;        
        dark.style.backgroundColor=bgcolor;  
        dark.style.width= pageWidth;
        dark.style.height= pageHeight;
        dark.style.display='block';				 
        } else {
          dark.style.display='none';
        }

        $('#darkenScreenObject').click(function() {
          grayedOut = false;
          grayOut(grayedOut);
        });
        }

        function fill_table(table){
          $('#item-list tr').each( function() {
            var name = $(this).children().eq(0).text();
            var stats = $(this).children().eq(2).text();

            if (stats == 'LOW' || stats == 'OUT' || stats == 'EXPIRED' || stats == 'EXPIRES SOON'){
              $(table).append('<tr><td>'+name+'</tr></td>');
            }
          });
        }

function fill_item_list_table() {
  $('#item-list tbody').empty();
  /* fill the table with initial data / quantity */
  dbGetItems(function(items) {
    $.each(items, function(i, item){
      // setup status / classes - really sloppy but gets the job done
      var tr_class = "error"; 
      var item_status = "OK";
      if (item.quantity > 30){
        tr_class = "success"
      } 
      else if ( item.quantity > 0 ){
        item_status = "LOW";
      }
      else{
        item_status = "OUT";
      }

    item_text = capitalizeFirstLetter(item.item);
    $('#item-list > tbody').append('<tr class="' + tr_class + '"><td>'+ item_text 
      +'</td><td>'+item.quantity+'%</td><td>'+item_status+'</td><td>'+ item.expires +
      '</td></tr>');
    });
  });
}

$(document).ready(function(){
  fill_item_list_table();

  $('#dimmer').click(function() {
    grayedOut = !grayedOut;
    grayOut(grayedOut);
  });

  $('#save-btn').click(function() {
    $(this).button('loading');
    $(this).disabled = true;
    setTimeout(function() {
      $('#save-btn').button('reset');
    }, 2000);
  });

  $('.filter-btn').click(function() {
    var filter_txt = $(this).text(); 
    filter_table(filter_txt);

  });

  /*  
   *  Hides / shows scanning message when modals are clicked. 
   *  $('.item-modal').click(function() {
   $('.load-prog').show();
   $('.load-msg').hide();
   setTimeout(function() {
   $('.load-prog').hide();
   $('.load-msg').show();
   }, 3000);
   }); */

  // used to fill in the table w/ dummy data. not needed anymore
  /*  $('#shop-btn').click(function() {
      fill_table('#apd-table > tbody');
      }); */

  /*$('#shop-modal-remove').click(function() {
    $(this).closest('tr').remove();
    }*/

  $('#shopList').click(function() {
    shopdbGetItems(function(items) {
      $.each(items, function(i, item) {
        $('#apd-table > tbody').append('<tr><td>'+item.item+'<button class="close">x</button></td></tr>');
        $('#apd-table button:last').on('click', function() {
          var text = $(this).closest('td').text();
          text = text.substring(0, text.length -1);
          $(this).closest('tr').remove();
          shopdbRemoveItem(text, function() { /*noting*/ });
        });
      });
    });
  });

  $('#modal-add').click(function() {
    var txt = $('#modal-input').val();
    $('#apd-table > tbody').append('<tr><td>'+txt+'<button class="close">x</button></td></tr>');
    $('#apd-table button:last').on('click', function() {
      var text = $(this).closest('td').text();
      text = text.substring(0, text.length -1);
      $(this).closest('tr').remove();
      shopdbRemoveItem(text, function() { /*noting*/ });
    });
    shopdbInsertItem(txt, function() { /* nothing */ });
    $('#modal-input').val('');
  });

  $('#shopModal').on('hidden', function () {
    $('#apd-table td').each(function() {
      text = $(this).text();
      text = text.substring(0, text.length -1);
    });
    $('#apd-table body').empty();
  });

  $('#item-remove-modal-button').click(function () {
    name = $('#item-remove-modal-name').val().toLowerCase();
    dbRemoveItem(name, function () {
      $('#item-remove-modal-name').val('');
      $('#item-remove-modal-success-alert').show();

      setTimeout(function() {
        $('#item-remove-modal-success-alert').hide();
      }, 3000);

    });
  });

  $('#item-insert-modal-button').click(function () {
    $('#item-insert-modal-date-error-alert').hide();
    name = $('#item-insert-modal-name').val().toLowerCase();
    expires = $('#item-insert-modal-expires').val();
    quantity = '100';

    if (!validateDate(expires)){
      $('#item-insert-modal-date-error-alert').show();
      return;
    }


    $('body').css('cursor','wait');
    dbInsertItem(name, quantity, expires, function () {
      $('#item-insert-modal-name').val('');
      $('#item-insert-modal-expires').val('');
      $('#item-insert-modal-success-alert').show();
      $('body').css('cursor','default');

      setTimeout(function() {
        $('#item-insert-modal-success-alert').hide();
      }, 3000);

    });
  });




});


