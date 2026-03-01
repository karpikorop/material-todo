interface FirestoreSnapshotLike {
  id: string;
  exists: boolean;
  data(): any;
}

export function mapFirestoreSnapshot<T = any>(snapshot: FirestoreSnapshotLike): T | undefined {
  if (!snapshot?.exists) {
    return undefined;
  }
  const data = snapshot.data();
  if (!data) {
    return undefined;
  }

  return {
    ...(data as T),
    id: snapshot.id,
  };
}
