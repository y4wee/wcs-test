<script setup>
import { ref, set, onValue, remove } from "firebase/database";

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
        let argonauteId =
            argonauteNew.name.toLocaleLowerCase() +
            Math.floor(Math.random() * 1000000);
        set(ref($database, "/argonautes/" + argonauteId), {
            name: argonauteNew.name.toLocaleLowerCase(),
            description: argonauteNew.description.toLocaleLowerCase(),
            _id: argonauteId,
        })
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
// suppression d'un Argonaute
const removeArgonaute = (id) => {
    remove(ref($database, "/argonautes/" + id))
        .then(() => {
            alert(`${id} a été supprimé de l'équipage !`);
        })
        .catch((error) => {
            console.error(error);
        });
};

onMounted(() => {
    // recuperation de la liste des argonautes par firebase
    const argonautesRef = ref($database, "/argonautes");
    onValue(argonautesRef, (snapshot) => {
        if (snapshot.val()) {
            argonautesData.data = snapshot.val();
            argonautesData.number = Object.values(snapshot.val()).length;
        } else {
            argonautesData.number = 0;
        }
    });
});
</script>

<template>
    <div>
        <header class="header">
            <img
                class="headerCadre"
                src="~/assets/svg/greek_border_pink.svg"
                alt=""
            />
            <h1>
                <img
                    class="headerLogo"
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
                <img
                    class="memberControlParchment"
                    src="~/assets/svg/parchment.svg"
                    alt="svg d'un parchemin"
                />
                <h2>Ajouter un(e) Argonaute</h2>
                <form class="memberControlForm">
                    <label for="name">Nom de l'Argonaute :</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Charalampos"
                        minlength="1"
                        maxlength="14"
                        v-model="argonauteNew.name"
                    />
                    <label for="descritpion">Qualité de l'Argonaute :</label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Qualidos"
                        minlength="1"
                        maxlength="14"
                        v-model="argonauteNew.description"
                    />
                    <button
                        class="memberControlButton"
                        type="button"
                        @click="createArgonaute"
                    >
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
            </section>
            <!-- Member list -->
            <section class="memberList" v-else>
                <h2>Membres de l'équipage</h2>

                <div class="memberListGrid">
                    <div
                        class="memberCard"
                        v-for="argo in argonautesData.data"
                        :key="argo._id"
                    >
                        <div
                            class="memberCardRemove"
                            @click="removeArgonaute(argo._id)"
                        >
                            X
                        </div>
                        <img
                            src="~/assets/svg/greek_border_black.svg"
                            alt="ornement de la carte"
                        />
                        <h2 class="memberCardName">
                            {{ argo.name }}
                        </h2>
                        <h3
                            v-if="argo.description"
                            class="memberCardDescription"
                        >
                            {{ argo.description }}
                        </h3>
                    </div>
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
    font-family: "Norse", sans-serif;
    background: #f4f4f4;
    min-width: 320px;
    padding-bottom: 80px;
    & img {
        pointer-events: none;
        user-select: none;
    }
}
.header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
    text-align: center;
    &Cadre {
        position: absolute;
        width: 250px;
        height: 250px;
        opacity: 0.7;
        animation: cadreRotate 20s infinite linear;
    }
    &Logo {
        max-width: 96px;
        padding: 5px;
        background: #f4f4f4;
    }
    & h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        font-size: 2.5rem;
    }
}

.memberControl {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 350px;
    &Parchment {
        position: absolute;
        width: 95%;
        max-width: 400px;
    }
    & h2 {
        z-index: 2;
        text-decoration: underline #f76c6c;
    }
    &Form {
        z-index: 2;
        display: flex;
        flex-direction: column;
        & input {
            margin-bottom: 20px;
        }
    }
    &Button {
        font-family: "Norse", sans-serif;
        font-weight: bold;
        font-size: 1.5rem;
        border: none;
        background-color: #f76c6c;
        color: white;
        user-select: none;
        cursor: pointer;
    }
}

.memberEmpty {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    font-size: 1.5rem;
}
.memberList {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 50px 0;
    & h2 {
        text-decoration: underline #f76c6c;
        margin-bottom: 50px;
    }
    &Grid {
        width: 100%;
        max-width: 940px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(auto, 300px));
        grid-template-rows: auto;
        column-gap: 20px;
        row-gap: 20px;
        justify-items: center;
        justify-content: center;
    }
}
.memberCard {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background-color: white;
    & img {
        position: absolute;
        width: 250px;
    }
    &Description {
        color: #f76c6c;
    }
    &Remove {
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #f76c6c;
        color: white;
        font-size: 1.5rem;
        opacity: 0;
        transition: opacity 0.3s 0.3s ease-in-out;
        cursor: default;
        user-select: none;
    }
    &:hover .memberCardRemove {
        opacity: 1;
        cursor: pointer;
        transition: opacity 0.3s ease-in-out;
    }
}

footer {
    z-index: 5;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    background: #f76c6c;
    padding: 0.25em 0;
    font-family: "Roboto", sans-serif;
}

@keyframes cadreRotate {
    to {
        transform: rotateZ(360deg);
    }
}
</style>
