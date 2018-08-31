export const setData = (type, name, value) => ({
    type: 'SET_DATA',
    data:{
        name,
        value
    }
    // name: value
});

export const getData = (type,value) => ({
    type,
    data: value
});
