# Generated by Django 4.2.7 on 2024-04-07 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('identify_app', '0002_plant_confidence'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=255)),
                ('subject', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date_submitted', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
