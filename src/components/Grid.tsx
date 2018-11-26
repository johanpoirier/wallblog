import * as React from 'react';
import Picture from './Picture';
import './Picture.css';

export interface Props {
    items: ReadonlyArray<any>;
}

function Grid({items}: Props) {
    return (
        <div className="grid">
            {items.map(item => (
                <Picture filename={item.filename} description={item.description} extension={item.extension}/>
            ))}
        </div>
    );
}

export default Grid;
