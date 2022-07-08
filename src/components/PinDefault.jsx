import * as React from 'react';

// Line up svg with parent element
const defaultStyles = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)'
}

export const MapPin = (props) => {
  const {index, height, width, backgroundColor, textColor} = props;
  
  return (
    <svg width={width} height={height} fill={backgroundColor ? backgroundColor : 'red'} viewBox="0 0 30 38" style={defaultStyles}>
      <path x="50%" y="40%" d="M30 15.0882C30 23.4212 23.3333 30.7353 15 38C7.22222 31.2941 0 23.4212 0 15.0882C0 6.75523 6.71573 0 15 0C23.2843 0 30 6.75523 30 15.0882Z"/>
      <text x="50%" y="40%" fontSize="16px" fontWeight="bold" dominantBaseline="middle" textAnchor="middle" fill={textColor ? textColor : 'white'}>{index}</text>		
    </svg>
  )
}

export default React.memo(MapPin);
