// ساختار روش IIFE برای اینکه کدها داخل اسکوپ خودشون بصورت لوکال نوشته بشن و با بقیه کدها تداخل نکنن <--- ;()({} <=())
// اینو آخرش مینویسن تا اجرا بشه <--- ()
// تنظیمات مربوط به اسکرول کردن باکس سبد خرید با گرب در صورتی که از کتابخانه ی OverlayScrollbar استفاده نشود
(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const cartBox = document.getElementById('cart-box');
        let isDragging = false; // آیا در حال دراگ هستیم؟
        let startY, scrollTop; // موقعیت شروع و مقدار اسکرول اولیه

        // فعال‌سازی دراگ هنگام کلیک ماوس
        cartBox.addEventListener('mousedown', (e) => {
            // اگر کاربر روی لینک یا دکمه کلیک کرد، دراگ فعال نشود
            if (e.target.closest('a, button')) return;

            // فعال کردن حالت دراگ
            isDragging = true;
            // ذخیره موقعیت عمودی ماوس نسبت به بالای المان
            startY = e.pageY - cartBox.offsetTop;
            // ذخیره مقدار فعلی اسکرول عمودی
            scrollTop = cartBox.scrollTop;
            // تغییر ظاهر کرسر به حالت درگ (مشت بسته)
            cartBox.classList.add('cursor-grabbing', 'select-none');
            cartBox.classList.remove('cursor-grab');
            // جلوگیری از رفتار پیش‌فرض مرورگر
            e.preventDefault();
        });

        // تابع پایان دراگ
        const endDrag = () => {
            // غیرفعال کردن حالت دراگ
            isDragging = false;
            // بازگرداندن ظاهر کرسر به حالت عادی
            cartBox.classList.remove('cursor-grabbing', 'select-none');
            cartBox.classList.add('cursor-grab');
        };

        // پایان دراگ هنگام رها کردن کلیک ماوس
        document.addEventListener('mouseup', endDrag);
        // پایان دراگ هنگام خارج شدن ماوس از صفحه
        document.addEventListener('mouseleave', endDrag);

        // حرکت دراگ
        document.addEventListener('mousemove', (e) => {
            // اگر در حالت دراگ نیستیم، کاری نکنیم
            if (!isDragging) return;

            // محاسبه موقعیت جدید ماوس
            const y = e.pageY - cartBox.offsetTop;
            // محاسبه میزان جابجایی (ضریب 2 برای سرعت بیشتر)
            const walk = (y - startY) * 2;
            // اعمال اسکرول جدید
            cartBox.scrollTop = scrollTop - walk;
            // جلوگیری از رفتار پیش‌فرض مرورگر
            e.preventDefault();
        });

        // جلوگیری از اسکرول صفحه اصلی هنگام استفاده از چرخ ماوس روی باکس
        cartBox.addEventListener('wheel', (e) => {
            e.stopPropagation();
        }, {passive: false});
    });
})();

// تنظیمات مربوط به اسکرولبار کل باکس هایی که میخوان از کتابخانه OverlayScrollbar بجای اسکرولبار پیش فرض مرورگر استفاده کنن
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        let scrollableElements = document.querySelectorAll('[data-scroll-box]');
        if (scrollableElements) {
            scrollableElements.forEach(element => {
                initializeOverlayScrollbar(element);
            });
        }
    });
    function initializeOverlayScrollbar(element) {
        let targetElement = element;
        if (targetElement) {
            return OverlayScrollbars(targetElement, {
                className: "os-theme-dark",
                scrollbars: {
                    // autoHide: 'never', // اسکرول‌بار همیشه قابل مشاهده است
                    // autoHide: 'scroll', // اسکرول بار با اسکرول کردن ظاهر و مخفی میشه
                    autoHide: 'move',  // اسکرول بار با حرکت موس ظاهر و مخفی میشه
                    clickScrolling: true,
                    autoHideDelay: 300,
                    theme: 'os-theme-dark',
                }
            });
        }
    }
})();

// تنظیمات مربوط به دکمه تم دارک و لایت
(() => {
    document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelectorAll('.btn-theme-switcher')) {
            const btnThemeSwitchers = document.querySelectorAll(".btn-theme-switcher");
            btnThemeSwitchers.forEach(btn => {
                themeSwitcherButton(btn);
            })
        }
    });
    function themeSwitcherButton(btn) {
        let targetBtn = btn;
        if (targetBtn) {
            targetBtn.addEventListener("click", () => {
                if (localStorage.theme === "dark") {
                    document.documentElement.classList.remove("dark");
                    localStorage.theme = "light";
                } else {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                }
            })
        }
    }
})();

