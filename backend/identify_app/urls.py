from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_image, name='predict_image'),
    path('test-get/', views.test_get_request, name='get_request'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user-details/', views.get_user_details, name='user-details'),
    # path('logout/', views.login, name='logout'),
    # path('user/', views.login, name='login'),
]
