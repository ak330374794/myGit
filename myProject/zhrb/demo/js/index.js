$(function(){
    var phoneH = $(".iphone .p1 li").height();
    var ul = $(".iphone ul");
    var isTrans = supportCss3('transition');
	$('#fullPage').fullpage({
        anchors:['Page0','Page1', 'Page2', 'Page3', 'Page4'],
        'navigation': true,
        onLeave: function(index, nextIndex, direction) {
            switch (location.hash) {
                case "#Page0":
                    if (isTrans){
                        ul.get(0).className="p1";
                    } else {
                        ul.animate({
                            top: -0 * phoneH + "px"
                        });
                    }
                    $(".iphone").fadeIn();
                    break;
				case "#Page1":
					if (isTrans){
						ul.get(0).className="p2";
					} else {
						ul.animate({
							top: -0 * phoneH + "px"
						});
					}
					$(".iphone").fadeIn();
					break;
				case "#Page2":
					if (isTrans){
						ul.get(0).className="p3";
					} else {
						ul.animate({
							top: -1 * phoneH + "px"
						});
					}
					$(".iphone").fadeIn();
					break;
				case "#Page3":
					if (isTrans){
						ul.get(0).className="p4";
					} else {
						ul.animate({
							top: -2 * phoneH + "px"
						});
					}
					$(".iphone").fadeIn();
					break;
                case "#Page4":
					if (isTrans){
						ul.get(0).className="p5";
					} else {
						ul.animate({
							top: -3 * phoneH + "px"
						});
					}
					$(".iphone").fadeIn();
					break;
				default:
			}
        },
	});
})


function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function(string) {
            return string.replace(/-(\w)/g, function($0, $1) {
                return $1.toUpperCase();
            });
        };

    for (i in prefix)
        humpString.push(_toHumb(prefix[i] + '-' + style));

    humpString.push(_toHumb(style));

    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;

    return false;
}