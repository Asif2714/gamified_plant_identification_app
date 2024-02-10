from django.test import TestCase, Client
from django.urls import reverse
import os

# Create your tests here.
class ModelTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.predict_url = reverse('predict_image')