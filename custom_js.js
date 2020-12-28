//MixItUp FILTERING

// Set the reference to the container
var containerEl = document.getElementById("WorksContent");
// Call the MixitUp to that container
var mixer = mixitup(containerEl, {
    controls: {
        toggleDefault: 'all',
        //toggleFilterButtons: true,
        toggleLogic: 'or'
    },
    selectors: {
        target: '[data-ref="mix"]'
    },
    animation: {
        enable: false,
        effects: 'fade',
        duration: 200
    }
});
//


//INITIAL HIDDEN ELEMENTS




function pageIsLoaded() {

        [].forEach.call(document.querySelectorAll('.initial-hide'), function (el) {
        el.style.visibility = 'visible';
    });
}
document.addEventListener('DOMContentLoaded', pageIsLoaded);




//PRELOADER


$(function () {
    function loadbar() {
        //var topTitle = document.getElementById("TopTitle");
        var stickyMenu = document.getElementById("StickyMenu");
        var title = document.getElementById("FooterTitle");
        //var line = document.getElementById("FooterLine");
        stickyMenu.style.width = "45%";
        title.innerHTML = "Loading";
        //img = document.images,
        var img = document.querySelectorAll("img.work-image"),
            c = 0,
            tot = img.length;

        console.log("images to load: ", img.length);

        var totalImgs = document.images,
            c = 0,
            total = totalImgs.length;
        console.log("total images: ", totalImgs.length);
        //
        if (tot == 0) return doneLoading();
        //
        function imgLoaded() {
            c += 1;
            var perc = ((100 / tot * c) << 0);
            //topLine.style.width = perc;
            //line.style.width = perc;
            stickyMenu.style.width = 45 + (perc / 2) + "%";
            title.innerHTML = "";
            title.innerHTML = "Loading " + perc + "%";
            if (c === tot) return doneLoading();
        }
        //
        function doneLoading() {
            title.innerHTML = "";
            title.innerHTML = "Portfolio.2020";

            stickyMenu.style.width = "100%";
            console.log('Initial images loaded!.');
            // simulate CLICK
            setTimeout(function () {
                //document.getElementById("MenuTitle").click();
            }, 1000);
        }
        //
        for (var i = 0; i < tot; i++) {
            var tImg = new Image();
            tImg.onload = imgLoaded;
            tImg.onerror = imgLoaded;
            tImg.src = img[i].src;
        }
    }
    document.addEventListener('DOMContentLoaded', loadbar, false);
}());

// SCROLL INTO VIEW

$(window).scroll(allInView);
//
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
//

function allInView() {
    // work thumbnails showing up too soon
    if (isScrolledIntoView(document.getElementById("WorksContent"))) {
        document.getElementById("WorksContent").style.pointerEvents = "initial";
        document.getElementById("WorksContent").style.opacity = "1";
    } else {
        document.getElementById("WorksContent").style.pointerEvents = "none";
        document.getElementById("WorksContent").style.opacity = "0.5";
    }
    //
    if (isScrolledIntoView(document.getElementById("aboutTable01"))) {
        document.getElementById("CVTitle02").style = "display:none";
        document.getElementById("CVTitle01").style = "display:block";
    }
    if (isScrolledIntoView(document.getElementById("aboutTable02"))) {
        document.getElementById("CVTitle01").style = "display:none";
        document.getElementById("CVTitle02").style = "display:block";
    }
}

// PROJECT LOADING LOGIC

var workItems = document.getElementsByClassName("work-item");
var main_img = $(".project-main-img");
var project_label = $(".project-title-label");
var project_title = $(".project-title");
var project_copy = $(".project-copy");
var url_prefix = "https://raulhernandez.co.uk/web2020/imgs/";
var activeWorkIndex = 0;
//
var onClick = function () {
    // scroll to section top
    $('html,body').animate({
        scrollTop: $('.section-works').offset().top
    }, 1000);
    // get img url from custom data
    var data_url = this.getAttribute("data-src");
    var project_url = url_prefix.concat(data_url);
    console.log("Loading img: ", project_url);
    //remove webflow attr
    main_img.removeAttr("srcset");
    $(".project-main-bg").css("background-color", "rgba(232, 236, 241, 1)");
    main_img.fadeTo(0, 0);
    // replace url from image
    main_img.attr("src", project_url);
    main_img.on('load', function () {
        $(".project-main-bg").animate({
            backgroundColor: "rgba(0, 0, 0, 0)"
        }, 500);
        main_img.fadeTo(500, 1);
        console.log("img Loaded: ", project_url);
    });
    // update text
    project_label.text(this.getAttribute("data-title"));
    project_title.text(this.getAttribute("data-title"));
    project_copy.text(this.getAttribute("data-copy"));

    // get & apply filter tags
    applyFilterClass(this);

    // load secondary images
    $(".project-img").fadeTo(0, 0);
    $(".project-img").removeAttr("srcset");
    $(".project-img").first().attr("src", url_prefix.concat(this.getAttribute("data-src2")));
    $(".project-img").last().attr("src", url_prefix.concat(this.getAttribute("data-src3")));
    $(".project-img").on('load', function () {
        $(".project-img").fadeTo(500, 1);
    });

    // active work item
    activeWorkIndex = $.inArray(this, workItems);
    //flow me
    flowTextMe(project_label);
};
//
for (var i = 0; i < workItems.length; i++) {
    workItems[i].addEventListener("click", onClick, false);
}
//
function applyFilterClass(elem) {
    // get all the classes from element
    var classList = elem.className.split(/\s+/);
    // create a list of filter classes
    var classListFilters = [];
    for (var i = 0; i < classList.length; i++) {
        if (classList[i].startsWith("filter")) {
            classListFilters.push(classList[i]);
        };
    }
    // update project tags with list of filters
    $(".project-tags").children().not(':first').remove();
    $(".project-tag").children().text(classListFilters[0].substring(7));
    if (classListFilters.length > 1) {

        for (var i = 1; i < classListFilters.length; i++) {
            var newTag = $(".project-tag").first().clone().appendTo(".project-tags");
            newTag.children().text(classListFilters[i].substring(7));

        }
    }
    console.log("filters length: ", classListFilters.length);
}
// Setup second images click events
$(".project-img-block").click(function () {
    // store
    var main_img_src = main_img.attr("src");
    jQuery(this).children("img").removeAttr("srcset");
    var second_img = jQuery(this).children("img");
    var second_img_src = jQuery(this).children("img").attr("src");
    // replace
    main_img.attr("src", second_img_src);
    second_img.attr("src", main_img_src);
    second_img.on('load', function () {
        second_img.hide();
        second_img.fadeIn(350);
    });
});
//
$(".project-prev").click(function () {

    console.log("Active work project: ", workItems[activeWorkIndex]);
});
//
function flowTextMe(elem) {
    elem.css("font-size", "260px");
    elem.flowtype({
        minFont: 50,
        maxFont: 250,
        fontRatio: 7
    });
    console.log(elem.css('font-size'));
}
