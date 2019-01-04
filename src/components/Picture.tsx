import * as React from 'react';
import './Picture.css';
import {Item} from '../types';

function Picture({description, filename, extension, ratio, index}: Item) {
  const className = ratio > 1 ? 'landscape' : 'portrait';
  const size = (index === 0 ? 40 : 20) * ((ratio <= 1) ? 1 : ratio);
  return (
    <div className={`picture picture-${className}`}>
      <img src={`/pictures/${filename}--1024.${extension}`}
           alt={filename}
           className="wall"
           srcSet={`/pictures/${filename}--320.${extension} 320w,
                       /pictures/${filename}--640.${extension} 640w,
                       /pictures/${filename}--1024.${extension} 1024w,
                       /pictures/${filename}--1600.${extension} 1600w,
                       /pictures/${filename}.${extension} 2048w`}
           sizes={`${size}vw`}/>
      <span>{description}</span>
    </div>
  );
}

export default Picture;
