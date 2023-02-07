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

class Image {
    constructor(id, name, url, uploadTime, uploadBy) {
        this.id = id
        this.name = name
        this.url = url
        this.uploadTime = uploadTime
        this.uploadBy = uploadBy
    }
    data() {
        return {
            name: this.name,
            url: this.url,
            uploadTime: this.uploadTime,
            uploadBy: this.uploadBy
        }
    }
}

export { Note, Member, Image }