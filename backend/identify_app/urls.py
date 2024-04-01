from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_image, name='predict_image'),
    path('test-get/', views.test_get_request, name='get_request'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('user-details/', views.get_user_details, name='user-details'),
    path('logout/', views.logout, name='logout'),
    path('save-plant-details/', views.save_plant_details, name='save_plant_details'),
    path('get-user-plants/<str:username>/', views.get_user_plants, name='get_user_plants'),
    path('get-user-plants-with-details/<str:username>/', views.get_user_plant_with_details, name='get_user_plants_with_details'),
    path('leaderboard/', views.get_leaderboard, name='get_leaderboard'),
    path('plants-for-homepage/', views.get_plants_for_homepage, name='get_plants_for_homepage'),
    path('get-user-plant-counts/<str:username>/', views.get_user_plant_counts, name='get_user_plant_counts'),
    path('get-user-achievements/<str:username>/', views.get_user_achievements, name='get_user_achievements'),
    path('get-user-metrics/', views.get_user_metrics, name='get-user-metrics'),
]
