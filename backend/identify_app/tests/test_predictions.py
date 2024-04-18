from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from pathlib import Path
import os
import json

class PredictImageTests(TestCase):
    """
    Tests for the prediction system in the API endpoint.

    """
    def setUp(self):
        self.client = Client()
        self.predict_image_url = reverse('predict_image')

    # Testing with a valid image
    def test_predict_image_with_image(self):

        image_path = Path('./test_images/Humulus lupulus L..jpg')

        with image_path.open('rb') as image_file:
            image = SimpleUploadedFile(image_path.name, image_file.read(), content_type="image/jpeg")

        # Reversing the views.py url
        response = self.client.post(self.predict_image_url, {'file': image})
        
        self.assertEqual(response.status_code, 200)
        # Uncomment for logging
        # response_data = json.loads(response.content)
        # print("DATA:"+str(response_data))
        self.assertIn('scientific_name', response.json())

    # Predict without a valid image
    def test_predict_image_without_image(self):
        response = self.client.post(self.predict_image_url)
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'No image provided')

    # Testing with wrong request type
    def test_predict_image_get_request(self):
        response = self.client.get(self.predict_image_url)
        
        self.assertEqual(response.status_code, 405)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'Invalid request method')

    # Testign with a non-image file
    def test_predict_image_with_unsupported_file(self):
        text_file_path = Path('./test_images/unsupported_file.txt')
        with text_file_path.open('rb') as text_file:
            text = SimpleUploadedFile(text_file_path.name, text_file.read(), content_type="text/plain")
        response = self.client.post(self.predict_image_url, {'file': text})
        self.assertEqual(response.status_code, 500) # For now, it is error 500, but afterwards can do 400 
        self.assertIn('error', response.json())