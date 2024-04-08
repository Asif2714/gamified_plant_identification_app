from django.test import TestCase, Client
from identify_app.models import User
from django.utils import timezone
from django.urls import reverse
import json


class ProfileSystemTestCase(TestCase):
    # Creating a user
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser0', 
            email='testuser0@gmail.com', 
            password='testpass'
        )
       
        # Creating a client to send HTTP requests
        self.client = Client()


    def test_register_user(self):
        user_data = {
        'username': 'testuserx',
        'email': 'testuserx@gmail.com',
        'password': 'testpass',
        'first_name': 'Condition',
        'last_name': 'Zero'
        }
        # need json dump instead of direct  post as it expects json utf-8
        response = self.client.post(reverse('register'), json.dumps(user_data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(username='testuserx').exists())


    def test_login(self):
        form_data = {
            'username': 'testuser0',
            'password': 'testpass'
        }
        response = self.client.post(reverse('login'), json.dumps(form_data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in response.json())

    def test_get_user_details(self):
        response = self.client.get(reverse('get_user_details'), {
            'username': 'testuser0'
        })
        self.assertEqual(response.status_code, 200)
        user_data = response.json()
        self.assertEqual(user_data['username'], 'testuser0')
        self.assertEqual(user_data['email'], 'testuser0@gmail.com')