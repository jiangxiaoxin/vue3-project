import copy from "./copy"
import container from "./container"

export default {
    test: {
        mounted: (el: HTMLElement) => {
            console.log('test mounted');
        },
        updated: (el: HTMLElement) => {
            console.log('test updated')
        }
    },
    copy: copy,
    container: container
}