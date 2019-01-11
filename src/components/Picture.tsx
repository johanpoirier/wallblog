import * as React from 'react';
import './Picture.css';
import {Item} from '../types';

function Picture({description, date, filename, extension, ratio, index, allocatedWidth}: Item) {
  const className = ratio > 1 ? 'landscape' : 'portrait';
  const size = allocatedWidth * ((ratio <= 1) ? 1 : ratio);
  const dateFormat = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
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
      {descriptionTag(description)}
      <span className="date">{dateFormat.format(new Date(date))}</span>
    </div>
  );
}

function descriptionTag(description: string) {
  if (description) {
    return <span className="description">{description}</span>;
  }
  return '';
}

export default Picture;
