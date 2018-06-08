var local = {};
local.avatar = "https://cdn1.iconfinder.com/data/icons/avatars-glyphs-vol-1/52/Avatar__Man__Person__User__Boy__Male__owner-512.png";

var remote = {};
remote.avatar = "discount logo.png"//"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Logo_of_the_Telekom_Malaysia.svg/660px-Logo_of_the_Telekom_Malaysia.svg.png";


var accessToken = "528e3031f7f342f28d9f4a0a20eb7abc";
var baseUrl = "https://api.api.ai/v1/";

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var dateObj = new Date();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var month = monthNames[dateObj.getMonth()]; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = day + "-" + month + "-" + year;
    var strTime =newdate+' | '+ hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function insertChat(who, text){
    var control = "";
    var date = formatTime(new Date());

     if (who == "local"){

         control = '<li style="width:100%;">' +
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p style="font-size:14px;;line-height:140%;">'+text+'</p>' +
                                '<p><small style="color:#337ab7;font-size:9px">'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+local.avatar+'" /></div>' +
                  '</li>';
    }else{
        control = '<li style="width:100%">' +
                  '<img class="img-circle" align="left" style="width:15%;height:20%;padding-right:5px;" src="'+ remote.avatar +'" />'+
                        '<div class="msj macro">' +
                            '<div class="text text-l">' +
                                '<p style="font-size:14px;line-height:140%;">'+ text +'</p>' +
                                '<p><small style="color:white;font-size:9px;">'+date+'</small></p>' +
                            '</div>' +
                        '</div>' +
                    '</li>';
    }
    $("#messages").append(control);
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}
hideLoading();
function hideLoading()
{
    $("#loading").hide();
    $("#chat-icon").hide();
    $(".innerframe").hide();
    $(".innerframe").delay(5000).fadeIn(100);
    insertChat("remote","how can i help you");
}
// $("#chat-panel").on('click',function(){
//     $(".innerframe").toggle();
// });

$("#close_button").on('click',function(){
    $(".frame").hide();
    $("#chat-icon").show();
    resetChat();
});

$("#chat-icon").on('click',function(){
    $(".frame").show();
    $(".innerframe").show();
    resetChat();
          insertChat("remote","how can i help you");
});

$("#minimize_button").on('click',function(){
    $(".innerframe").toggle();
    $("#chat-icon").hide();
});


$("#reload_button").on('click',function(){
        resetChat();
            $('#loading').fadeIn('slow', function(){
               $('#loading').delay(5000).fadeOut();
            });
            setTimeout(function() { writeMessage(); }, 6000);

});

$("#expand_button").on('click',function(){
  $('.frame').slideToggle().toggleClass('active');
});
$('#collapse').click(function(){
    $("#expand_button").trigger('click');
});



function writeMessage(){
    insertChat("remote","Welcome back, how can i help you");
}

function resetChat(){
    $("#messages").empty();
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("local", text);
            $(this).val('');
            queryBot(text)
        }
    }
});

resetChat();

// (function($){
//     $(function() {
//         var _timeout,
//             _wait = 50000; // 15 seconds

//         $(document).mousemove(function() {
//             clearTimeout(_timeout);
//             _timeout = setTimeout(function() {
//                 //resetChat();
//                 insertChat("remote","Hello are you lost?");
//             }, _wait);
//         });
//     });
// })(jQuery);

function yes1(objButton)
{

// var e = jQuery.Event("keydown", {keyCode: 13});
var t1 =  objButton.value;
       insertChat("local",t1);
       queryBot(t1);
       // $('.mytext').append(t1);
       // $('.mytext').trigger(e);
}

function no1(objButton)
{
  alert(objButton.value);
}

function queryBot(text) {
            $.ajax({
                type: "POST",
                url: baseUrl + "query?v=20150910",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
                data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
                success: function(data) {
                    // insertChat("remote",data.result.fulfillment.speech);
                    console.log((data.result.fulfillment.messages).length)
                    if ((data.result.fulfillment.messages).length > 1 ){

                        for (var c in data.result.fulfillment.messages){
                            if (data.result.fulfillment.messages[c].type == 0){
                                   if ("platform" in data.result.fulfillment.messages[c]){
                                       console.log(data.result.fulfillment.messages[c].platform)
                                   }
                                   else{
                                   insertChat("remote",data.result.fulfillment.messages[c].speech);
                                   // insertChat("remote","<button>hi</button>");
                                   insertChat("remote","hi");
                                   console.log(data.result.fulfillment.messages[c])
                               }}

                        }

                    }
                    else{
                          insertChat("remote",data.result.fulfillment.speech);
                         console.log(data.result.fulfillment.messages)
                         //insertChat("remote","hi1");
                         //insertChat("remote",`<input type='button' value='Yes' id="yes1" onclick='yes1(this)' /><input type='button' value='No' onclick='no1(this)' />`);
                    }
                },
                error: function() {
                    insertChat("remote","Server Not Responding. Please try again..");
                }
            });
    }
