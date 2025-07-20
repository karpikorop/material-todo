# Material Todo - A Modern Angular Task Manager

A free, lightweight, and open-source task manager, built with the latest version of Angular and designed according to Material Design principles. Organize your life with an elegant and intuitive interface that works beautifully on any device.

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

- **Backend & Database:** [Firebase](https://firebase.google.com/ "null") (Authentication & Firestore)

- **Styling:** SCSS & [Tailwind CSS](https://tailwindcss.com/ "null")

- **State Management:** Angular Signals

---

## For Users

You can use the live version of the application here:

[Link to your live application]

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

### Developer Notes

- **Notifications:** To display user notifications, inject and use the `NotificationService`. It provides methods like `showSuccess('Title', 'Message')` and `showError('Title', 'Message')`.

- **Custom Icons:** To use custom SVG icons, place them in the `public/icons/` directory and register them via the `IconService`.

- **Project Structure:** The project uses a feature-based folder structure (`pages`, `components`, `layouts`, `services`) to keep code organized and scalable.

---

### License

Distributed under the MIT License. See `LICENSE` for more information.
