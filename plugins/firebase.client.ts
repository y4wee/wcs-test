import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: config.apikey,
        authDomain: config.authDomain,
        databaseURL: "https://wcs-test-4c6a6-default-rtdb.europe-west1.firebasedatabase.app/",
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        measurementId: config.measurementId,
      };

    const app = initializeApp(firebaseConfig)
    const database = getDatabase(app);

    nuxtApp.provide('database', database);

})