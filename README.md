# Material Todo - A Modern Angular Task Manager

A free, lightweight, and open-source task manager, built with the latest version of Angular and designed according to Material Design principles.

You can use the live version of the application [here](https://to-note-angular-app.web.app)

---  

### Key Features

- **Modern & Fast:** Built with Angular 20 and standalone components for optimal performance.

- **Material Design:** A clean, intuitive, and fully responsive interface powered by Angular Material.

- **Open Source:** Transparent, community-driven, and completely free to use.

---  

### Tech Stack

- **Framework:** [Angular](https://angular.dev/ "null") (v20.x.x) with Standalone Components

- **UI Components:** [Angular Material](https://material.angular.io/ "null")

- **Backend & Database:** [Firebase](https://firebase.google.com/ "null") (Authentication, Firestore and Functions)

- **Styling:** SCSS & [Tailwind CSS](https://tailwindcss.com/ "null")

---  

## For Developers

Interested in running the project locally or contributing? Follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/ "null")

- [Angular CLI](https://angular.dev/tools/cli "null")

- A Google account for creating a Firebase project.

---  

### 2. Firebase Setup (Crucial Step)

This project requires a Firebase backend to function. You will need to set up your own free project on the [Firebase Console](https://console.firebase.google.com/ "null").

1. **Create a Web App** in your Firebase project.

2. Enable **Authentication** (with Email/Password and Google providers) and **Firestore Database** (in test mode to start).

3. Copy your Firebase configuration object into the `src/environments/environment.ts`(create from template). Do not commit.

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
ng serve  
```  

Navigate to `http://localhost:4200/`.
  
---  

### 4. Emulator Workflow

This project is configured to use the **Firebase Local Emulator Suite** for a safe, offline development environment. The necessary configuration (`firebase.json`) is already included in the repository.

#### Running the Development Environment

Before starting the emulators don't forget to build the functions.

**Start Emulators:**

```zsh
firebase emulators:start --only functions,auth,firestore
```

_Note: The first time you run this, Firebase will automatically download the required emulator software._

**Edit environment file**

To use emulators don't forget to edit
`src/environments/environment.ts`
and set `useEmulators: true`.

**Start Angular App:** In a second terminal, run:

```zsh
ng serve
```

_(The Emulator UI can be viewed at `http://127.0.0.1:4000`)_

#### **Cloud Functions**

Functions are written in TypeScript and must be compiled before running emulator to JavaScript.

- **To Build:**

```zsh
cd functions && npm run build 
```

or

```zsh
cd functions && npm build:watch
```

- **To Deploy:** (run from the project root)

```zsh
firebase deploy --only functions
```

---

### Theming

This project uses a custom Angular Material theme. To generate and apply a new color palette run the generator in your terminal.

```zsh
ng generate @angular/material:theme-color
```

The CLI will then prompt you for a primary color and path for a theme file(src/app/styles recommended).

Import the theme inside global styles.scss like:

```scss
@use "./app/styles/_theme-colors" as app;
```

and apply using:

```scss
@include mat.theme(color: app. $primary-palette);
```

### Developer Notes

- **Notifications:** To display user notifications, inject and use the `NotificationService`. It provides methods like `showSuccess('Message')` and `showError('Message')`.

- **Custom Icons:** To use custom SVG icons, place them in the `public/icons/` directory and register them via the `IconService`.

- **Reusable Dialogs:** For common tasks like getting user input or confirmation, use the provided generic material dialog components inside (src/app/components/dialogs), or create a custom one for more complex scenarios.

- **Mobile Detection:** Use the `IS_MOBILE` token to determine if the app is in mobile view.

---  

### License

Distributed under the GNU GENERAL PUBLIC LICENSE Version 3. See `LICENSE` for more information.
