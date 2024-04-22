from django.test import TestCase
from django.urls import reverse
from identify_app.models import Feedback


class FeedbackViewTestCase(TestCase):
    def test_feedback(self):
        feedback_data = {
            'username': 'testuser0',
            'subject': 'just a test',
            'description': 'Here is a description'
        }
        response = self.client.post(reverse('submit_feedback'), feedback_data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Feedback.objects.filter(subject='just a test').exists())
        response_data = response.json()
        self.assertEqual(response_data['message'], 'Feedback submitted successfully!')

    def test_feedback_missing_user(self):
        feedback_data = {
            'subject': 'just a test',
            'description': 'Here is a description'
        }
        response = self.client.post(reverse('submit_feedback'), feedback_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        response_data = response.json()
        self.assertIn('NOT NULL constraint failed', response_data['error'])

    def test_feedback_missing_field(self):
        feedback_data = {
            'username': 'testuser0',
            'description': 'Here is a description'
        }
        response = self.client.post(reverse('submit_feedback'), feedback_data, content_type='application/json')
        self.assertEqual(response.status_code, 500)
        response_data = response.json()
        self.assertIn('NOT NULL constraint failed', response_data['error'])