import React, {Component} from 'react'

class SearchBar extends Component
{
  constructor(props) {
    super(props);
  }
  filterUpdate() {
    const val = this.refs.clubSearchText.value;
    this.props.onChange(val);
  }
  render() {
    return (
      <header>
        <form
          className='club-search-container'
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            ref="clubSearchText"
            placeholder="Search for groups..."
            onChange={this.filterUpdate.bind(this)}
            className='club-search'
          />
        </form>
      </header>
    );
  }
}

export default SearchBar;
