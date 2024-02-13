from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from pathlib import Path
import os
import json

# Create your tests here.



class PredictImageTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_predict_image_post_with_image(self):

        image_path = Path('./test_images/Humulus lupulus L..jpg')

        with image_path.open('rb') as image_file:
            image = SimpleUploadedFile(image_path.name, image_file.read(), content_type="image/jpeg")

        response = self.client.post(reverse('predict_image'), {'file': image})
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        print("DATA:"+str(response_data))
        self.assertIn('Predicted Class', response_data)


    def test_predict_image_post_without_image(self):
        response = self.client.post(reverse('predict_image'))
        
        self.assertEqual(response.status_code, 200) #TODO: update this to different code
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'No image provided')


    def test_predict_image_get_request(self):
        response = self.client.get(reverse('predict_image'))
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertEqual(response_data['error'], 'Invalid request method')