// محو کردن باکس سبد خرید با کلیک روی دکمه های ادامه خرید، حذف سبد و بازگشت به فروشگاه
(() => {
    let cartBoxVanishBtns = document.querySelectorAll('.cart-box-vanish');
    let cartBox = document.getElementById('cart-box');
    let cartBoxEmpty = document.getElementById('cart-box-empty');

    // تابع برای محو کردن باکس سبد خرید
    const vanishBox = () => {
        if (cartBox) {
            cartBox.classList.remove('group-hover:!opacity-100', 'group-hover:!visible');
            // بازگردانی کلاس‌ها بعد از 0.5 ثانیه
            setTimeout(() => {
                cartBox.classList.add('group-hover:!opacity-100', 'group-hover:!visible');
            }, 500);
        }
        if (cartBoxEmpty) {
            cartBoxEmpty.classList.remove('group-hover:!opacity-100', 'group-hover:!visible');
            // بازگردانی کلاس‌ها بعد از 0.5 ثانیه
            setTimeout(() => {
                cartBoxEmpty.classList.add('group-hover:!opacity-100', 'group-hover:!visible');
            }, 500);
        }
    };

    if (cartBoxVanishBtns) {
        cartBoxVanishBtns.forEach(btn => {
            btn.addEventListener('click', vanishBox);
        });
    }
})();

// باز و بستن برگر منو
(() => {
    let burgerMenuIcon = document.getElementById('burger-menu-icon');
    let burgerMenuClose = document.getElementById('close-burger-menu');
    let burgerMenuPanel = document.getElementById('burger-menu-panel');
    let burgerMenuAuthentication = document.getElementById('burger-menu-authentication');
    let burgerMenuCart = document.getElementById('burger-menu-cart');
    let burgerMenuOverlay = document.getElementById('overlay');

    // تابع برای باز کردن منو
    const openMenu = () => {
        burgerMenuOverlay.classList.remove('opacity-0');
        burgerMenuOverlay.classList.add('opacity-50');
        burgerMenuOverlay.classList.remove('invisible');
        burgerMenuPanel.classList.remove('translate-x-full');
    };

    // تابع برای بستن منو
    const closeMenu = () => {
        burgerMenuOverlay.classList.remove('opacity-50');
        burgerMenuOverlay.classList.add('opacity-0');
        burgerMenuOverlay.classList.add('invisible');
        burgerMenuPanel.classList.add('translate-x-full');
    };

    // باز کردن پنل برگرمنو
    burgerMenuIcon.addEventListener('click', openMenu);

    // بستن پنل برگرمنو
    burgerMenuClose.addEventListener('click', closeMenu);

    // بستن پنل با کلیک روی اورلی
    burgerMenuOverlay.addEventListener('click', closeMenu);

    // بستن پنل با کلیک روی دکمه ورود و ثبت نام
    burgerMenuAuthentication.addEventListener('click', closeMenu);

    // بستن پنل با کلیک روی سبد خرید
    burgerMenuCart.addEventListener('click', closeMenu);

    // بستن منو در صورت تغییر اندازه صفحه
    window.addEventListener('resize', () => {
        burgerMenuOverlay.click();
    });
})();

// اکتیو یا غیر اکتیو کردن آیتمی از برگر منو که کلیک شده باشه
(() => {
    let panelItems = document.querySelectorAll('.panel-body-item');
    let shopItemArrowIcon = document.getElementById('shopItem-arrow-down');
    let submenu = document.getElementById('shopItem-submenu');

    // بازگشت به تنظیمات کارخانه!
    const returnToFactorySettings = () => {
        panelItems.forEach(el => el.classList.remove('active-burger-menu-item'));
        panelItems[0].classList.add('active-burger-menu-item');  // آیتم صفحه اصلی
    };
    panelItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();  // جلوگیری از تنظیمات پیش فرض
            e.stopPropagation();  // جلوگیری از اجرای لیسنر کل صفحه
            panelItems.forEach(el => el.classList.remove('active-burger-menu-item'));
            item.classList.add('active-burger-menu-item');
            shopItemArrowIcon.classList.add('transition-none');
        });
    });
    // Event listener ---> برای کل صفحه (document)
    document.addEventListener('click', (e) => {
        // closest() ---> یافتن نزدیک ترین والد
        // از محل دقیق کلیک (e.target) شروع کرده و به سمت بالا حرکت می‌کند تا نزدیک‌ترین والد با کلاس panel-body-item را پیدا کند
        let clickedOnPanelItem = e.target.closest('.panel-body-item');
        // اگر کلیک خارج از آیتم های پنل بادی برگر منو باشه (به جز آیتم های زیر منوی فروشگاه)، برو به تنظیمات کارخانه!
        if (!clickedOnPanelItem && !submenu.contains(e.target)) {
            returnToFactorySettings();
        }
    });
})();

