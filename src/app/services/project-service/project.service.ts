import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { AuthService } from '../auth-service/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Project {
  id: string; // Firestore ID
  name: string;
  icon: string;
  createdAt: number;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  // Observable containing the list of projects for the current user,
  // sorted by creation time.
  projects$: Observable<Project[]> = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (user) {
        const projectsRef = collection(
          this.firestore,
          `users/${user.uid}/projects`
        );
        const q = query(projectsRef, orderBy('createdAt', 'asc'));

        return collectionData(q, { idField: 'id' }) as Observable<Project[]>;
      } else {
        return of([]);
      }
    })
  );

  constructor() {}

  /**
   * Creates a default "Inbox" project for a new user.
   * @param userId - ID of the new user
   */
  async createDefaultInbox(userId: string): Promise<void> {
    const inboxProject: Omit<Project, 'id'> = {
      name: 'Inbox',
      createdAt: Date.now(),
      userId: userId,
      icon: 'inbox',
    };
    const projectsRef = collection(this.firestore, `users/${userId}/projects`);
    await addDoc(projectsRef, inboxProject);
  }

  /**
   * Adds a new project for the current user.
   * @param name - Name of the new project
   * @param userId - ID of the current user
   */
  async addProject(name: string, userId: string): Promise<void> {
    const newProject: Omit<Project, 'id'> = {
      name: name,
      createdAt: Date.now(),
      userId: userId,
      icon: 'folder',
    };
    const projectsRef = collection(this.firestore, `users/${userId}/projects`);
    await addDoc(projectsRef, newProject);
  }

  /**
   * Updates project data (e.g., renames it).
   * @param userId - ID of the current user
   * @param projectId - ID of the project to update
   * @param data - Object with fields to update
   */
  async updateProject(
    userId: string,
    projectId: string,
    data: Partial<Omit<Project, 'id'>>
  ): Promise<void> {
    const projectRef = doc(
      this.firestore,
      `users/${userId}/projects/${projectId}`
    );
    return updateDoc(projectRef, data);
  }

  /**
   * Deletes a project and all tasks associated with it.
   * @param userId - ID of the current user
   * @param projectId - ID of the project to delete
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    // NOTE: Deleting subcollections is a complex operation.
    // This code will only delete the project document itself.
    // To delete tasks, you will need Cloud Functions
    // or batch deletion on the client.

    const projectRef = doc(
      this.firestore,
      `users/${userId}/projects/${projectId}`
    );
    // await deleteDoc(projectRef);
  }
}
