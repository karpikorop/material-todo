import { singleton } from 'tsyringe';
import * as admin from 'firebase-admin';

@singleton()
export class FirebaseAdminService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    try {
      this.firebaseApp = admin.app();
    } catch {
      this.firebaseApp = admin.initializeApp();
    }
  }

  get app(): admin.app.App {
    return this.firebaseApp;
  }

  get firestore(): FirebaseFirestore.Firestore {
    return this.firebaseApp.firestore();
  }

  get auth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }

  get storage(): admin.storage.Storage {
    return this.firebaseApp.storage();
  }
}
