import * as React from 'react';
import Picture from './Picture';
import './Grid.css';
import {Item} from '../types';

interface GridProps {
  items: ReadonlyArray<Item>;
  loading: boolean;
  getItems: any;
}

class Grid extends React.Component<GridProps> {
  public componentDidMount() {
    this.props.getItems();
  }

  public render() {
    const {items} = this.props;
    return (
      <div className="grid">
        {this.loader()}
        {items.map((item, index) => (
          <Picture key={item.filename} index={index} filename={item.filename} description={item.description} extension={item.extension} ratio={item.ratio}/>
        ))}
  </div>
    );
  }

  private loader() {
    if (this.props.loading) {
      return (<p>Loading...</p>)
    }
    return;
  }
}

export default Grid;
