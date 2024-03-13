export const getParams = (object) => {
  let cleanObj = {};
  for (let key in object) {
    const value = object?.[key];
    if (value !== null && value !== undefined && value !== '') {
      cleanObj[key] = value;
    }
  }

  let params = '';

  for (let key in cleanObj) {
    const value = cleanObj?.[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params += `${key}=${Array.isArray(value) ? JSON.stringify(value) : value}&`;
      }
    } else if (value !== null && value !== undefined && value !== '') {
      params += `${key}=${value}&`;
    }
  }

  return params;
};
