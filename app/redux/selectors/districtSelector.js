export const getSearchDistrictSelector = (state) => state.customerFormFoundDistricts;
export const getObjectDistrictSelector = (state) => state.districtsObject;



export const getArrDistrictSelector = (state) => {
    const arr = [];
    Object.entries(state.districtsObject).forEach(([key, value]) => {
        arr.push({id: key, value }); 
    });
    return arr;
};