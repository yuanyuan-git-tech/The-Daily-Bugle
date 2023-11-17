# The Daily Bugle - CS4260 Internet Scale Applications Web Application Project

This project, "The Daily Bugle," is designed for CS4260 Internet Scale Applications at UVA. Here is an overview of the architecture and functionalities:

## Functionalities

- Any authenticated user can comment.
- Only the Author role can create or edit a story.
- The view for an anonymous user is a list of stories.
- The view for an anonymous user contains an ad.
- The view for a logged-in user displays one story at a time, with appropriate edit controls.
- The view for an Author user does not contain an ad.
- An ad event can be an impression (view) or interaction (click).
- An ad event should record the userid or anon, IP address, and user agent.

## Architecture Design

[Architecture Design - Lucidchart](https://lucid.app/lucidchart/51bacf6c-e81c-44bd-885c-e226e68cf29a/edit?viewport_loc=-2786%2C-1592%2C7494%2C3742%2C0_0&invitationId=inv_3c36a19b-d0cb-497c-a32d-f20e1ee8a686)

## Overview

- **Static HTML File**: Served by an Apache container.
- **Backend**: Utilizes three Node.js containers.
- **Database**: MongoDB container.

## How to Run

To run the application, follow these steps:

1. Clone this repository.
2. Navigate to the project directory.
3. Run the following command to build the Docker containers:

   ```bash
   docker-compose --build

This command will build the necessary Docker containers and start the application. Once the process completes, you can access the application at `localhost/dailybugle`.
