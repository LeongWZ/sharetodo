# ShareTodo README

## Glossary
- [Introduction](#introduction)
- [How to run](#how-to-run)
  - [Prerequisites](#prerequisites)
  - [Server](#server)
  - [Client](#client)
- [Distinctiveness and Complexity](#distinctiveness-and-complexity)
  - [Distinctiveness](#distinctiveness)
  - [Complexity](#complexity)
- [File Structure](#file-structure)
  - [Server](#server-1)
  - [Client](#client-1)
- [Features](#features)
  - [Projects](#projects)
  - [Todos](#todos)
  - [Memberships](#memberships)
  - [Logs](#logs)

## Introduction
ShareTodo is a collaborative project management tool designed to help teams organize and manage their tasks efficiently.

The application allows multiple users to collaborate on shared projects, assign tasks, and track progress in real-time.

With a user-friendly interface and robust feature set, ShareTodo makes project management seamless and effective.

## How to run

You need to run both server and client sides in order for the web app to work. When using ShareTodo app, you will primarily be interacting with the client side.

### Prerequisites
1. Have Python 3 installed on your system
2. Have Node.js and npm installed on your system

### Server
1. Open a new terminal window
2. In the main working directory, run `cd server`
3. Run `cp .env.example .env` to copy the environment variables. Replace the envionment variables accordingly.
    - `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` variables are necessary for the 'forget password` functionality to work correctly. You may choose to ignore them if you are not using this.
    - `CLIENT_ENDPOINT` variable is the url from which your client is running, e.g. `CLIENT_ENDPOINT=http://localhost:5173`
4. Run `pip install -r requirements.txt` to install dependencies
5. To start the server, run `python3 manage.py runserver`

### Client
1. Open a new terminal window
2. In the main working directory, run `cd client`
3. Run `cp .env.example .env` to copy the environment variables. Replace the environment variables accordingly if needed.
    - `VITE_SERVER_ENDPOINT` variable is the url from which your server is running, e.g. `VITE_SERVER_ENDPOINT=http://127.0.0.1:8000`
    - `VITE_TOKEN_EXPIRATION_DAYS` variable specifies the expiration time for the auth token (in days). For example, `VITE_TOKEN_EXPIRATION_DAYS=7` means that the token will expire in 7 days.
4. Run `npm install` to install dependencies
5. To start the client, run `npm run dev`

## Distinctiveness and Complexity
The ShareTodo project stands out due to its unique combination of features and the complexity involved in implementing them. Unlike typical to-do list applications, ShareTodo is designed to facilitate collaboration among multiple users on shared projects. This collaborative aspect introduces several layers of complexity, including user authentication, role-based access control, real-time updates, and a sophisticated user interface.

### Distinctiveness

1. **Collaborative Projects**
Unlike traditional to-do list applications that are designed for individual use, ShareTodo allows multiple users to collaborate on shared projects. Each project can have multiple members, each with specific roles and permissions. This feature is distinct because it transforms a simple to-do list into a powerful project management tool.

2. **Role-Based Access Control**
ShareTodo implements a robust role-based access control system. Users can have different roles within a project, such as Admin or Member. Admins have full control over the project, including the ability to add or remove members and edit project details. Members, on the other hand, have limited permissions. This distinction in roles adds a layer of complexity to the application, ensuring that only authorized users can perform certain actions.

3. **Real-Time Updates**
The application supports real-time updates, ensuring that all users see the most current state of the project. This feature is particularly useful in a collaborative environment where multiple users may be making changes simultaneously. Implementing real-time updates required the use of polling, adding to the complexity of the project.

### Complexity
1. **User Authentication and Authorization**
Implementing a secure authentication system is a complex task. ShareTodo uses token-based authentication to ensure that only authorized users can access the application. Additionally, the role-based access control system requires careful planning and implementation to ensure that permissions are correctly enforced.

2. **Database Design**
The database schema for ShareTodo is more complex than a typical to-do list application. It includes multiple related tables, such as Users, Projects, Memberships, and Todos. Each table has specific relationships and constraints that must be managed to ensure data integrity. For example, the Memberships table links users to projects and defines their roles within each project.

3. **Frontend and Backend Integration**
ShareTodo is a full-stack application, requiring seamless integration between the frontend and backend. The frontend is built using React, while the backend is powered by Django and Django REST Framework. Ensuring that these two components communicate effectively involves handling API requests, managing state, and updating the UI in response to changes.

4. **Real-Time Functionality**
Implementing real-time updates adds significant complexity to the project. This feature is achieved using polling provided by Tanstack Query. Periodic requests are made to the server to fetch the latest data and update the client.

5. **User Interface Design**
The user interface of ShareTodo is designed to be intuitive and user-friendly. This involves creating responsive layouts, handling user interactions, and providing feedback to the user. The UI must also handle various states, such as loading, error, and success states, to ensure a smooth user experience.

To achieve this, ShareTodo extensively uses Material-UI (MUI), a popular React component library that provides a wide range of pre-built components and styles. MUI helps in creating a consistent and visually appealing design across the application. The use of MUI's Grid system ensures that the layout is responsive and adapts to different screen sizes.

Additionally, the application makes extensive use of modals, provided by MUI, to enhance the user experience. Modals are used for various interactions, such as creating and editing todos, managing project memberships, and displaying detailed information. These modals provide a clean and focused interface for users to perform specific actions without navigating away from the main view. The usage of MUI components contributes to a seamless and efficient user experience.

## File Structure

### Server
The `server` folder contains the backend code for the ShareTodo application. It is built using Django and Django REST Framework (DRF) for the API. The folder structure is organized as follows:

- **sharetodo/**: This is the main Django project folder.
  - **settings.py**: This file contains the configuration settings for the Django project, including database settings, installed apps, and middleware.
  - **urls.py**: This file defines the URL patterns for the Django project. It includes the routes for the API endpoints.
- **api/**: This folder contains the Django apps for the API.
  - **models.py**: This file defines the database models for the application. Examples include `Project`, `Membership`, and `Todo`.
  - **serializers.py**: This file defines the serializers for converting model instances to JSON and vice versa. Examples include `ProjectSerializer` and `MembershipSerializer`.
  - **views.py**: This file contains the view functions and classes for handling API requests. Examples include `ProjectListView` and `MembershipDetail`.
  - **urls.py**: This file defines the URL patterns for the API endpoints.
  - **permissions.py**: This file contains custom permission classes for controlling access to the API endpoints.

### Client
The `client` folder contains the frontend code for the ShareTodo application. It is built using React and Material-UI (MUI) for the user interface. The folder structure is organized as follows:

- **src/**: This folder contains the source code for the React application.
  - **components/**: This folder contains reusable React components used throughout the application. Examples include `TodoItem`, `LoadingPage`, and `ProjectCard`.
  - **hooks/**: This folder contains custom React hooks used for managing state and side effects. Examples include `useToken` and `useTodoForm`.
  - **routes/**: This folder contains the route components for the application. Each route corresponds to a different page in the application. Examples include `Login`, `ForgetPassword`, and `ResetPassword`. The application uses file-based routing provided by Tanstack Router, which allows routes to be defined based on the file structure. This approach simplifies the routing setup and makes it easier to manage and navigate the codebase. Each file in the `routes` folder represents a route, and the folder structure reflects the nested routes in the application.
  - **services/**: This folder contains the code for interacting with the backend API. It includes functions for making API requests and handling responses. Examples include `auth/endpoint.js` and `projects/endpoint.js`.
  - **App.jsx**: This file is the main component that sets up the routing and renders the application.
  - **main.jsx**: This file is the entry point for the React application. It renders the `App` component and mounts it to the DOM.

This file structure ensures a clear separation of concerns and makes it easy to navigate and maintain the codebase. The `client` folder handles the frontend logic and user interface, while the `server` folder handles the backend logic and API endpoints.

## Features

### Projects
- **Create Projects**: Users can create new projects and define the project title and description.
- **View Projects**: Users can view a list of all projects they are a part of, sorted by the most recently created.
- **Edit Projects**: Admins can edit project details, including the title and description.
- **Delete Projects**: Admins can delete projects, removing them from the system.

### Todos
- **Create Todos**: Users can create new todos within a project, specifying details such as title, description, due date, and priority.
- **View Todos**: Users can view a list of todos within a project, including details such as title, description, due date, and priority.
- **Edit Todos**: Users can edit existing todos to update details such as title, description, due date, and priority.
- **Delete Todos**: Users can delete todos that are no longer needed.
- **Checkable Items**: Users can add checkable items to todos, allowing for more granular tracking of tasks within a todo.
- **Mark as Done**: Users can mark todos and checkable items as done, indicating completion.

### Memberships
- **Add Members**: Admins can add new members to a project by specifying their email address and role (Admin or Member).
- **View Members**: Users can view a list of all members in a project, including their roles.
- **Edit Roles**: Admins can edit the roles of existing members, changing their permissions within the project.
- **Remove Members**: Admins can remove members from a project.
- **Role-Based Access Control**: The application enforces role-based access control, ensuring that only authorized users can perform certain actions. Admins have full control over the project, while members have limited permissions.
    - Unlike members, admins can modify the project name, add/remove members and modify their roles.

### Logs
- **View Logs**: Users can view a log of all actions taken within a project, including the creation, editing, and deletion of todos.
- **Action Details**: Each log entry includes details such as the user who performed the action, the action taken, and the timestamp.

These features make ShareTodo a powerful and flexible tool for managing projects and collaborating with team members. The application is designed to be intuitive and user-friendly, ensuring that users can easily navigate and utilize its functionalities.