// اکتیو یا غیر اکتیو کردن گزینه ای از زیرمنوی آیتم فروشگاه که کلیک شده باشه
(() => {
    document.querySelectorAll('.shop-submenu-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.shop-submenu-item').forEach(el => el.classList.remove('active-shop-submenu-item'));
            item.classList.add('active-shop-submenu-item');
        });
    });
})();

// باز و بستن زیر منوی آیتم فروشگاه
(() => {
    let openSubmenu = document.getElementById('open-shopItem-submenu');
    let submenu = document.getElementById('shopItem-submenu');
    let shopItemArrowdown = document.getElementById('shopItem-arrow-down');
    let submenuItems = document.querySelectorAll('.shop-submenu-item');

    if (openSubmenu && submenu && shopItemArrowdown) {
        // تابع برای بستن منو
        const closeMenu = () => {
            submenu.style.maxHeight = null;
            shopItemArrowdown.classList.remove('rotate-180');
            shopItemArrowdown.classList.add('rotate-0');
            openSubmenu.classList.remove('active-burger-menu-item');
            submenuItems.forEach(item => item.classList.remove('active-shop-submenu-item'));
        };
        // Event listener برای دکمه باز/بسته کردن منو
        openSubmenu.addEventListener('click', (e) => {
            e.preventDefault();  // جلوگیری از تنظیمات پیش فرض
            e.stopPropagation();  // جلوگیری از اجرای لیسنر کل صفحه

            let isOpen = submenu.style.maxHeight;
            if (isOpen) {
                closeMenu();
            } else {
                // باز کردن منو
                submenu.style.maxHeight = submenu.scrollHeight + "px";
                shopItemArrowdown.classList.remove('rotate-0');
                shopItemArrowdown.classList.add('rotate-180');
            }
            shopItemArrowdown.classList.remove('transition-none');
            shopItemArrowdown.classList.add('transition-all', 'duration-300', 'ease-in-out');
        });
        // Event listener ---> برای کل صفحه (document)
        document.addEventListener('click', (e) => {
            // چک می‌کنیم که آیا منو باز است یا نه
            let isOpen = submenu.style.maxHeight;

            // اگر منو باز بود و کلیک هم خارج از آیتم مورد نظر و هم خارج از آیتم های زیرمنو بود، آن را ببند
            if (isOpen && !openSubmenu.contains(e.target) && !submenu.contains(e.target)) {
                closeMenu();
            }
        });
    }
})();

// باز و بستن پنل سبد خرید
(() => {
    let cartBtns = document.querySelectorAll('.btn-cart');
    let cartPanel = document.getElementById('cart-panel');
    let cartPanelClose = document.getElementById('close-panel-cart');
    let cartPanelOverlay = document.getElementById('overlay');
    let panelCartVanishBtns = document.querySelectorAll('.panel-cart-vanish');

    // تابع برای باز کردن پنل سبد خرید
    const openMenu = () => {
        cartPanelOverlay.classList.remove('opacity-0');
        cartPanelOverlay.classList.add('opacity-50');
        cartPanelOverlay.classList.remove('invisible');
        cartPanel.classList.remove('-translate-x-full');
        cartPanel.classList.add('translate-x-full');
    };

    // تابع برای بستن پنل سبد خرید
    const closeMenu = () => {
        cartPanel.classList.remove('translate-x-full');
        cartPanel.classList.add('-translate-x-full');
        cartPanelOverlay.classList.remove('opacity-50');
        cartPanelOverlay.classList.add('opacity-0');
        cartPanelOverlay.classList.add('invisible');
    };

    // باز کردن پنل سبد خرید
    cartBtns.forEach(btn => {
        btn.addEventListener('click', openMenu);
    });

    // بستن پنل سبد خرید با کلیک روی دکمه بستن
    cartPanelClose.addEventListener('click', closeMenu);

    // بستن پنل سبد خرید با کلیک روی دکمه ادامه خرید، حذف سبد و بازگشت به فروشگاه
    // چون ممکنه این قسمت از کد کامنت شده باشه ایف گذاشتم تا ارور نده
    if (panelCartVanishBtns) {
        panelCartVanishBtns.forEach(btn => {
            btn.addEventListener('click', closeMenu);
        });
    }

    // بستن سبد خرید با کلیک روی اورلی
    cartPanelOverlay.addEventListener('click', closeMenu);

    // بستن منو در صورت تغییر اندازه صفحه
    window.addEventListener('resize', () => {
        cartPanelOverlay.click();
    });
})();

