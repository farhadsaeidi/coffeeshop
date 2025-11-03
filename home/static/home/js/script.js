// اسلایدر مربوط به محصولات پرفروش
const swiper = new Swiper(".swiper", {
    slidesPerView: 2,
    spaceBetween: 12,
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
    },
    breakpoints: {
        640: {
            slidesPerView: 3,
            spaceBetween: 12,
        },
        896: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1280: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        1536: {
            slidesPerView: 5,
            spaceBetween: 25,
        },
    }
});

// تابع برای زمانی که بخوایم المان های دیوهای خاصی حداقل عرض یکسان داشته باشن
(() => {
    function setEqualMinWidth() {
        const containers = document.querySelectorAll('.set-equa-min-width');

        // اگر عرض کوچکتر مساوی 640 یا بزرگتر از 845 باشه، minWidth رو پاک کن
        if (window.innerWidth > 845 || window.innerWidth < 640) {
            containers.forEach(container => {
                const flexItems = container.querySelectorAll('.flex-item');
                if (flexItems.length === 0) return;
                flexItems.forEach(item => {
                    item.style.minWidth = '';
                });
            });
        } else {
            containers.forEach(container => {
                const flexItems = container.querySelectorAll('.flex-item');
                if (flexItems.length === 0) return;

                // ابتدا همه المان ها را به حالت عادی برگردان
                flexItems.forEach(item => {
                    item.style.minWidth = '';
                });
                let maxWidth = 0;
                // پیدا کردن بزرگترین عرض
                flexItems.forEach(item => {
                    const width = item.offsetWidth;
                    if (width > maxWidth) maxWidth = width;
                });

                // اعمال عرض یکسان
                flexItems.forEach(item => {
                    item.style.minWidth = `${maxWidth}px`;
                });
            });
        }
    }
    // اجرا پس از لود صفحه
    document.addEventListener('DOMContentLoaded', function () {
        setEqualMinWidth();
    });
    // اجرا هنگام تغییر سایز صفحه با debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setEqualMinWidth, 100);
    });
})();
