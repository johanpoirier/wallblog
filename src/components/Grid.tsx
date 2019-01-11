import * as React from 'react';
import Picture from './Picture';
import './Grid.css';
import {Item} from '../types';
import {throttle} from 'throttle-debounce';

const GRID_ITEM_WIDTH = 300;

interface GridProps {
  items: ReadonlyArray<Item>;
  loading: boolean;
  columnCount: number;
  getItems: any;
  setGridColumnCount: any;
}

class Grid extends React.Component<GridProps> {
  public componentDidMount() {
    this.props.getItems();

    this.updateColumnCount();
    window.addEventListener('resize', this.updateColumnCount());
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateColumnCount());
  }

  public render() {
    const {items, columnCount} = this.props;
    return (
      <div className="grid">
        {this.loader()}
        {items.map((item, index) => (
          <Picture
            date={item.date}
            key={item.filename}
            index={index}
            filename={item.filename}
            description={item.description}
            extension={item.extension}
            ratio={item.ratio}
            allocatedWidth={(index === 0 ? 200 : 100) / columnCount}
          />
        ))}
      </div>
    );
  }

  public updateColumnCount() {
    return throttle(200, () => this.props.setGridColumnCount(Math.round(window.innerWidth / GRID_ITEM_WIDTH)));
  }

  private loader() {
    if (this.props.loading) {
      return (<p>Loading...</p>)
    }
    return;
  }
}

export default Grid;
