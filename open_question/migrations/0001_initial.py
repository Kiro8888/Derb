# Generated by Django 4.2.5 on 2023-11-05 18:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='OpenQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('placeholder', models.CharField(blank=True, max_length=255, null=True)),
                ('help', models.CharField(blank=True, max_length=255, null=True)),
                ('list_order', models.IntegerField(blank=True, default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Response',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response', models.TextField(blank=True, null=True)),
                ('questions', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='open_question.openquestion')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Form',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title_form', models.CharField(max_length=255)),
                ('title_description', models.TextField(blank=True, null=True)),
                ('questions_form', models.ManyToManyField(to='open_question.openquestion')),
            ],
        ),
    ]
