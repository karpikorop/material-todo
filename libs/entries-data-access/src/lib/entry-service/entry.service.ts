import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from 'auth-data-access';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { newTaskData, Task, getEntriesCollectionPath } from '@shared';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  /**
   * Retrieves a real-time list of tasks for a specific project.
   * @param projectId - The ID (string) of the project to get tasks from.
   */
  public getTasksByProject(projectId: string): Observable<Task[]> {
    if (!projectId) {
      return of([]);
    }

    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        const todosRef = collection(this.firestore, getEntriesCollectionPath(user.uid));
        const q = query(todosRef, where('projectId', '==', projectId), orderBy('createdAt', 'asc'));

        return collectionData(q, { idField: 'id' }) as Observable<Task[]>;
      }),
      shareReplay(1)
    );
  }

  /**
   * Adds a new task to the specified project.
   * @param todoData - Object containing data for the new task (without id and userId)
   * @param userId - Current user's ID
   */
  async addTodo(todoData: newTaskData, userId = this.authService.userSnapshot?.uid): Promise<void> {
    if (!userId) {
      throw new Error('No user logged in');
    }
    const todosRef = collection(this.firestore, getEntriesCollectionPath(userId));
    const newTodo: Omit<Task, 'id'> = {
      // default status can be overridden by passed todoData
      ...todoData,
      userId: userId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    await addDoc(todosRef, newTodo);
  }

  /**
   * Updates an existing task.
   * @param userId - Current user's ID
   * @param todoId - ID of the task to update
   * @param data - Object with fields to update
   */
  async updateTodo(
    userId: string,
    todoId: string,
    data: Partial<Omit<Task, 'id' | 'userId'>>
  ): Promise<void> {
    const todoRef = doc(this.firestore, `${getEntriesCollectionPath(userId)}/${todoId}`);
    return updateDoc(todoRef, {
      ...data,
      updatedAt: Date.now(),
    });
  }

  /**
   * Moves a task to another project.
   * @param userId - Current user's ID
   * @param todoId - ID of the task to move
   * @param newProjectId - ID of the new project
   */
  async moveTodo(userId: string, todoId: string, newProjectId: string): Promise<void> {
    const todoRef = doc(this.firestore, `${getEntriesCollectionPath(userId)}/${todoId}`);
    return updateDoc(todoRef, { projectId: newProjectId });
  }

  /**
   * Deletes a task.
   * @param userId - Current user's ID
   * @param todoId - ID of the task to delete
   */
  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const todoRef = doc(this.firestore, `${getEntriesCollectionPath(userId)}/${todoId}`);
    return deleteDoc(todoRef);
  }
}
