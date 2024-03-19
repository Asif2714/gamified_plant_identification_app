from django.contrib import admin

from .models import User, Plant
# from rest_framework.authtoken.models import Token


# Register your models here.

admin.site.register(User)
admin.site.register(Plant)


# class TokenAdmin(admin.ModelAdmin):
#     list_display = ('key', 'user', 'created')
#     fields = ('user',)
#     ordering = ('-created',)
#     autocomplete_fields = ('user',)


# # Commenting this out makes it work
# admin.site.register(Token, TokenAdmin)