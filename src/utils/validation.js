export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    return password.length >= 6;
}
export function validateToken(){
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }
    const parsedToken = JSON.parse(token);
    if (!parsedToken.username || !parsedToken.exp) {
        return false;
    }
    if (Date.now() > parsedToken.exp) {
        localStorage.removeItem("token");
        return false;
    }
    return true;
    
}