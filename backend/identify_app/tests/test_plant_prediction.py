from django.test import TestCase, Client
from django.urls import reverse
from identify_app.models import User, Plant
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from pathlib import Path


class PredictImageTest(TestCase):
    def setUp(self):
        # setting up the client
        self.client = Client()


    def test_predict_image_valid_image(self):
        # testing with a valid and good image
        image_path = Path('test_images/Trifolium fragiferum L..jpg')
        with image_path.open('rb') as image_file:
            image = SimpleUploadedFile(image_path.name, image_file.read(), content_type="image/jpeg")
        
        response = self.client.post(reverse("predict_image"), {'file': image}, format='multipart')
        self.assertEqual(response.status_code, 200)

        # checking the response
        response_json = response.json()
        print(response_json)
        
        self.assertIn('Trifolium', response_json['scientific_name'])

    def test_predict_image_invalid_image(self):
        # testing with a bad image - plain black jpg - should give low confidence
        image_path = Path('test_images/blackvoid.jpg')
        with image_path.open('rb') as image_file:
            image = SimpleUploadedFile(image_path.name, image_file.read(), content_type="image/jpeg")
        
        response = self.client.post(reverse("predict_image"), {'file': image}, format='multipart')
        self.assertEqual(response.status_code, 200)

        # checking the response
        response_json = response.json()
        print(response_json)
        
        self.assertIn('Confidence too low', response_json['error'])