import type { FieldReport } from "./elpis";

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("elpis-field-intelligence", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("reports", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadReports() {
  const db = await openDb();
  return new Promise<FieldReport[]>((resolve, reject) => {
    const tx = db.transaction("reports", "readonly");
    const request = tx.objectStore("reports").getAll();
    tx.oncomplete = () => {
      db.close();
      resolve(request.result as FieldReport[]);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function saveReports(reports: FieldReport[]) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("reports", "readwrite");
    for (const report of reports) tx.objectStore("reports").put(report);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? new Error("Local storage transaction aborted"));
    };
  });
}
