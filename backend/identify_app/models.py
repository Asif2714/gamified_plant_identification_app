from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    '''
    User model with additional details 
    '''
    # We have first_name and last_name, but still using this for simplicity
    profile_name = models.CharField(max_length=255, blank=True, null=True) 
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    experience_points = models.PositiveIntegerField(default=0)
    last_login_date = models.DateField(null=True, blank=True)
    current_streak = models.PositiveIntegerField(default=0)
    average_confidence = models.FloatField(default=0.0)

class Achievement(models.Model):
    '''
    The achievements a user can earn
    '''

    user = models.OneToOneField(settings.AUTH_USER_MODEL, 
                                on_delete=models.CASCADE, 
                                related_name='achievements')
    # The achievements:
    first_identification = models.BooleanField(default=False)
    five_identifications = models.BooleanField(default=False)
    first_least_concern = models.BooleanField(default=False)
    first_near_threatened = models.BooleanField(default=False)
    first_vulnerable = models.BooleanField(default=False)  
    first_endangered = models.BooleanField(default=False)  
    first_critical = models.BooleanField(default=False) 
    xp_at_1000_or_more = models.BooleanField(default=False)
    
    # If added new achievements, increase the number in update_user_metrics

# Data to be used for spider graph
class UserMetrics(models.Model):
    '''
    Differnent quantitative metrics of the user to measure engagement
    '''
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='metrics')
    
    # The metrics:
    accuracy = models.FloatField(default=0.0)  # Average accuracy score from identifications
    variety = models.FloatField(default=0.0)  # Score based on exploring all conservation status such as LC, VU, etc.
    explorer = models.FloatField(default=0.0)  # Score based on the geographical diversity of plant locations
    achiever = models.FloatField(default=0.0)  # Score based on the percentage of achievements unlocked
    consistency = models.FloatField(default=0.0)  # Score based on the user's login streak, max 20 days



class Plant(models.Model):
    '''
    Details about plants identified and saved by a user
    '''
    user = models.ForeignKey(settings.AUTH_USER_MODEL, 
                             on_delete=models.CASCADE, 
                             related_name='plants')
    scientific_name = models.CharField(max_length=255)
    common_name = models.CharField(max_length=255)
    date_time_taken = models.DateTimeField()
    gps_coordinates = models.CharField(max_length=100) # Could use GeoDjango if required(!)
    image = models.ImageField(upload_to='plant_images/')
    rarity = models.CharField(max_length=30, default='None')
    confidence = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.common_name} ({self.scientific_name}) by {self.user.username}"


class Feedback(models.Model):
    '''
    Feedback submitted by users
    '''
    user = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    description = models.TextField()
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"By {self.user} on {self.date_submitted}"