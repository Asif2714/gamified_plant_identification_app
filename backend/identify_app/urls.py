from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_image, name='predict_image'),
    path('test-get/', views.test_get_request, name='get_request'),
]
