import {Injectable, inject} from '@angular/core';
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
Timestamp, serverTimestamp,
} from '@angular/fire/firestore';
import {AuthService} from '../auth-service/auth.service';
import {Observable, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';

export interface Todo {
  id: string; // Firestore ID
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'done' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Timestamp;
  reminderDate?: Timestamp;
  projectId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type newTodoData = Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status'>;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private firestore: Firestore = inject(Firestore);
  private authService: AuthService = inject(AuthService);

  constructor() {
  }

  /**
   * Retrieves a real-time list of tasks for a specific project.
   * @param projectId - The ID (string) of the project to get tasks from.
   */
  getTodosByProject(projectId: string): Observable<Todo[]> {
    if (!projectId) {
      return of([]);
    }

    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of([]);
        }

        const todosRef = collection(this.firestore, `users/${user.uid}/todos`);
        const q = query(
          todosRef,
          where('projectId', '==', projectId),
          orderBy('createdAt', 'asc')
        );

        return collectionData(q, {idField: 'id'}) as Observable<Todo[]>;
      }),
      shareReplay(1),
    );
  }

  /**
   * Adds a new task to the specified project.
   * @param todoData - Object containing data for the new task (without id and userId)
   * @param userId - Current user's ID
   */
  async addTodo(
    todoData: newTodoData,
    userId: string
  ): Promise<void> {
    const todosRef = collection(this.firestore, `users/${userId}/todos`);
    const newTodo: Omit<Todo, 'id'> = {
      status: 'todo', // default status, can be overridden by passed todoData
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
    return updateDoc(todoRef, {projectId: newProjectId});
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
