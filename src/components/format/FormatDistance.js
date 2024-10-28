// export const formatDistance = (distance) => {
//     if (distance >= 1000) {
//       return `${(distance / 1000).toFixed(1)} km`
//     }
//     return `${distance} m`
//   }

export const formatDistance = (distance) => {
  if (distance >= 1) {
    return `${Math.round(distance)}km`;
  } else {
    return `${Math.round(distance * 1000)}m`;
  }
};