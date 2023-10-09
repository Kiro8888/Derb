# Generated by Django 4.2.5 on 2023-10-09 00:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
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
                ('json', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Response',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response', models.TextField(blank=True, null=True)),
                ('questions', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='open_question.openquestion')),
            ],
        ),
    ]
