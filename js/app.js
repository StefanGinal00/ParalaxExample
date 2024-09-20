const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");
let xValue = 0, yValue = 0;

let rotate = 0;

window.addEventListener('load', function() {
    setTimeout(function() {
        var preloader = document.getElementById('preloader');
        preloader.style.display = 'none';

        var nav = document.querySelector('nav');
        nav.style.display = 'flex'; // Or 'flex', 'grid', etc. depending on your layout
    }, 1000); // Delay of 2 seconds
});

function update(cursorPostition){
    parallax_el.forEach(el => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;
        let speedz = el.dataset.speedz;
        let rotatespeed = el.dataset.rotation;
        
        let isDown = parseFloat(getComputedStyle(el).right) < window.innerHeight / 2 ? 1 : -1;
        let zValue = (cursorPostition - parseFloat(getComputedStyle(el).right)) * isDown * 0.1;

        el.style.transform = `translateX(calc(-50% + ${-xValue * speedx}px)) 
        translateY(calc(-50% + ${yValue * speedy}px)) perspective(2300px) translateZ(${zValue * speedz}px)
        rotateY(${rotate * rotatespeed}deg)`;
    });
}

update(0);

let throttleTimeout;

window.addEventListener('mousemove', (e) => {
    if (throttleTimeout) {
        // Skip this event if we're still waiting for the previous one to finish
        return;
    }

    throttleTimeout = setTimeout(() => {
        throttleTimeout = null; // Allow future events to proceed

        var mainRect = main.getBoundingClientRect();
        var mainBottom = mainRect.top + window.scrollY + mainRect.height;

        if (window.scrollY < mainBottom) {
            xValue = e.clientX - window.innerWidth /2;
            yValue = e.clientY - window.innerHeight /2;
        
            rotate = xValue / (window.innerWidth / 2) *10;

            update(e.clientY);
        }
    }, 70); // Adjust this value to your needs
});

window.addEventListener('resize', () => {
    xValue = window.innerWidth / 2;
    yValue = window.innerHeight / 2;

    if(window.innerWidth >= 725 ){
        main.style.maxHeight = `${window.innerWidth * 0.6}px`;
    } else {
        main.style.maxHeight = `${window.innerWidth * 1.6}px`;
    }

    update(xValue);
});


window.addEventListener('onscroll', function() {
    var nav = document.querySelector('nav');
    var sticky = nav.offsetTop;

    function stickyNav() {
        if (window.scrollY > sticky) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    }
});

window.addEventListener('scroll', function() {
    var scrollPosition = window.scrollY;
    var windowHeight = window.innerHeight;

    var line = document.querySelector('nav ul #line');
    var links = document.querySelectorAll('nav ul a');

    var totalHeight = 0;
    var currentHeight = 0;

    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var target = document.querySelector(link.getAttribute('href'));

        if (target) {
            var targetHeight = target.offsetHeight;
            totalHeight += targetHeight;

            if (scrollPosition >= currentHeight && scrollPosition < currentHeight + targetHeight) {
                var sectionScroll = (scrollPosition - currentHeight) / targetHeight;
                line.style.setProperty("--scroll", `${sectionScroll * 100}%`);
                line.style.setProperty("--glow", `${sectionScroll}`);
            }

            currentHeight += targetHeight;
        }
    }
});