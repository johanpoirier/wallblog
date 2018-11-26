import * as React from 'react';
import './Picture.css';

export interface Props {
    description: string;
    filename: string;
    extension: string;
}

function Picture({ description, filename, extension }: Props) {
    return (
        <div className="picture">
            <img src={ `/pictures/${filename}--640.${extension}` }
                 alt={filename}
                 className="wall"
                 srcSet={ `/pictures/${filename}--320.${extension} 320w,
                       /pictures/${filename}--640.${extension} 640w,
                       /pictures/${filename}--1024.${extension} 1024w,
                       /pictures/${filename}--1600.${extension} 1600w,
                       /pictures/${filename}.${extension} 2048w` }
                 sizes="(max-width: 160px) 99vw, (max-width: 320px) 50vw, 33.33vw" />
            {description}
        </div>
    );
}

export default Picture;
