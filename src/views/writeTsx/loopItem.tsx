
import {defineComponent} from "vue"
export default defineComponent({

    props: ['count'],
    setup(props) {

        const getItems = (count:string) => {
            let time = parseInt(count)
            let items: any[] = [];

            for(let i=0;i<time;i++) {
                items.push(<li>list item:{i}</li>)
            }
            return items;
        }

        return {
            getItems
        }
    },
    render() {
        return <ul>
            
            {this.getItems(this.count)}
        </ul>
    }
})