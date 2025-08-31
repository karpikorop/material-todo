import {Injectable, inject} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  setDoc,
  Timestamp,
  serverTimestamp,
} from '@angular/fire/firestore';
import {AuthService} from '../auth-service/auth.service';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Functions, httpsCallable} from '@angular/fire/functions';

export interface Project {
  id: string; // Firestore ID
  name: string;
  icon: string;
  createdAt: Timestamp;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);
  private readonly functions: Functions = inject(Functions);

  /**
   * Observable containing the list of projects for the current user,
   * sorted by creation time (ascending).
   */
  projects$: Observable<Project[]> = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (user) {
        const projectsRef = collection(
          this.firestore,
          `users/${user.uid}/projects`
        );
        const q = query(projectsRef, orderBy('createdAt', 'asc'));

        return collectionData(q, {idField: 'id'}) as Observable<Project[]>;
      } else {
        return of([]);
      }
    })
  );

  /**
   * Creates a default "Inbox" project for a new user.
   * @param userId - ID of the new user
   */
  async createDefaultInbox(userId: string): Promise<void> {
    const inboxProject: Omit<Project, 'id'> = {
      name: 'Inbox',
      createdAt: serverTimestamp() as Timestamp, // unreliable
      userId: userId,
      icon: 'inbox',
    };
    const inboxRef = doc(this.firestore, `users/${userId}/projects/inbox`);
    await setDoc(inboxRef, inboxProject);
  }

  /**
   * Adds a new project for the current user.
   * @param name - Name of the new project
   * @param userId - ID of the current user
   */
  async addProject(name: string, userId: string): Promise<string> {
    const newProject: Omit<Project, 'id'> = {
      name: name,
      createdAt: serverTimestamp() as Timestamp, // unreliable
      userId: userId,
      icon: 'folder',
    };
    const projectsRef = collection(this.firestore, `users/${userId}/projects`);
    const docRef = await addDoc(projectsRef, newProject);
    return docRef.id;
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
   * Uses cloud function to perform the deletion.
   * @param userId - ID of the current user
   * @param projectId - ID of the project to delete
   */
  async deleteProject(userId: string, projectId: string): Promise<void> {
    const deleteProjectFn = httpsCallable(
      this.functions,
      'deleteProjectAndTodos'
    );

    try {
      console.log(`Calling cloud function to delete project: ${projectId}`);
      const result = await deleteProjectFn({projectId: projectId});
      console.log('Cloud function executed:', result.data);
    } catch (error) {
      console.error(
        'An unknown error occurred while calling the function:',
        error
      );
      throw error;
    }
  }
}
