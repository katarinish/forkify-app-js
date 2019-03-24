export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike({id, title, author, img}) {
        const like = {
            id,
            title,
            author,
            img,
        };
        this.likes.push(like);

        // Persist data in the localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(elem => elem.id === id);
        this.likes.splice(index, 1);

        // Persist data in the localStorage
        this.persistData();

    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    retrieveData() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from the LocalStorage
        if (storage) this.likes = storage;
    }

    isLiked(id) {
        return this.likes.findIndex(elem => elem.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}
