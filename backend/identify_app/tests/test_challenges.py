from django.test import TestCase
from django.urls import reverse
from identify_app.models import User
import json
from django.core.files.uploadedfile import SimpleUploadedFile


class ChallengesPageTest(TestCase):
    def setUp(self):
        # Registering a user first, then we do respective tests
        self.username = "testuserx"
        user_data = {
        'username': self.username,
        'email': 'testuserx@gmail.com',
        'password': 'testpass',
        'first_name': 'Condition',
        'last_name': 'Zero'
        }
        # need json dump instead of direct  post as it expects json utf-8
        response = self.client.post(reverse('register'), json.dumps(user_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='testuserx').exists())

        # Adding some plants 
        for i in range (5):
            data = {
                'username': 'testuserx',
                'scientific_name': f'a nice plant et. al. No.{i}',
                'common_name': f'Nice Plant No.{i}',
                'conservation_status': 'CR',
                'gps_coordinates': '123.0,123.0',
                'confidence': '0.5'
            }
            with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
                data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
            response = self.client.post(reverse("save_plant_details"), data)
            self.assertEqual(response.status_code, 200)

    def test_get_user_plant_counts(self):
        response = self.client.get(reverse('get_user_plant_counts', kwargs={'username': self.username}))
        self.assertEqual(response.status_code, 200)
        responseJson = response.json()
        # print(responseJson)
        self.assertIn('CR',responseJson["rarity_counts"][0]['rarity'])

    def test_get_user_achievements(self):
        response = self.client.get(reverse('get_user_achievements', kwargs={'username': self.username}))
        self.assertEqual(response.status_code, 200)
        responseJson = response.json()
        # print("HELLO",responseJson)
        self.assertEqual(True,responseJson["five_identifications"])

    def test_get_user_metrics(self):
        response = self.client.get(f"{reverse('get_user_metrics')}?username={self.username}")
        self.assertEqual(response.status_code, 200)
        responseJson = response.json()
        # print("HELLO",responseJson)
        self.assertEqual(0.5,responseJson['user_metrics']['accuracy'])
