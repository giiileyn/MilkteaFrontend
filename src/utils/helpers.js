export const authenticate = (data, next) => {
    if (window !== 'undefined') {
        // console.log('authenticate', response)
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    next();
};
// export const getToken = () => {
//     if (window !== 'undefined') {
//         if (localStorage.getItem('token')) {
//             return localStorage.getItem('token');
//         } else {
//             return false;
//         }
//     }
// };

export const getToken = () => {
    return localStorage.getItem('token'); // Ensure the key matches your storage key
};

// access user name from session storage
export const getUser = () => {
    if (window !== 'undefined') {
        if (localStorage.getItem('user')) {
            return JSON.parse(localStorage.getItem('user'));
        } else {
            return false;
        }
    }
};
// remove token from session storage
export const logout = next => {
    if (window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    next();
};