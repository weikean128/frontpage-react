class Story {
    constructor(name, wait_checkpoint, intent, intentConditions, actions, return_checkpoint) {
        this.name = name
        this.wait_checkpoint = wait_checkpoint
        this.intent = intent
        this.intentConditions = intentConditions
        this.actions = actions
        this.return_checkpoint = return_checkpoint
    }
}

export default Story