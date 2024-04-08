from django.test import TestCase
from django.urls import reverse
from identify_app.models import Feedback


class FeedbackViewTestCase(TestCase):
    def test_eedback(self):
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