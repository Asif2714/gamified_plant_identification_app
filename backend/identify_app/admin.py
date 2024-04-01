from django.contrib import admin

from .models import User, Plant, Achievement, UserMetrics
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.
admin.site.register(Plant)
admin.site.register(Achievement)
admin.site.register(UserMetrics)

# Linking Achievement inline with User
class AchievementInline(admin.StackedInline):
    model = Achievement
    can_delete = False
    verbose_name_plural = 'achievements'

class UserAdmin(BaseUserAdmin):
    inlines = (AchievementInline, )

# Check if the User model is already registered and if so, unregister
# Updating the existing Users with the inline view for achievements
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass 

admin.site.register(User, UserAdmin)