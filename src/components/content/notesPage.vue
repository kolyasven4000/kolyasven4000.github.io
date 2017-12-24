<template>
	<div class="component">
            <notes
                :notes="collection"
                @addNote="addNote"
                @editNote="editNote"
                @saveNote="saveNote"
                @deleteNote="deleteNote">
            </notes>
        </div>
</template>

<script>
    import notes from './notes.vue';
    export default {
        name: "notesPage",
        data() {
        	return {
                collection: []
            }
        },
        methods:{
            addNote(note){
                note.image = "static/img/notes/default.jpg", 
                note.title = "Вопрос" 
                this.collection.push(note);
                console.log('addNote',note)
            },
            editNote(note){
                if(note && note.$note && this.collection.indexOf(note.$note) > -1){
                    this.collection[this.collection.indexOf(note.$note)].edit = !this.collection[this.collection.indexOf(note.$note)].edit;
                }
                console.log('editNote', note)
            },
            saveNote(note){
                if(note && note.$note && this.collection.indexOf(note.$note) > -1){
                    this.collection[this.collection.indexOf(note.$note)].quest = note.quest;
                }
                this.collection[this.collection.indexOf(note.$note)].edit = false;
                console.log('saveNote', note)
            },
            deleteNote(note){
                if(note && note.$note && this.collection.indexOf(note.$note) > -1){
                    this.collection.splice(this.collection.indexOf(note.$note), 1);
                }
                console.log('deleteNote', note)
            },
        },
        components:{
            notes
        }
    }
</script>

<style lang="scss" scoped>
	.notes {

	}
</style>