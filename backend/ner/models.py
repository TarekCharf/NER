from django.db import models
from django.conf import settings

class Sentence(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sentences"
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:50]


class Entity(models.Model):
    class Label(models.TextChoices):
        PERSON = "PER"
        ORGANIZATION = "ORG"
        LOCATION = "LOC"
        MISCELLANEOUS = "MISC"
        OTHER = "O"

    text = models.TextField()
    start = models.IntegerField()
    end = models.IntegerField()
    label = models.CharField(max_length=100, choices=Label.choices, default=Label.OTHER)
    sentence = models.ForeignKey(
        Sentence,
        on_delete=models.CASCADE,
        related_name="entities"  
    )

    def __str__(self):
        return f"{self.text} ({self.label})"