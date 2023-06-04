export const setLocalstorage = (user, userType) => {
    localStorage.setItem(
        'userData',
        JSON.stringify({
            id: user.uid,
            fullName: user.displayName,
            username: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            role: `${userType?.user_type > 1 ? 'student' : 'admin'}` || 'student',
            ability: [{
                action: 'manage',
                subject: 'all'
            }]
        })
    );
};