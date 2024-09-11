export const validateEmail = (email)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const validatePass=(password)=>{
    return password.length > 5
}