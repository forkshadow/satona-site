(function () {
    const MOBILE_BREAKPOINT = 1100;

    function getHeaderElements() {
        return {
            header: document.querySelector(".header"),
            logo: document.querySelector(".logo"),
            nav: document.querySelector(".nav"),
            lang: document.querySelector(".lang-switch"),
            burger: document.getElementById("burger"),
            mobileTab: document.getElementById("mobileTab"),
            mobileMenu: document.getElementById("mobileMenu")
        };
    }

    function updateScrollState() {
        const { header } = getHeaderElements();
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 50);
    }

    function checkHeaderFit() {
        const { header, logo, nav, lang, mobileMenu } = getHeaderElements();
        if (!header || !logo || !nav) return;

        let shouldUseBurger = window.innerWidth <= MOBILE_BREAKPOINT;

        if (!shouldUseBurger) {
            const wasBurgerActive = header.classList.contains("burger-active");

            if (wasBurgerActive) {
                header.classList.remove("burger-active");
            }

            const totalWidth =
                logo.offsetWidth +
                nav.scrollWidth +
                (lang ? lang.offsetWidth : 0) +
                60;

            shouldUseBurger = totalWidth > header.offsetWidth;
        }

        header.classList.toggle("burger-active", shouldUseBurger);

        if (!shouldUseBurger && mobileMenu) {
            mobileMenu.classList.remove("active");
        }
    }

    let headerFitRafId = null;
    function queueHeaderFitCheck() {
        if (headerFitRafId !== null) {
            cancelAnimationFrame(headerFitRafId);
        }

        headerFitRafId = requestAnimationFrame(() => {
            checkHeaderFit();
            headerFitRafId = null;
        });
    }

    function toggleMobileMenu() {
        const { mobileMenu } = getHeaderElements();
        if (!mobileMenu) return;
        mobileMenu.classList.toggle("active");
    }

    window.addEventListener("DOMContentLoaded", () => {
        const { burger, mobileTab } = getHeaderElements();

        if (burger) {
            burger.addEventListener("click", toggleMobileMenu);
        }

        if (mobileTab) {
            mobileTab.addEventListener("click", toggleMobileMenu);
        }

        updateScrollState();
        queueHeaderFitCheck();
    });

    window.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", queueHeaderFitCheck);
    window.addEventListener("load", queueHeaderFitCheck);
})();
