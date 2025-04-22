export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MiBaseDeDatos", 2); 

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
        
            if (!db.objectStoreNames.contains("usuarios")) {
                const store = db.createObjectStore("usuarios", { keyPath: "id" });
                store.createIndex("email", "email", { unique: true });
            }
        
            if (!db.objectStoreNames.contains("cursos")) {
                db.createObjectStore("cursos", { keyPath: "id" });
            }
        
            if (!db.objectStoreNames.contains("estudiantes")) {
                db.createObjectStore("estudiantes", { keyPath: "id" });
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