class Note {
    constructor(id, title, content, lastModified) {
        this.id = id
        this.title = title
        this.content = content,
        this.lastModified = lastModified
    }
}

class Member {
    constructor(id, role, isPin) {
        this.id = id
        this.role = role
        this.isPin = isPin
    }
}

export { Note, Member }