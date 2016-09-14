/**
 * Created by ankang on 2016/9/14.
 */
$(function(){
    var windowW = document.body.clientWidth; //屏幕宽
    var windowH = window.screen.availHeight; //屏幕高
    var headerH = $(".header").height();
    var footerH = $(".footer").height();
    var tabH = $(".tabs").height();
    var tabsW = windowW/3;
    $(".tabs ul li").css("width",tabsW);
    var listH = windowH - headerH - footerH - tabH;
    $(".swiper-wrapper").css("min-height",listH);
})