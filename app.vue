<script setup>
import { ref, set, onValue } from "firebase/database";

const { $database } = useNuxtApp();

//liste des argonautes
const argonautesData = reactive({
    data: {},
    number: -1,
});
//Detail du nouvel argonaute
const argonauteNew = reactive({
    name: "",
    description: "",
});

//creation d'un nouvel argonaute
const createArgonaute = () => {
    if (argonauteNew.name.length > 1) {
        set(
            ref(
                $database,
                "/argonautes/" + argonauteNew.name.toLocaleLowerCase()
            ),
            {
                name: argonauteNew.name.toLocaleLowerCase(),
                description: argonauteNew.description.toLocaleLowerCase(),
            }
        )
            .then(() => {
                alert(`${argonauteNew.name} a été ajouté dans l'équipage !`);
                argonauteNew.name = "";
                argonauteNew.description = "";
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert("veuillez rentrer un nom d'argonaute");
    }
};
onMounted(() => {
    // recuperation de la liste des argonautes par firebase
    const argonautesRef = ref($database, "/argonautes");
    onValue(argonautesRef, (snapshot) => {
        argonautesData.data = snapshot.val();
        argonautesData.number = Object.values(snapshot.val()).length;
    });
});
</script>

<template>
    <div>
        <header>
            <h1>
                <img
                    src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png"
                    alt="Wild Code School logo"
                />
                Les Argonautes
            </h1>
        </header>

        <!-- Main section -->
        <main>
            <!-- New member form -->
            <section class="memberControl" v-if="argonautesData.number < 50">
                <h2>Ajouter un(e) Argonaute</h2>
                <form class="new-member-form">
                    <label for="name">Nom de l&apos;Argonaute</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Charalampos"
                        minlength="1"
                        maxlength="14"
                        v-model="argonauteNew.name"
                    />
                    <input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Qualidos"
                        v-model="argonauteNew.description"
                    />
                    <button type="button" @click="createArgonaute">
                        Recruter
                    </button>
                </form>
            </section>

            <!-- memberlist full -->
            <section class="memberFull" v-else>
                <h2>L'équipage est au complet !</h2>
                <p>
                    Veuillez retirer un ou plusieurs Argonautes afin de pouvoir
                    en ajouter.
                </p>
            </section>

            <!-- member list empty -->
            <section class="memberEmpty" v-if="argonautesData.number === 0">
                <h2>L'équipage est vide...</h2>
                <p>Il faudrait penser à recruter des Argonautes ;)</p>
            </section>
            <!-- Member list -->
            <section class="memberList" v-else>
                <h2>Membres de l'équipage</h2>

                <div v-for="argo in argonautesData.data" :key="argo">
                    <h1>
                        {{ argo.name }}
                    </h1>
                    <h2 v-if="argo.description">
                        {{ argo.description }}
                    </h2>
                </div>
            </section>
        </main>

        <footer>
            <p>Réalisé par Jason en Anthestérion de l'an 515 avant JC</p>
        </footer>
    </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
@font-face {
    font-family: Norse;
    src: url("~/assets/font/Norse.otf") format("opentype");
}

@font-face {
    font-family: Norse;
    font-weight: bold;
    src: url("~/assets/font/Norsebold.otf") format("opentype");
}

body {
    margin: 0;
    font-family: "Roboto", sans-serif;
}

main {
    max-width: 960px;
    margin: 0 auto;
}

header {
    background: #f4f4f4;
    text-align: center;
    padding: 2em;
}

header img {
    max-width: 96px;
}

header h1 {
    font-size: 2.5em;
    font-family: "Norse", sans-serif;
    font-weight: bold;
}

h1,
h2 {
    text-align: center;
}

label {
    display: block;
    margin-bottom: 0.5em;
}

.new-member-form {
    margin: 2em 0 4em 0;
    text-align: center;
}

.member-item {
    padding: 0.25em 0;
}

footer {
    margin-top: 2em;
    text-align: center;
    color: #fff;
    background: #f76c6c;
    padding: 0.25em 0;
}
</style>
