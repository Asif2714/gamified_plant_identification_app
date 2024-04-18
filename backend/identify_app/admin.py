from django.contrib import admin

from .models import User, Plant, Achievement, UserMetrics, Feedback
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register(Plant)
admin.site.register(Achievement)
admin.site.register(UserMetrics)
admin.site.register(User)
admin.site.register(Feedback)

