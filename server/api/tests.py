from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import User, Project, Membership

class ProjectListTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.project_data = {
            'title': 'Test Project'
        }

    def test_get_projects(self):
        # Create a project and membership
        project = Project.objects.create(title='Test Project')
        Membership.objects.create(user=self.user, project=project, role=Membership.Role.ADMIN)

        # Make GET request
        response = self.client.get(reverse('project-list'))

        # Check response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check response data
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Project')

    def test_create_project(self):
        # Make POST request
        response = self.client.post(reverse('project-list'), self.project_data, format='json')

        # Check response status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check response data
        self.assertEqual(response.data['title'], 'Test Project')

        # Check that the project was created
        self.assertEqual(Project.objects.count(), 1)
        self.assertEqual(Project.objects.get().title, 'Test Project')

        # Check that the membership was created
        self.assertEqual(Membership.objects.count(), 1)
        self.assertEqual(Membership.objects.get().user, self.user)
        self.assertEqual(Membership.objects.get().project.title, 'Test Project')
        self.assertEqual(Membership.objects.get().role, Membership.Role.ADMIN)

    def test_create_project_invalid_data(self):
        # Make POST request with invalid data
        invalid_data = self.project_data.copy()
        invalid_data['title'] = ''  # Title is required
        response = self.client.post(reverse('project-list'), invalid_data, format='json')

        # Check response status
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Check that the project was not created
        self.assertEqual(Project.objects.count(), 0)