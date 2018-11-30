import * as React from 'react';
import Picture from './Picture';
import './Picture.css';
import {Item} from "../types";

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
        {items.map(item => (
          <Picture key={item.filename} filename={item.filename} description={item.description} extension={item.extension}/>
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
