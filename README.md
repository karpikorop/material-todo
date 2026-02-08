# Material Todo - A Modern Angular Task Manager

A straightforward, responsive task manager built to demonstrate a modern, full-stack architecture using Angular, Firebase, and Nx.

You can use the live version of the application [here](https://to-note-angular-app.web.app)

---

## Key Features

- Modern & Fast: Built with Angular 21, leveraging Standalone Components for optimal performance.

- Monorepo Architecture: Structured using Nx to organize the frontend application and cloud functions efficiently.

- Material Design: A clean, functional interface powered by Angular Material and Tailwind CSS v4.

- Real-time & Secure: Powered by Firebase for instant data syncing, secure authentication, and cloud-based storage.

---

### Tech Stack

- **Workspace:** [Nx](https://nx.dev/ 'null') (Monorepo handling Main App + Cloud Functions)

- **Framework:** [Angular](https://angular.dev/ 'null') (v21.x.x) with Standalone Components

- **UI Components:** [Angular Material](https://material.angular.io/ 'null')

- **Backend & Database:** [Firebase](https://firebase.google.com/ 'null') (Authentication, Firestore and Storage) & [Google Cloud Functions](https://cloud.google.com/functions 'null')

- **Styling:** SCSS & [Tailwind CSS](https://tailwindcss.com/ 'null')

---

## For Developers

Interested in running the project locally or contributing? Follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/ 'null')

- [Angular CLI](https://angular.dev/tools/cli 'null')

- A Google account for creating a Firebase project.

---

### 2. Firebase Setup (Crucial Step)

This project requires a Firebase backend to function. You will need to set up your own free project on the [Firebase Console](https://console.firebase.google.com/ 'null').

1. **Create a Web App** in your Firebase project.

2. Enable **Authentication** (with Email/Password and Google providers) and **Firestore Database** (in test mode to start).

3. Copy your Firebase configuration object into the `apps/main-app/src/environments/firebase.config.ts`(create from template). Do not commit.

4. Check **the Infrastructure** section below to configure the infrastructure for a new environment.

---

### 3. Local Installation & Setup

1. **Clone the repository:**

```
git clone https://github.com/karpikorop/material-todo.git
```

2. **Install dependencies:**

```
npm install
```

3. **Run the development server:**

```
npm start
```

Navigate to `http://localhost:4200/`.

---

### 4. Emulator Workflow

This project is configured to use the **Firebase Local Emulator Suite** for a safe, local development environment. The necessary configuration (`firebase.json`) is already included in the repository.

#### Running the Development Environment

Before starting the emulators don't forget to build the functions.

**Start Emulators:**

```zsh
firebase emulators:start --only functions,auth,firestore,storage
```

_Note: The first time you run this, Firebase will automatically download the required emulator software._

**Edit environment file**

To use emulators don't forget to edit
`src/environments/environment.ts`
and set `useEmulators: true`.

**Start Angular App:** In a second terminal, run:

```zsh
npm start
```

_(The Emulator UI can be viewed at `http://127.0.0.1:4000`)_

#### **Cloud Functions**

Functions are written in TypeScript and must be compiled before running emulator to JavaScript.

- **To Build:**

```zsh
npm run build functions
```

or

```zsh
nx run functions:build
```

- **To Deploy:** (run from the project root)

```zsh
firebase deploy --only functions
```
- Deploy a single function:
```zsh
firebase deploy --only functions:functionName
```

---

## Infrastructure

This project uses **Terraform** to create storage buckets automatically. This ensures that every environment has consistent settings without manual configuration in the Google Cloud Console.

### Architecture
* **Terraform:** Automates the creation of physical resources.
* **Firebase CLI:** Handles the deployment of application logic.

### Setup Guide

Follow these steps to configure the infrastructure for a new environment.

**0. Install [Terraform](https://developer.hashicorp.com/terraform/install)**

**1. Authenticate**
Terraform requires local Google Cloud credentials to create resources.
```zsh
gcloud auth application-default login
```

**2. Configure Secrets** A `terraform.tfvars` file must be created in the terraform/ directory to define project-specific variables.
```zsh
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```
- Open the newly created `terraform/terraform.tfvars` file.
- Set `project_id` to the target Firebase Project ID.
- Set region to the matching Cloud Functions region (e.g., us-central1).

**3. Create Resources** Run the following commands to initialize Terraform and provision the buckets:
```zsh
npm run terraform:init
npm run terraform:apply
```
Type `yes` in the terminal to confirm the action.

---

## Deploying rules & indexes

Application logic (Security Rules, Indexes, Functions) is managed via the Firebase CLI.

### Updating Rules & Indexes

It is possible to update security rules or database indexes without re-deploying the entire application (hosting/functions).

**Update Security Rules (Firestore & Storage)**
```zsh
npm run deploy:rules
```
- Updates firestore.rules and storage.rules.
- Apply this after changing permissions.

### Update Database Indexes

```zsh
npm run deploy:indexes
```

- Updates firestore.indexes.json.
- Run this if firestore.indexes.json has been changed.

---

## Theming

This project uses a custom Angular Material theme. To generate and apply a new color palette run the generator in your terminal.

```zsh
nx g @angular/material:theme-color --project=main-app
```

The CLI will then prompt you for a primary color and path for a theme file(src/app/styles recommended).

Import the theme inside global styles.scss like:

```scss
@use './app/styles/_theme-colors' as app;
```

and apply using:

```scss
@include mat.theme(color: app. $primary-palette);
```

## Developer Notes

- **Notifications:** To display user notifications, inject and use the `NotificationService`. It provides methods like `showSuccess('Message')` and `showError('Message')`.

- **Custom Icons:** To use custom SVG icons, place them in the `public/icons/` directory and register them via the `IconService`.

- **Reusable Dialogs:** For common tasks like getting user input or confirmation, use the provided generic material dialog components inside (src/app/components/dialogs), or create a custom one for more complex scenarios.

- **Mobile Detection:** Use the `IS_MOBILE` token to determine if the app is in mobile view.

---

### License

Distributed under the GNU GENERAL PUBLIC LICENSE Version 3. See `LICENSE` for more information.
