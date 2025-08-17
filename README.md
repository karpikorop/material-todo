# Material Todo - A Modern Angular Task Manager

A free, lightweight, and open-source task manager, built with the latest version of Angular and designed according to Material Design principles. Organize your life with an elegant and intuitive interface that works beautifully on any device.

You can use the live version of the application [here](https://to-note-angular-app.web.app)

---  

### Key Features

- **Modern & Fast:** Built with Angular 20 and standalone components for optimal performance.

- **Secure Authentication:** User accounts are managed securely with Firebase Authentication, including email/password and Google sign-in.

- **Real-time Database:** Tasks are stored and synced in real-time across your devices using Firestore.

- **Material Design:** A clean, intuitive, and fully responsive interface powered by Angular Material.

- **Custom Icons:** Utilizes Material Symbols and a custom icon service for a unique look and feel.

- **Open Source:** Transparent, community-driven, and completely free to use.

---  

### Tech Stack

- **Framework:** [Angular](https://angular.dev/ "null") (v20)

- **UI Components:** [Angular Material](https://material.angular.io/ "null")

- **Backend & Database:** [Firebase](https://firebase.google.com/ "null") (Authentication, Firestore and Functions)

- **Styling:** SCSS & [Tailwind CSS](https://tailwindcss.com/ "null")

- **State Management:** Angular Signals

---  

## For Developers

Interested in running the project locally or contributing? Follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/ "null") (v18.13.0 or later)

- [Angular CLI](https://angular.dev/tools/cli "null") (v20.x.x)

- A Google account for creating a Firebase project.

---  

### 2. Firebase Setup (Crucial Step)

This project requires a Firebase backend to function. You will need to set up your own free project on the [Firebase Console](https://console.firebase.google.com/ "null").

1. **Create a Web App** in your Firebase project.

2. Enable **Authentication** (with Email/Password and Google providers) and **Firestore Database** (in test mode to start).

3. Copy your Firebase configuration object into the `src/environments/environment.ts` and `src/environments/environment.prod.ts` files.

---  

### 3. Local Installation & Setup

1. **Clone the repository:**

```  
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git  
cd YOUR_REPO_NAME  
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
`src/environments/environment.development.ts`
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
cd functions
npm run build 
//or 
npm build:watch
```

- **To Deploy:** (run from the project root)

```zsh
firebase deploy --only functions
```

### Developer Notes

- **Notifications:** To display user notifications, inject and use the `NotificationService`. It provides methods like `showSuccess('Title', 'Message')` and `showError('Title', 'Message')`.

- **Custom Icons:** To use custom SVG icons, place them in the `public/icons/` directory and register them via the `IconService`.

- **Project Structure:** The project uses a feature-based folder structure (`pages`, `components`, `layouts`, `services`) to keep code organized and scalable.

---  

### License

Distributed under the GNU GENERAL PUBLIC LICENSE Version 3. See `LICENSE` for more information.
