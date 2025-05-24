# Webflow App: Getting Started Guide

Follow these steps to create and run your first workflow in the Webflow application.

## 1. Landing Page and Registration

- Open the Webflow application.  
- Click **Get Started** (top-right corner).
- On the Registration page, fill in:
  - **Username:** `testuser`
  - **Email:** `test@example.com`
  - **Password:** `password123`
- Click **Register** to create your account.

## 2. Login

- After registering, you'll be redirected to the login page.
- Enter your credentials:
  - **Username:** `testuser`
  - **Password:** `password123`
- Click **Login** to access your dashboard.

## 3. Create a Workflow

- On your dashboard, click **Create New Webflow**.
- In the popup, enter:
  - **Name:** `Test Workflow`
  - **Description:** `A simple test workflow with HTTP and functional nodes`
  - **Tags:** `test, demo`
- Click **Create**.

## 4. Open the Playground

- Click the **Test Workflow** card in your dashboard.
- The workflow opens in the playground editor.

## 5. Add Nodes and Connect Them

### Add an HTTP Node

- Click the **+** button (top-right controls).
- Select **HTTP Node**.
- Configure:
  - **Name:** `GET Request`
  - **URL:** `https://jsonplaceholder.typicode.com/users/1`
  - **Method:** `GET`
- Click **Save**.

### Add a Functional Node

- Click the **+** button again.
- Select **Functional Node**.
- Configure:
  - **Name:** `Process Response`
  - **Code:**
    ```js
    return { name: input.name, email: input.email };
    ```
- Click **Save**.

### Connect the Nodes

- Drag from the output port of the HTTP node to the input port of the Functional node.
- A line should connect the nodes.

## 6. Run the Workflow

- Click the **Play** button in the toolbar.
- The workflow executes:
  - The HTTP node requests data from the API.
  - The Functional node processes the response.
- Click each node to view input and output data.
