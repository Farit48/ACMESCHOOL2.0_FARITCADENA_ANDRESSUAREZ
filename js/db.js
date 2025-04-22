export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MiBaseDeDatos", 2); 

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("usuarios")) {
                const store = db.createObjectStore("usuarios", { keyPath: "id" });
                store.createIndex("email", "email", { unique: true }); 
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}