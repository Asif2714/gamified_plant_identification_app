# Generated by Django 4.2.7 on 2024-02-25 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('identify_app', '0002_plant_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='plant',
            name='rarity',
            field=models.CharField(default='None', max_length=30),
        ),
    ]
