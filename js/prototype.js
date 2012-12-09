grayedOut = false

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function dbInsertItem(itemname, quantity, onSuccess){
    $.ajax({
      type: 'GET',
      url: 'http://hcigroup3.webscript.io/test/insert_item',
      data: {
        'item_name' : itemname,
        'quantity' : quantity
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


$(document).ready(function(){
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

  $('#shop-btn').click(function() {
    fill_table('#apd-table > tbody');
  });

  $('#shopModal').on('hidden', function () {
    $('#apd-table tr:gt(0)').each( function() {
      $(this).remove();
    });
  });

  $('#modal-add').click(function() {
    var txt = $('#modal-input').val();
    $('#apd-table > tbody').append('<tr><td>'+txt+'</tr></td>');
  });

  $('#item-remove-modal-button').click(function () {
   name = $('#item-remove-modal-name').val();
   dbRemoveItem(name, function () {
     alert("Removed!");
   });
  });


  $('#item-insert-modal-button').click(function () {
   name = $('#item-insert-modal-name').val();
   quantity = '100';
   dbInsertItem(name, quantity, function () {
     alert("Inserted!");
   });
  });

});


