const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hasLowercase(value) {
    return /[a-z]/.test(value);
}

function hasUppercase(value) {
    return /[A-Z]/.test(value);
}

function hasNumber(value) {
    return /\d/.test(value);
}

function hasSymbol(value) {
    return /[^A-Za-z0-9]/.test(value);
}

export function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}

export function getPasswordStrength(password) {
    if (!password) {
        return {
            score: 0,
            label: 'Enter a password',
            level: 'weak',
        };
    }

    let score = 0;

    if (password.length >= 8) {
        score += 1;
    }

    if (password.length >= 12) {
        score += 1;
    }

    if (hasLowercase(password) && hasUppercase(password)) {
        score += 1;
    }

    if (hasNumber(password) && hasSymbol(password)) {
        score += 1;
    }

    if (score <= 1) {
        return { score: Math.max(score, 1), label: 'Weak', level: 'weak' };
    }

    if (score === 2) {
        return { score, label: 'Fair', level: 'fair' };
    }

    if (score === 3) {
        return { score, label: 'Good', level: 'good' };
    }

    return { score: 4, label: 'Strong', level: 'strong' };
}

export function validateLoginForm(values) {
    const errors = {};
    const email = values.email?.trim() ?? '';
    const password = values.password ?? '';

    if (!email) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    }

    return errors;
}

export function validateRegisterForm(values) {
    const errors = {};
    const name = values.name?.trim() ?? '';
    const email = values.email?.trim() ?? '';
    const password = values.password ?? '';
    const confirmPassword = values.confirmPassword ?? '';

    if (!name) {
        errors.name = 'Full name is required.';
    } else if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters long.';
    }

    if (!email) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long.';
    } else if (!hasLowercase(password) || !hasUppercase(password) || !hasNumber(password) || !hasSymbol(password)) {
        errors.password = 'Use upper/lowercase letters, a number, and a symbol for stronger security.';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
}

export function validateForgotPasswordForm(values) {
    const errors = {};
    const email = values.email?.trim() ?? '';

    if (!email) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    return errors;
}
