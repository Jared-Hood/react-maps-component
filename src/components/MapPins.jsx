import { renderToStaticMarkup } from 'react-dom/server';

const pinDefault = ({index, backgroundColor, textColor}) => {
  return (
    'data:image/svg+xml,' + encodeURIComponent(renderToStaticMarkup(
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 15.0882C30 23.4212 23.3333 30.7353 15 38C7.22222 31.2941 0 23.4212 0 15.0882C0 6.75523 6.71573 0 15 0C23.2843 0 30 6.75523 30 15.0882Z" fill={backgroundColor ? backgroundColor : 'red'}/>
        <text x="50%" y="50%" fontSize="16px" fontWeight="bold" dominantBaseline="middle" textAnchor="middle" fill={textColor ? textColor : 'white'}>{index}</text>		
      </svg>
    ))
	)
}

const pinHovered = (props) => {
  const hoveredBackgroundColor = props.backgroundColor ? props.backgroundColor : 'green';
  return pinDefault({...props, backgroundColor: hoveredBackgroundColor});
}

const pinSelected = (props) => {
  const selectedBackgroundColor = props.backgroundColor ? props.backgroundColor : 'blue';
  return pinDefault({...props, backgroundColor: selectedBackgroundColor});
}

export {
  pinDefault,
  pinHovered,
  pinSelected
}
