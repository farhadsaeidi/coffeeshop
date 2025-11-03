from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView  # برای لوگوی سایت یا نرم افزار

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("home.urls", namespace="product")),
    # path("account/", include("account.urls", namespace="account")),
    path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'icons/logo.png')),  # لوگو
]

if settings.DEBUG:  # مربوط به پوشه media
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
