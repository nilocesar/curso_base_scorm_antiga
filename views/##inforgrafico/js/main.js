$(function () {

 $("body").scorm_start(); /// inicaliza o scorm


setTimeout(function () {

            window.moveTo(0, 0);
            window.resizeTo(screen.width, screen.height);

            top.window.moveTo(0, 0);
            if (document.all) {
                top.window.resizeTo(screen.availWidth, screen.availHeight);
            } else if (document.layers || document.getElementById) {
                if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                    top.window.outerHeight = screen.availHeight;
                    top.window.outerWidth = screen.availWidth;
                }
            }

        }, 1000 * 0.2);




});


 $(window).unload(
    function () {
        $('body').scorm_quit();
    }
 );