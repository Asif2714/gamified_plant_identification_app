from django.test import TestCase, Client
from django.urls import reverse
from identify_app.models import User


class TestLeaderBoard(TestCase):
    def setUp(self):

        # setting up client and some test users
        self.client = Client()
        testuser1 =User.objects.create_user(username='testuser1', password='testuser1234')
        testuser2 = User.objects.create_user(username='testuser2', password='testuser1234')
        testuser3 = User.objects.create_user(username='testuser3', password='testuser1234')

        # adding XP
        testuser1.experience_points = 150
        testuser1.save()
        testuser2.experience_points = 100
        testuser2.save()
        testuser3.experience_points = 300
        testuser3.save()


    def test_get_leaderboard(self):
        response = self.client.get(reverse('get_leaderboard'))
        self.assertEqual(response.status_code, 200)
        responsejson = response.json()
        print(responsejson)
        # first entry would be testuser3 with highest points
        # last user would be testuser2 with lowest points of 100
        self.assertEqual(responsejson[0]['username'], "testuser3")
        self.assertEqual(responsejson[-1]['username'], "testuser2")