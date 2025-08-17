import * as admin from 'firebase-admin';
import { onCall } from 'firebase-functions/v2/https';

import { ProjectFunctions } from './projects/projects.function';

admin.initializeApp();

const projects = new ProjectFunctions();
export const deleteProjectAndTodos = onCall(projects.delete);
