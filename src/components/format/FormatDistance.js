export const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`
    }
    return `${distance} m`
  }