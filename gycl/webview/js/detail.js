$(function(){
    var windowW = $(window).width();
    var fontS = parseFloat($("html").css("font-size").substring(0,$("html").css("font-size").length-2));
    var formW = windowW - 2*fontS;
    var formRightW = formW-$(".formLeft").width();
    if(windowW<400){
        $(".formRight").css("width",formRightW);
    }else{
        $(".formRight").css("width",formRightW-1);
    };
})