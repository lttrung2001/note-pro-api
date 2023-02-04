class Note {
    constructor(id, title, content, lastModified) {
        this.id = id
        this.title = title
        this.content = content,
        this.lastModified = lastModified
    }

    data() {
        return {
            title: this.title,
            content: this.content,
            lastModified: this.lastModified
        }
    }
}

class Member {
    constructor(id, role, isPin) {
        this.id = id
        this.role = role
        this.isPin = isPin
    }

    data() {
        return {
            role: this.role,
            isPin: this.isPin
        }
    }
}

export { Note, Member }