from django.test import TestCase, Client
from django.urls import reverse
from identify_app.models import User, Plant
from django.utils import timezone

class HomePageFeedTest(TestCase):
    def setUp(self):
        self.client = Client()
        # creating users and some plants
        testuser1 = User.objects.create_user(username='testuser1', password='testuser1234')
        testuser2 = User.objects.create_user(username='testuser2', password='testuser1234')
        
        # creating plants for both users
        # sci name needs to be unique
        for i in range(10):
            Plant.objects.create(
                user=testuser1, 
                scientific_name=f'{i}-sciname', 
                common_name=f'{i}-commonname',
                rarity="EN",
                gps_coordinates="123.0,122.0",
                image="testimageFile.jpg",
                confidence=45,
                date_time_taken=timezone.now(),
            )
            Plant.objects.create(
                user=testuser2, 
                scientific_name=f'{i}-sciname', 
                common_name=f'{i}-commonname',
                rarity="EN",
                gps_coordinates="123.0,122.0",
                image="testimageFile.jpg",
                confidence=45,
                date_time_taken=timezone.now(),
            )

    def test_get_plants_for_homepage(self):
        response = self.client.get(reverse('get_plants_for_homepage'))
        self.assertEqual(response.status_code, 200)
        responsejson = response.json()
        print(responsejson)
        self.assertEqual(len(responsejson), 10)