// این بلاک برای این نوشته شده که اگه فرزندان یک المان داخل یک ردیف باشن
// و محتوای فرزندان کل ردیف رو اشغال کنن و wrap اتفاق بیفته، فرزندان وسط چین بشن
(() => {
    // المان مورد نظر
    let rows = document.querySelectorAll('.row-content-full');

    rows.forEach(row => {
        // فرزندان مستقیم المان مورد نظر رو به صورت آرایه برمیگردونه
        let children = Array.from(row.children);

        // فرزندان حداقل باید دو تا باشن تا wrap اتفاق بیفته
        if (children.length >= 2) {
            let firstChild = children[0];
            let lastChild = children[children.length - 1];

            // اطلاعات موقعیت و اندازه فرزندان اول و آخر
            let firstRect = firstChild.getBoundingClientRect();
            let lastRect = lastChild.getBoundingClientRect();

            // اگر top آنها متفاوت باشد و در یک راستا نباشن، یعنی wrap شده
            let isWrapped = Math.abs(firstRect.top - lastRect.top) > 5;

            if (isWrapped) {
                row.classList.remove('justify-between');
                row.classList.add('justify-center');
            } else {
                row.classList.remove('justify-center');
                row.classList.add('justify-between');
            }
        }
    });
})();

// این بلاک مربوط به دکمه های رفتن به پایین صفحه، رفتن به اول صفحه و دکمه شناور رفتن به اول صفحه هست
(() => {
    const goToFooterBtn = document.getElementById('go-to-footer');
    if (goToFooterBtn) {
        goToFooterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const os = window.OverlayScrollbars ? window.OverlayScrollbars(document.body) : null;
            if (os && typeof os.scroll === 'function') {
                os.scroll({y: '100%'}, 400);
            } else {
                const viewport = document.querySelector('.os-viewport') || document.scrollingElement || document.documentElement;
                const scrollHeight = Math.max(viewport.scrollHeight || 0, document.body.scrollHeight, document.documentElement.scrollHeight);
                (viewport.scrollTo ? viewport.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                }) : window.scrollTo({top: scrollHeight, behavior: 'smooth'}));
            }
        });
    }

    const goToHeaderBtn = document.getElementById('go-to-header');
    if (goToHeaderBtn) {
        goToHeaderBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const os = window.OverlayScrollbars ? window.OverlayScrollbars(document.body) : null;
            if (os && typeof os.scroll === 'function') {
                os.scroll({y: 0}, 400);
            } else {
                const viewport = document.querySelector('.os-viewport') || document.scrollingElement || document.documentElement;
                (viewport.scrollTo ? viewport.scrollTo({top: 0, behavior: 'smooth'}) : window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                }));
            }
        });
    }

    // Floating scroll-to-top button (appears after scrolling down, hides when near top)
    const scrollTopBtn = document.getElementById('btn-scroll-top');
    if (scrollTopBtn) {
        const se = document.scrollingElement || document.documentElement;

        const getScrollTop = () => {
            const os = window.OverlayScrollbars ? window.OverlayScrollbars(document.body) : null;
            const viewport = os && os.getElements ? os.getElements().viewport : document.querySelector('body .os-viewport');
            if (viewport) return viewport.scrollTop || 0;
            return se.scrollTop || 0;
        };

        const showBtn = () => {
            scrollTopBtn.classList.add('visible', 'opacity-100', 'translate-y-0');
            scrollTopBtn.classList.remove('invisible', 'opacity-0', 'translate-y-10');
        };

        const hideBtn = () => {
            scrollTopBtn.classList.add('invisible', 'opacity-0', 'translate-y-10');
            scrollTopBtn.classList.remove('visible', 'opacity-100', 'translate-y-0');
        };

        const threshold = Math.max(200, ((window.innerHeight || 800) * 0.25));

        const onScroll = () => {
            const y = getScrollTop();
            if (y > threshold) {
                showBtn();
            } else {
                hideBtn();
            }
        };

        // Always listen on window as a fallback
        window.addEventListener('scroll', onScroll, {passive: true});

        // After everything is loaded, also bind to OverlayScrollbars viewport if available
        const attachToViewportIfAvailable = () => {
            const os = window.OverlayScrollbars ? window.OverlayScrollbars(document.body) : null;
            const viewport = os && os.getElements ? os.getElements().viewport : document.querySelector('body .os-viewport');
            if (viewport && viewport.addEventListener) {
                viewport.addEventListener('scroll', onScroll, {passive: true});
                onScroll();
            }
        };
        window.addEventListener('load', attachToViewportIfAvailable);
        // Try shortly after in case OS initialized early
        setTimeout(attachToViewportIfAvailable, 300);

        // Initial state
        onScroll();

        scrollTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const os = window.OverlayScrollbars ? window.OverlayScrollbars(document.body) : null;
            if (os && typeof os.scroll === 'function') {
                os.scroll({y: 0}, 400);
            } else {
                const viewport = document.querySelector('body .os-viewport');
                if (viewport && viewport.scrollTo) {
                    viewport.scrollTo({top: 0, behavior: 'smooth'});
                } else {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }
        });
    }
})();
