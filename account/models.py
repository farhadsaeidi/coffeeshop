from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from functools import partial
import os
import datetime
import uuid


class MyUserManager(BaseUserManager):
    def create(self, fullname, identifier, phone, password=None, user_type="Person"):
        user = self.model(
            fullname=fullname,
            identifier=identifier,
            phone=phone
        )
        user.type = user_type
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, fullname, identifier, phone, password, user_type="Person"):
        user = self.create(
            fullname=fullname,
            identifier=identifier,
            phone=phone,
            password=password
        )
        user.type = user_type
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save(using=self._db)
        return user

def upload_file(request, filename, upload_dir):
    now_time = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    # اگه دو نفر همزمان فایلی با اسم یکسان آپلود کنن، به خاطر استفاده همزمان ممکنه تداخل پیش بیاد
    # بهتره یه شناسه‌ی منحصربه‌فرد (مثل UUID) داشته باشیم
    unique_id = uuid.uuid4().hex[:6]  # یه کد ۶ کاراکتری منحصربه‌فرد
    new_filename = f"{now_time}_{unique_id}_{filename}"
    return os.path.join(upload_dir, new_filename)


def default_file(default_dir, filename):
    return os.path.join(default_dir, filename)


# ساختن یوزر سفارشی خودمون به‌جای یوزر پیش فرض جنگو
class MyUser(AbstractBaseUser):
    class USER_TYPES(models.TextChoices):
        # از سمت چپ اولی توی دیتابیس ذخیره میشه دومی جهت نمایش
        SELECT = "--Select--", "--انتخاب کنید--"
        PERSON = "Person", "حقیقی"
        LEGAL = "Legal", "حقوقی"

    type = models.CharField(max_length=10, choices=USER_TYPES.choices, default=USER_TYPES.SELECT)
    fullname = models.CharField(max_length=100, blank=True, null=True)
    identifier = models.CharField(max_length=10, unique=True)
    phone = models.CharField(max_length=11, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    image = models.ImageField(
        upload_to=partial(upload_file, upload_dir="user/upload/"),
        default=partial(default_file, default_dir="user/default/", filename="user3.png")
    )
    otp = models.PositiveIntegerField(blank=True, null=True)
    otp_time = models.DateTimeField(auto_now=True, blank=True, null=True)

    USERNAME_FIELD = "identifier"
    REQUIRED_FIELDS = ["fullname", "phone"]
    objects = MyUserManager()

    class Meta:
        ordering = ["-created"]
        indexes = [
            models.Index(fields=['-created']),
        ]

    def __str__(self):
        if self.fullname:
            return f"{self.fullname}"

    # برای مدیریت سطح دسترسی کاربران
    @staticmethod
    def has_perm(perm, obj=None):
        return True

    # برای مدیریت سطح دسترسی کاربران
    @staticmethod
    def has_module_perms(app_label):
        return True
