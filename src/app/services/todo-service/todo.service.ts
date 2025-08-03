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
  where,
  orderBy,
  writeBatch,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from '../auth-service/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface Todo {
  id: string; // Firestore ID
  title: string;
  description?: string;
  status: 'todo' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  reminderDate?: number;
  projectId: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {}

  /**
   * Retrieves a real-time list of tasks for a specific project.
   * @param projectId - The ID of the project to get tasks from.
   */
  getTodosByProject(projectId: Observable<string>): Observable<Todo[]> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }
        return projectId.pipe(
          switchMap((pId) => {
            if (!pId) {
              return of([]);
            }
            const todosRef = collection(
              this.firestore,
              `users/${user.uid}/todos`
            );
            const q = query(
              todosRef,
              where('projectId', '==', pId),
              orderBy('createdAt', 'asc')
            );
            return collectionData(q, { idField: 'id' }) as Observable<Todo[]>;
          })
        );
      })
    );
  }

  /**
   * Adds a new task to the specified project.
   * @param todoData - Object containing data for the new task (without id and userId)
   * @param userId - Current user's ID
   */
  async addTodo(
    todoData: Omit<Todo, 'id' | 'userId'>,
    userId: string
  ): Promise<void> {
    const todosRef = collection(this.firestore, `users/${userId}/todos`);
    const newTodo = {
      ...todoData,
      userId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'todo',
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
    data: Partial<Omit<Todo, 'id' | 'userId'>>
  ): Promise<void> {
    const todoRef = doc(this.firestore, `users/${userId}/todos/${todoId}`);
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
  async moveTodo(
    userId: string,
    todoId: string,
    newProjectId: string
  ): Promise<void> {
    const todoRef = doc(this.firestore, `users/${userId}/todos/${todoId}`);
    return updateDoc(todoRef, { projectId: newProjectId });
  }

  /**
   * Deletes a task.
   * @param userId - Current user's ID
   * @param todoId - ID of the task to delete
   */
  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const todoRef = doc(this.firestore, `users/${userId}/todos/${todoId}`);
    return deleteDoc(todoRef);
  }
}
