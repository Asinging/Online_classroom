export const setLocalstorage = (user, userType) => {
    let localData = {
        id: user.uid,
        fullName: userType.f_name,
        username: user.displayName,
        email: user.email,
        avatar: userType.avatar || user.avatar,
        role: `${userType?.user_type > 1 ? 'student' : 'admin'}` || 'student',
        ability: [{
            action: 'manage',
            subject: 'all'
        }]
    }
    localStorage.setItem(
        'userData',
        JSON.stringify(localData)
    );
    return localData
};