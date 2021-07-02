# Generated by Django 3.2.4 on 2021-07-01 22:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Posting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(max_length=32)),
                ('position_level', models.CharField(default='', max_length=16)),
                ('position_type', models.CharField(max_length=64)),
                ('posting_url', models.URLField()),
                ('posting_due_date', models.DateField()),
                ('qualifications', models.TextField()),
                ('skills', models.TextField()),
                ('company', models.CharField(max_length=64)),
                ('place', models.CharField(max_length=32)),
                ('other', models.TextField()),
            ],
        ),
    ]