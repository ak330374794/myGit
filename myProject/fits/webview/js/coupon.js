/**
 * Created by ankang on 2016/9/14.
 */
$(function(){
    var windowH = window.screen.availHeight; //屏幕高
    var headerH = $(".header").height();
    var footerH = $(".footer").height();
    var tabH = $(".tabs").height();
    var listH = windowH - headerH - footerH - tabH;
    $(".swiper-wrapper").css("min-height",listH);
})