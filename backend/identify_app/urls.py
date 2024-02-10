from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_image, name='predict_image'),
    # path('upload/', views.upload_image, name='upload_image'),
    path('test-get/', views.test_get_request, name='get_request'),
    # Test urls
    # path('test/', views.test, name='test'),
]
