from django.test import TestCase
from django.contrib.auth import get_user_model
from identify_app.models import User, Achievement, UserMetrics, Plant, Feedback
from django.utils import timezone



#============================
# File for testing all Models
#============================

# Testing User
class UserTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser0', 
            email='testuser0@gmail.com', 
            password='testpass'
        )
        self.user.first_name = 'Condition'
        self.user.last_name = 'Zero'
        self.user.save()

    def test_user_created(self):
        self.assertEqual(self.user.username, 'testuser0')
        self.assertEqual(self.user.first_name, 'Condition')
        self.assertEqual(self.user.last_name, 'Zero')
        self.assertEqual(self.user.email, 'testuser0@gmail.com')


# Testing Achievements - requires a User
class AchievementTestCase(TestCase):
    def setUp(self):
        # creating related user
        self.user = User.objects.create_user(
            username='testuser0', 
            email='testuser0@gmail.com', 
            password='testpass'
        )

        # Creating and linking achievement
        self.achievement = Achievement.objects.create(user=self.user)
        self.achievement.first_identification=True
        self.achievement.first_critical=True
    
    def test_achievement(self):
        self.assertEqual(self.achievement.user, self.user)
        self.assertTrue(self.achievement.first_identification)
        self.assertTrue(self.achievement.first_critical)
        self.assertFalse(self.achievement.first_endangered)

# Testing Metrics - requires a User
class UserMetricsTestCase(TestCase):
    def setUp(self):
        # creating related user
        self.user = User.objects.create_user(
            username='testuser0', 
            email='testuser0@gmail.com', 
            password='testpass'
        )

        # Creating and linking metrics
        self.user_metrics = UserMetrics.objects.create(user=self.user)
        self.user_metrics.accuracy=100.0
        self.user_metrics.achiever=10.0
        self.user_metrics.consistency=15.0
        self.user_metrics.variety=12.0
        self.user_metrics.explorer=50.0

    def test_usermetrics(self):
        self.assertEqual(self.user_metrics.user, self.user)
        self.assertEqual(self.user_metrics.accuracy, 100.0)
        self.assertEqual(self.user_metrics.achiever, 10.0)
        self.assertEqual(self.user_metrics.consistency, 15.0)
        self.assertEqual(self.user_metrics.variety, 12.0)
        self.assertEqual(self.user_metrics.explorer, 50.0)


# Testing Plants - requires a User
class PlantTestCase(TestCase):
    def setUp(self):
        # creating related user
        self.user = User.objects.create_user(
            username='testuser0', 
            email='testuser0@gmail.com', 
            password='testpass'
        ) 

        # creating 2 plants for the user
        self.plant1 = Plant.objects.create(
            user=self.user, 
            scientific_name='Lavender sci name', 
            common_name='Lavender', 
            date_time_taken=timezone.now(),
            gps_coordinates='100.0,100.0',
            image='test1plant.jpg'
        )
        self.plant2 = Plant.objects.create(
            user=self.user, 
            scientific_name='Hibiscus rosa sinensis', 
            common_name='Chinese Hibiscus', 
            date_time_taken=timezone.now(),
            gps_coordinates='123.1,123.1',
            image='test2plant.jpg'
        )

    def test_plant_created(self):
        self.assertEqual(self.plant1.user, self.user)
        self.assertEqual(self.plant2.user, self.user)
        self.assertEqual(self.plant1.scientific_name, 'Lavender sci name')
        self.assertEqual(self.plant2.scientific_name, 'Hibiscus rosa sinensis')
        
        self.assertEqual(self.plant1.common_name, 'Lavender')
        self.assertEqual(self.plant2.common_name, 'Chinese Hibiscus')

        self.assertEqual(self.plant1.gps_coordinates, "100.0,100.0")
        self.assertEqual(self.plant1.image, "test1plant.jpg")




# Testing Feedback, doesn't require user directly, just requires string
class FeedbackTestCase(TestCase):
    def setUp(self):
        self.feedback = Feedback.objects.create(
            user='testUser',
            subject='I need help with test',
            description='The testing phase is quite long, need to cover all!'
        )

    def test_feedback(self):
        self.assertEqual(self.feedback.user, 'testUser')
        self.assertEqual(self.feedback.subject, 'I need help with test')
        self.assertEqual(self.feedback.description, 'The testing phase is quite long, need to cover all!')