from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from identify_app.models import Plant, User



class TestPlantDetails(TestCase):

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            'testuser0', 'testuser@gmail.com', 'testuser1234')


    def test__save_plant_details_complete(self):
        data = {
            'username': 'testuser0',
            'scientific_name': 'a nice plant et. al.',
            'common_name': 'Nice Plant',
            'conservation_status': 'CR',
            'gps_coordinates': '123.0,123.0',
            'confidence': '0.5'
        }
        with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
            data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
        response = self.client.post(reverse("save_plant_details"), data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Plant.objects.filter(common_name="Nice Plant").exists())


    def test_save_plant_details_missing_user(self):
        data = {
            'scientific_name': 'a nice plant et. al.',
            'common_name': 'Nice Plant',
            'conservation_status': 'CR',
            'gps_coordinates': '123.0,123.0',
            'confidence': '0.5'
        }
        with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
            data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
        response = self.client.post(reverse("save_plant_details"), data)
        self.assertEqual(response.status_code, 404)
        response_json = response.json()
        self.assertIn('User not found', response_json['error'])

    def test_save_plant_details_missing_plant_data(self):
        data = {
            'scientific_name': 'a nice plant et. al.',
            'common_name': 'Nice Plant',
            'conservation_status': 'CR',
            'gps_coordinates': '123.0,123.0',
            'confidence': '0.5'
        }
        with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
            data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
        response = self.client.post(reverse("save_plant_details"), data)
        self.assertEqual(response.status_code, 404)
        response_json = response.json()
        self.assertIn('User not found', response_json['error'])

    def test_get_user_plants(self):
        data = {
            'username': 'testuser0',
            'scientific_name': 'a nice plant et. al.',
            'common_name': 'Nice Plant',
            'conservation_status': 'CR',
            'gps_coordinates': '123.0,123.0',
            'confidence': '0.5'
        }
        with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
            data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
        response = self.client.post(reverse("save_plant_details"), data)
        self.assertEqual(response.status_code, 200)

        # kwargs https://stackoverflow.com/questions/33173943/django-reverse-using-kwargs
        get_user_plant_response = self.client.get(reverse("get_user_plants", kwargs={'username': 'testuser0'}))
        print(get_user_plant_response)
        self.assertEqual(get_user_plant_response.status_code, 200)
    
    def test_get_user_plants_with_details(self):
        data = {
            'username': 'testuser0',
            'scientific_name': 'a nice plant et. al.',
            'common_name': 'Nice Plant',
            'conservation_status': 'CR',
            'gps_coordinates': '123.0,123.0',
            'confidence': '0.5'
        }
        with open('test_images/hibiscus_rosa_sinensis.jpg', 'rb') as inputimg:
            data['file'] = SimpleUploadedFile(inputimg.name, inputimg.read())
        response = self.client.post(reverse("save_plant_details"), data)
        self.assertEqual(response.status_code, 200)

        # kwargs https://stackoverflow.com/questions/33173943/django-reverse-using-kwargs
        get_user_plant_with_details_response = self.client.get(reverse("get_user_plants_with_details", kwargs={'username': 'testuser0'}))
        print(get_user_plant_with_details_response)
        self.assertEqual(get_user_plant_with_details_response.status_code, 200)

    def test_get_user_plants_nonexistent_user(self):
        response = self.client.get(reverse('get_user_plants', kwargs={'username': 'randomuser'}))
        self.assertEqual(response.status_code, 404)

    def test_get_user_plants_with_details_nonexistent_user(self):
        response = self.client.get(reverse('get_user_plants_with_details', kwargs={'username': 'randomuser'}))
        self.assertEqual(response.status_code, 404)
    