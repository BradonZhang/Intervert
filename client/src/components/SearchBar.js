import React, {Component} from 'react'

class Search extends Component
{
    filterUpdate()
    {
        const val = this.refs.myValue.value;
        console.log(val)
    }
    render()
    {
        return(
            <header>
                <form>
                    <input
                        type="text"
                        ref="myValue"
                        placeholder="Type to filter..."
                        onChange={this.filterUpdate.bind(this)}
                    />
                </form>
            </header>
        )
    }
}

export default Search